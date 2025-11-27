import { createClient } from "@/lib/supabase/server";
import type { User, UserInsert, UserUpdate } from "@/types";
import {
  RepositoryResult,
  success,
  failure,
  failureFromPostgrest,
  Errors,
} from "./base";

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<RepositoryResult<User>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("User"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get user by email
 */
export async function getUserByEmail(
  email: string
): Promise<RepositoryResult<User>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("User"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get user by phone
 */
export async function getUserByPhone(
  phone: string
): Promise<RepositoryResult<User>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("phone", phone)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("User"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Create a new user
 */
export async function createUser(
  user: UserInsert
): Promise<RepositoryResult<User>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return failure(Errors.alreadyExists("User"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  updates: UserUpdate
): Promise<RepositoryResult<User>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("User"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(
  userId: string
): Promise<RepositoryResult<boolean>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("onboarding_completed")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("User"));
    }
    return failureFromPostgrest(error);
  }

  return success(data.onboarding_completed);
}

/**
 * Mark user onboarding as completed
 */
export async function completeOnboarding(
  userId: string
): Promise<RepositoryResult<User>> {
  return updateUser(userId, { onboarding_completed: true });
}

/**
 * Update user profile (first name, last name, department, position)
 */
export async function updateUserProfile(
  userId: string,
  profile: {
    firstName: string;
    lastName: string;
    departmentId: string;
    position: string;
  }
): Promise<RepositoryResult<User>> {
  return updateUser(userId, {
    first_name: profile.firstName,
    last_name: profile.lastName,
    department_id: profile.departmentId,
    position: profile.position,
  });
}

/**
 * Set user onboarding purpose
 */
export async function setOnboardingPurpose(
  userId: string,
  purpose: "SEARCH" | "REGISTER" | "BOTH"
): Promise<RepositoryResult<User>> {
  return updateUser(userId, { onboarding_purpose: purpose });
}

/**
 * Delete user (soft delete would be better in production)
 */
export async function deleteUser(
  id: string
): Promise<RepositoryResult<boolean>> {
  const supabase = await createClient();

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(true);
}
