import { createClient } from "@/lib/supabase/server";
import type { Company, CompanyInsert, CompanyUpdate } from "@/types";
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
 * Get company by legal ID (DUNS or SIREN)
 */
export async function getCompanyByLegalId(
  legalId: string
): Promise<RepositoryResult<Company | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("legal_id", legalId)
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get company by legal ID with country details
 */
export async function getCompanyByLegalIdWithCountry(
  legalId: string
): Promise<RepositoryResult<CompanyWithCountry | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      country:countries(id, code, name_key)
    `)
    .eq("legal_id", legalId)
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Check if legal ID is unique (returns true if no company has this ID)
 */
export async function isLegalIdUnique(
  legalId: string
): Promise<RepositoryResult<boolean>> {
  const result = await getCompanyByLegalId(legalId);

  if (result.error) {
    return failure(result.error);
  }

  return success(result.data === null);
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
 * Company with country details type
 */
export type CompanyWithCountry = Company & {
  country: { id: string; code: string; name_key: string } | null;
};

/**
 * Search companies by name with country details
 */
export async function searchCompaniesWithCountry(
  query: string,
  limit = 10
): Promise<RepositoryResult<CompanyWithCountry[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      country:countries(id, code, name_key)
    `)
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

/**
 * Get companies by country
 */
export async function getCompaniesByCountry(
  countryId: string,
  limit = 50
): Promise<RepositoryResult<Company[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("country_id", countryId)
    .limit(limit);

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data || []);
}

/**
 * Get company with country details
 */
export async function getCompanyWithCountry(
  id: string
): Promise<RepositoryResult<Company & { country: { id: string; code: string; name_key: string } | null }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      country:countries(id, code, name_key)
    `)
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
