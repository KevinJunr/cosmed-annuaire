import { usersRepository, companiesRepository } from "@/lib/repositories";
import {
  RepositoryResult,
  success,
  failure,
} from "@/lib/repositories/base";
import type { User, Company, CompanyInsert } from "@/types";
import type { OnboardingData, OnboardingPurpose } from "@/types/onboarding";

/**
 * Complete onboarding result
 */
export interface CompleteOnboardingResult {
  user: User;
  company: Company | null;
}

/**
 * Complete the onboarding process for a user
 * This handles all the business logic for finalizing onboarding:
 * 1. Update user profile information
 * 2. Set onboarding purpose
 * 3. Handle company association (existing, new, or none)
 * 4. Mark onboarding as completed
 */
export async function completeOnboarding(
  userId: string,
  data: OnboardingData
): Promise<RepositoryResult<CompleteOnboardingResult>> {
  // 1. Update user profile
  const profileResult = await usersRepository.updateUserProfile(userId, {
    firstName: data.firstName,
    lastName: data.lastName,
    departmentId: data.departmentId,
    position: data.position,
  });

  if (profileResult.error) {
    return failure(profileResult.error);
  }

  // 2. Set onboarding purpose
  if (data.purpose) {
    const purposeResult = await usersRepository.setOnboardingPurpose(
      userId,
      data.purpose
    );
    if (purposeResult.error) {
      return failure(purposeResult.error);
    }
  }

  // 3. Handle company
  let company: Company | null = null;

  if (data.companyChoice === "existing" && data.selectedCompanyId) {
    // Link user to existing company
    const companyResult = await companiesRepository.getCompanyById(
      data.selectedCompanyId
    );
    if (companyResult.error) {
      return failure(companyResult.error);
    }
    company = companyResult.data;

    // Add user to company as regular user
    const linkResult = await companiesRepository.addUserToCompany({
      user_id: userId,
      company_id: data.selectedCompanyId,
      role: "user",
    });
    if (linkResult.error && linkResult.error.code !== "ALREADY_EXISTS") {
      return failure(linkResult.error);
    }
  } else if (data.companyChoice === "new" && data.newCompanyData) {
    // Create new company
    const companyInsert: CompanyInsert = {
      name: data.newCompanyData.companyName,
      rcs: data.newCompanyData.rcs || null,
      country_id: data.newCompanyData.country || null, // country code for now, will be FK later
      address: data.newCompanyData.address || null,
      created_by: userId,
    };

    const createResult = await companiesRepository.createCompany(companyInsert);
    if (createResult.error) {
      return failure(createResult.error);
    }
    company = createResult.data;

    // Add user to company as admin (they created it)
    const linkResult = await companiesRepository.addUserToCompany({
      user_id: userId,
      company_id: company.id,
      role: "admin",
    });
    if (linkResult.error) {
      return failure(linkResult.error);
    }
  }
  // If companyChoice === "none", no company association needed

  // 4. Mark onboarding as completed
  const completeResult = await usersRepository.completeOnboarding(userId);
  if (completeResult.error) {
    return failure(completeResult.error);
  }

  return success({
    user: completeResult.data,
    company,
  });
}

/**
 * Check if a user needs onboarding
 */
export async function needsOnboarding(
  userId: string
): Promise<RepositoryResult<boolean>> {
  const result = await usersRepository.hasCompletedOnboarding(userId);

  if (result.error) {
    // If user not found, they need onboarding (new user)
    if (result.error.code === "NOT_FOUND") {
      return success(true);
    }
    return failure(result.error);
  }

  return success(!result.data);
}

/**
 * Get user onboarding status and data
 */
export async function getOnboardingStatus(userId: string): Promise<
  RepositoryResult<{
    isCompleted: boolean;
    purpose: OnboardingPurpose | null;
    hasCompany: boolean;
  }>
> {
  const userResult = await usersRepository.getUserById(userId);

  if (userResult.error) {
    return failure(userResult.error);
  }

  const user = userResult.data;
  const companiesResult = await companiesRepository.getUserCompanies(userId);

  return success({
    isCompleted: user.onboarding_completed,
    purpose: user.onboarding_purpose,
    hasCompany: companiesResult.data ? companiesResult.data.length > 0 : false,
  });
}

/**
 * Reset user onboarding (for testing/admin purposes)
 */
export async function resetOnboarding(
  userId: string
): Promise<RepositoryResult<User>> {
  return usersRepository.updateUser(userId, {
    onboarding_completed: false,
    onboarding_purpose: null,
    first_name: null,
    last_name: null,
    department_id: null,
    position: null,
  });
}
