import { createClient } from "@/lib/supabase/server";
import type { Onboarding, Json } from "@/types";
import {
  RepositoryResult,
  success,
  failure,
  failureFromPostgrest,
  Errors,
} from "./base";

/**
 * Onboarding data stored in JSONB
 */
export interface OnboardingData {
  purpose?: "SEARCH" | "REGISTER" | "BOTH" | null;
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  positionId?: string;
  companyChoice?: "existing" | "new" | "none";
  selectedCompanyId?: string | null;
  newCompanyData?: {
    companyName: string;
    rcs?: string;
    countryId: string;
    address?: string;
  } | null;
}

/**
 * Get onboarding state for a profile
 */
export async function getOnboardingState(
  profileId: string
): Promise<RepositoryResult<Onboarding | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("onboarding")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Create or update onboarding state (upsert)
 */
export async function saveOnboardingState(
  profileId: string,
  currentStep: number,
  data: OnboardingData
): Promise<RepositoryResult<Onboarding>> {
  const supabase = await createClient();

  // Try to upsert
  const { data: result, error } = await supabase
    .from("onboarding")
    .upsert(
      {
        profile_id: profileId,
        current_step: currentStep,
        data: data as unknown as Json,
      },
      {
        onConflict: "profile_id",
      }
    )
    .select()
    .single();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(result);
}

/**
 * Update onboarding step only
 */
export async function updateOnboardingStep(
  profileId: string,
  currentStep: number
): Promise<RepositoryResult<Onboarding>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("onboarding")
    .update({ current_step: currentStep })
    .eq("profile_id", profileId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("Onboarding state"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Update onboarding data only
 */
export async function updateOnboardingData(
  profileId: string,
  newData: Partial<OnboardingData>
): Promise<RepositoryResult<Onboarding>> {
  const supabase = await createClient();

  // First get current data
  const currentResult = await getOnboardingState(profileId);
  if (currentResult.error) {
    return currentResult as RepositoryResult<Onboarding>;
  }

  if (!currentResult.data) {
    return failure(Errors.notFound("Onboarding state"));
  }

  const currentData = (currentResult.data.data as OnboardingData) || {};
  const mergedData = { ...currentData, ...newData };

  const { data, error } = await supabase
    .from("onboarding")
    .update({ data: mergedData as unknown as Json })
    .eq("profile_id", profileId)
    .select()
    .single();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Delete onboarding state (called when onboarding is complete)
 */
export async function deleteOnboardingState(
  profileId: string
): Promise<RepositoryResult<boolean>> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("onboarding")
    .delete()
    .eq("profile_id", profileId);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(true);
}

/**
 * Check if onboarding state exists
 */
export async function hasOnboardingState(
  profileId: string
): Promise<RepositoryResult<boolean>> {
  const result = await getOnboardingState(profileId);

  if (result.error) {
    return result as RepositoryResult<boolean>;
  }

  return success(result.data !== null);
}

/**
 * Initialize onboarding for a profile (create empty state)
 */
export async function initializeOnboarding(
  profileId: string
): Promise<RepositoryResult<Onboarding>> {
  return saveOnboardingState(profileId, 1, {});
}
