"use server";

import { createClient } from "@/lib/supabase/server";
import { onboardingService } from "@/lib/services";
import type { OnboardingData } from "@/types/onboarding";

/**
 * Load onboarding progress from database
 */
export async function loadOnboardingProgressAction(): Promise<{
  success: boolean;
  data?: { currentStep: number; data: Partial<OnboardingData> };
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await onboardingService.loadOnboardingProgress(user.id);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data ?? undefined };
  } catch {
    return { success: false, error: "Failed to load progress" };
  }
}

/**
 * Save onboarding progress to database
 */
export async function saveOnboardingProgressAction(
  currentStep: number,
  data: Partial<OnboardingData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await onboardingService.saveOnboardingProgress(
      user.id,
      currentStep,
      data
    );

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to save progress" };
  }
}

/**
 * Complete onboarding
 */
export async function completeOnboardingAction(
  data: OnboardingData,
  locale?: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await onboardingService.completeOnboarding(user.id, data, locale);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[completeOnboardingAction] Exception:", error);
    return { success: false, error: "Failed to complete onboarding" };
  }
}

/**
 * Check if user needs onboarding
 */
export async function checkNeedsOnboardingAction(): Promise<{
  success: boolean;
  needsOnboarding?: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await onboardingService.needsOnboarding(user.id);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, needsOnboarding: result.data };
  } catch {
    return { success: false, error: "Failed to check onboarding status" };
  }
}
