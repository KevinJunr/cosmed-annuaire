import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileInsert, ProfileUpdate, OnboardingPurpose, CompanyRole } from "@/types";
import {
  RepositoryResult,
  success,
  failure,
  failureFromPostgrest,
  Errors,
} from "./base";

/**
 * Get profile by ID
 */
export async function getProfileById(id: string): Promise<RepositoryResult<Profile>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("Profile"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Create a new profile (usually done by trigger, but can be manual)
 */
export async function createProfile(
  profile: ProfileInsert
): Promise<RepositoryResult<Profile>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return failure(Errors.alreadyExists("Profile"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Update profile
 */
export async function updateProfile(
  id: string,
  updates: ProfileUpdate
): Promise<RepositoryResult<Profile>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("Profile"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(
  profileId: string
): Promise<RepositoryResult<boolean>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", profileId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("Profile"));
    }
    return failureFromPostgrest(error);
  }

  return success(data.onboarding_completed ?? false);
}

/**
 * Complete onboarding with all data
 */
export async function completeOnboarding(
  profileId: string,
  data: {
    firstName: string;
    lastName: string;
    departmentId: string;
    positionId: string;
    companyId?: string | null;
    companyRole?: CompanyRole;
    onboardingPurpose: OnboardingPurpose;
    preferredLanguage?: string;
  }
): Promise<RepositoryResult<Profile>> {
  return updateProfile(profileId, {
    first_name: data.firstName,
    last_name: data.lastName,
    department_id: data.departmentId,
    position_id: data.positionId,
    company_id: data.companyId ?? null,
    company_role: data.companyRole ?? "user",
    onboarding_purpose: data.onboardingPurpose,
    onboarding_completed: true,
    preferred_language: data.preferredLanguage ?? null,
  });
}

/**
 * Update user profile info (first name, last name, department, position)
 */
export async function updateProfileInfo(
  profileId: string,
  info: {
    firstName: string;
    lastName: string;
    departmentId: string;
    positionId: string;
  }
): Promise<RepositoryResult<Profile>> {
  return updateProfile(profileId, {
    first_name: info.firstName,
    last_name: info.lastName,
    department_id: info.departmentId,
    position_id: info.positionId,
  });
}

/**
 * Set onboarding purpose
 */
export async function setOnboardingPurpose(
  profileId: string,
  purpose: OnboardingPurpose
): Promise<RepositoryResult<Profile>> {
  return updateProfile(profileId, { onboarding_purpose: purpose });
}

/**
 * Link profile to company
 */
export async function linkToCompany(
  profileId: string,
  companyId: string,
  role: CompanyRole = "user"
): Promise<RepositoryResult<Profile>> {
  return updateProfile(profileId, {
    company_id: companyId,
    company_role: role,
  });
}

/**
 * Unlink profile from company
 */
export async function unlinkFromCompany(
  profileId: string
): Promise<RepositoryResult<Profile>> {
  return updateProfile(profileId, {
    company_id: null,
    company_role: "user",
  });
}

/**
 * Get profiles by company ID
 */
export async function getProfilesByCompanyId(
  companyId: string
): Promise<RepositoryResult<Profile[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("company_id", companyId);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data || []);
}

/**
 * Delete profile
 */
export async function deleteProfile(
  id: string
): Promise<RepositoryResult<boolean>> {
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(true);
}
