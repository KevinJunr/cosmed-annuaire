"use server";

import { createClient } from "@/lib/supabase/server";
import { profilesRepository } from "@/lib/repositories";

/**
 * Update user's preferred language
 */
export async function updatePreferredLanguageAction(
  language: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await profilesRepository.updateProfile(user.id, {
      preferred_language: language,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to update language" };
  }
}

/**
 * Get user's profile data
 */
export async function getProfileAction(): Promise<{
  success: boolean;
  profile?: {
    firstName: string | null;
    lastName: string | null;
    preferredLanguage: string | null;
  };
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const result = await profilesRepository.getProfileById(user.id);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return {
      success: true,
      profile: {
        firstName: result.data.first_name,
        lastName: result.data.last_name,
        preferredLanguage: result.data.preferred_language,
      },
    };
  } catch {
    return { success: false, error: "Failed to get profile" };
  }
}
