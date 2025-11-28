"use server";

import { companiesRepository } from "@/lib/repositories";
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
 * Check if RCS is unique
 */
export async function checkRcsUniqueAction(
  rcs: string
): Promise<{
  success: boolean;
  isUnique?: boolean;
  error?: string;
}> {
  try {
    if (!rcs || rcs.length < 3) {
      return { success: true, isUnique: true };
    }

    const result = await companiesRepository.isRcsUnique(rcs);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, isUnique: result.data };
  } catch {
    return { success: false, error: "Failed to check RCS" };
  }
}
