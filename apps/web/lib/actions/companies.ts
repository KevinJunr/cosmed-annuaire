"use server";

import { companiesRepository, type CompanyWithCountry } from "@/lib/repositories";
import type { Company } from "@/types";

/**
 * Search companies by name
 */
export async function searchCompaniesAction(
  query: string
): Promise<{
  success: boolean;
  companies?: Company[];
  error?: string;
}> {
  try {
    if (!query || query.length < 2) {
      return { success: true, companies: [] };
    }

    const result = await companiesRepository.searchCompanies(query, 10);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, companies: result.data };
  } catch {
    return { success: false, error: "Failed to search companies" };
  }
}

/**
 * Search companies by name with country details
 */
export async function searchCompaniesWithCountryAction(
  query: string
): Promise<{
  success: boolean;
  companies?: CompanyWithCountry[];
  error?: string;
}> {
  try {
    if (!query || query.length < 2) {
      return { success: true, companies: [] };
    }

    const result = await companiesRepository.searchCompaniesWithCountry(query, 10);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, companies: result.data };
  } catch {
    return { success: false, error: "Failed to search companies" };
  }
}

/**
 * Check if legal ID (DUNS or SIREN) is unique
 * Returns the existing company if found
 */
export async function checkLegalIdUniqueAction(
  legalId: string
): Promise<{
  success: boolean;
  isUnique?: boolean;
  existingCompany?: CompanyWithCountry | null;
  error?: string;
}> {
  try {
    if (!legalId || legalId.length !== 9) {
      return { success: true, isUnique: true };
    }

    const result = await companiesRepository.getCompanyByLegalIdWithCountry(legalId);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    const existingCompany = result.data;
    return {
      success: true,
      isUnique: existingCompany === null,
      existingCompany: existingCompany
    };
  } catch {
    return { success: false, error: "Failed to check legal ID" };
  }
}
