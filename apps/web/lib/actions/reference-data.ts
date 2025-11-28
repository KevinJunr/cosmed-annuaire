"use server";

import { referenceDataRepository } from "@/lib/repositories";
import type { Country, Department, Position } from "@/types";

/**
 * Get all countries
 */
export async function getCountriesAction(): Promise<{
  success: boolean;
  countries?: Country[];
  error?: string;
}> {
  try {
    const result = await referenceDataRepository.getCountries();

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, countries: result.data };
  } catch {
    return { success: false, error: "Failed to load countries" };
  }
}

/**
 * Get all departments
 */
export async function getDepartmentsAction(): Promise<{
  success: boolean;
  departments?: Department[];
  error?: string;
}> {
  try {
    const result = await referenceDataRepository.getDepartments();

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, departments: result.data };
  } catch {
    return { success: false, error: "Failed to load departments" };
  }
}

/**
 * Get all positions
 */
export async function getPositionsAction(): Promise<{
  success: boolean;
  positions?: Position[];
  error?: string;
}> {
  try {
    const result = await referenceDataRepository.getPositions();

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, positions: result.data };
  } catch {
    return { success: false, error: "Failed to load positions" };
  }
}
