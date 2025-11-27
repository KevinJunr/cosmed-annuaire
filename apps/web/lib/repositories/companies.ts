import { createClient } from "@/lib/supabase/server";
import type {
  Company,
  CompanyInsert,
  CompanyUpdate,
  UserCompany,
  UserCompanyInsert,
} from "@/types";
import {
  RepositoryResult,
  success,
  failure,
  failureFromPostgrest,
  Errors,
} from "./base";

/**
 * Get company by ID
 */
export async function getCompanyById(
  id: string
): Promise<RepositoryResult<Company>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("Company"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get company by name (for checking duplicates)
 */
export async function getCompanyByName(
  name: string
): Promise<RepositoryResult<Company | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .ilike("name", name)
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Search companies by name
 */
export async function searchCompanies(
  query: string,
  limit = 10
): Promise<RepositoryResult<Company[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .ilike("name", `%${query}%`)
    .limit(limit);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data || []);
}

/**
 * Create a new company
 */
export async function createCompany(
  company: CompanyInsert
): Promise<RepositoryResult<Company>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .insert(company)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return failure(Errors.alreadyExists("Company"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Update company
 */
export async function updateCompany(
  id: string,
  updates: CompanyUpdate
): Promise<RepositoryResult<Company>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("Company"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Delete company
 */
export async function deleteCompany(
  id: string
): Promise<RepositoryResult<boolean>> {
  const supabase = await createClient();

  const { error } = await supabase.from("companies").delete().eq("id", id);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(true);
}

/**
 * Get all companies for a user
 */
export async function getUserCompanies(
  userId: string
): Promise<RepositoryResult<(UserCompany & { company: Company })[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_companies")
    .select(
      `
      *,
      company:companies(*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data || []);
}

/**
 * Add user to company with a role
 */
export async function addUserToCompany(
  userCompany: UserCompanyInsert
): Promise<RepositoryResult<UserCompany>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_companies")
    .insert(userCompany)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return failure(Errors.alreadyExists("User-Company relation"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Remove user from company
 */
export async function removeUserFromCompany(
  userId: string,
  companyId: string
): Promise<RepositoryResult<boolean>> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_companies")
    .delete()
    .eq("user_id", userId)
    .eq("company_id", companyId);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(true);
}

/**
 * Update user role in company
 */
export async function updateUserCompanyRole(
  userId: string,
  companyId: string,
  role: "admin" | "profile_manager" | "payment_manager" | "user"
): Promise<RepositoryResult<UserCompany>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_companies")
    .update({ role })
    .eq("user_id", userId)
    .eq("company_id", companyId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return failure(Errors.notFound("User-Company relation"));
    }
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get companies by sector
 */
export async function getCompaniesBySector(
  sectorId: string,
  limit = 50
): Promise<RepositoryResult<Company[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("sector_id", sectorId)
    .limit(limit);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data || []);
}

/**
 * Get premium companies
 */
export async function getPremiumCompanies(
  limit = 50
): Promise<RepositoryResult<Company[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("is_premium", true)
    .limit(limit);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data || []);
}
