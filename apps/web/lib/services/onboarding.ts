import {
  profilesRepository,
  companiesRepository,
  onboardingRepository,
} from "@/lib/repositories";
import {
  RepositoryResult,
  success,
  failure,
} from "@/lib/repositories/base";
import type { Profile, Company, CompanyInsert } from "@/types";
import type { OnboardingData, OnboardingPurpose } from "@/types/onboarding";

/**
 * Complete onboarding result
 */
export interface CompleteOnboardingResult {
  profile: Profile;
  company: Company | null;
}

/**
 * Complete the onboarding process for a user
 * This handles all the business logic for finalizing onboarding:
 * 1. Create company if needed
 * 2. Update profile with all info
 * 3. Delete temporary onboarding state
 */
export async function completeOnboarding(
  profileId: string,
  data: OnboardingData,
  locale?: string
): Promise<RepositoryResult<CompleteOnboardingResult>> {
  let company: Company | null = null;
  let companyId: string | null = null;
  let companyRole: "admin" | "user" = "user";

  // 1. Handle company creation/selection first
  if (data.companyChoice === "existing" && data.selectedCompanyId) {
    // Link to existing company as regular user
    const companyResult = await companiesRepository.getCompanyById(
      data.selectedCompanyId
    );
    if (companyResult.error) {
      return failure(companyResult.error);
    }
    company = companyResult.data;
    companyId = data.selectedCompanyId;
    companyRole = "user";
  } else if (data.companyChoice === "new" && data.newCompanyData) {
    // Create new company
    const companyInsert: CompanyInsert = {
      name: data.newCompanyData.companyName,
      legal_id: data.newCompanyData.legalId || null,
      legal_id_type: data.newCompanyData.legalIdType || null,
      country_id: data.newCompanyData.countryId || null,
      address: data.newCompanyData.address || null,
      created_by: profileId,
    };

    const createResult = await companiesRepository.createCompany(companyInsert);
    if (createResult.error) {
      return failure(createResult.error);
    }
    company = createResult.data;
    companyId = company.id;
    companyRole = "admin"; // Creator is admin
  }
  // If companyChoice === "none", no company association needed

  // 2. Complete onboarding on profile (updates all fields at once)
  const completeResult = await profilesRepository.completeOnboarding(profileId, {
    firstName: data.firstName,
    lastName: data.lastName,
    departmentId: data.departmentId,
    positionId: data.positionId,
    companyId: companyId,
    companyRole: companyRole,
    onboardingPurpose: data.purpose!,
    preferredLanguage: locale,
  });

  if (completeResult.error) {
    return failure(completeResult.error);
  }

  // 3. Delete temporary onboarding state
  await onboardingRepository.deleteOnboardingState(profileId);

  return success({
    profile: completeResult.data,
    company,
  });
}

/**
 * Check if a user needs onboarding
 */
export async function needsOnboarding(
  profileId: string
): Promise<RepositoryResult<boolean>> {
  const result = await profilesRepository.hasCompletedOnboarding(profileId);

  if (result.error) {
    // If profile not found, they need onboarding (trigger might not have run yet)
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
export async function getOnboardingStatus(profileId: string): Promise<
  RepositoryResult<{
    isCompleted: boolean;
    purpose: OnboardingPurpose | null;
    hasCompany: boolean;
  }>
> {
  const profileResult = await profilesRepository.getProfileById(profileId);

  if (profileResult.error) {
    return failure(profileResult.error);
  }

  const profile = profileResult.data;

  return success({
    isCompleted: profile.onboarding_completed ?? false,
    purpose: profile.onboarding_purpose as OnboardingPurpose | null,
    hasCompany: profile.company_id !== null,
  });
}

/**
 * Reset user onboarding (for testing/admin purposes)
 */
export async function resetOnboarding(
  profileId: string
): Promise<RepositoryResult<Profile>> {
  // Delete any existing onboarding state
  await onboardingRepository.deleteOnboardingState(profileId);

  // Reset profile
  return profilesRepository.updateProfile(profileId, {
    onboarding_completed: false,
    onboarding_purpose: null,
    first_name: null,
    last_name: null,
    department_id: null,
    position_id: null,
    company_id: null,
    company_role: "user",
  });
}

/**
 * Save onboarding progress (called at each step)
 */
export async function saveOnboardingProgress(
  profileId: string,
  currentStep: number,
  data: Partial<OnboardingData>
): Promise<RepositoryResult<boolean>> {
  const result = await onboardingRepository.saveOnboardingState(
    profileId,
    currentStep,
    data as onboardingRepository.OnboardingData
  );

  if (result.error) {
    return failure(result.error);
  }

  return success(true);
}

/**
 * Load onboarding progress
 */
export async function loadOnboardingProgress(
  profileId: string
): Promise<RepositoryResult<{ currentStep: number; data: Partial<OnboardingData> } | null>> {
  const result = await onboardingRepository.getOnboardingState(profileId);

  if (result.error) {
    return failure(result.error);
  }

  if (!result.data) {
    return success(null);
  }

  return success({
    currentStep: result.data.current_step ?? 1,
    data: (result.data.data as Partial<OnboardingData>) || {},
  });
}
