import { createClient } from "@/lib/supabase/server";
import type { Country, Department, Position } from "@/types";
import {
  RepositoryResult,
  success,
  failureFromPostgrest,
} from "./base";

/**
 * Get all countries
 */
export async function getCountries(): Promise<RepositoryResult<Country[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .order("name_key");

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data || []);
}

/**
 * Get country by ID
 */
export async function getCountryById(
  id: string
): Promise<RepositoryResult<Country | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get country by code (e.g., "FR", "US")
 */
export async function getCountryByCode(
  code: string
): Promise<RepositoryResult<Country | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get all departments
 */
export async function getDepartments(): Promise<RepositoryResult<Department[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("name_key");

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data || []);
}

/**
 * Get department by ID
 */
export async function getDepartmentById(
  id: string
): Promise<RepositoryResult<Department | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get department by code (e.g., "RD", "MARKETING")
 */
export async function getDepartmentByCode(
  code: string
): Promise<RepositoryResult<Department | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get all positions
 */
export async function getPositions(): Promise<RepositoryResult<Position[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .order("name_key");

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data || []);
}

/**
 * Get position by ID
 */
export async function getPositionById(
  id: string
): Promise<RepositoryResult<Position | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}

/**
 * Get position by code (e.g., "CEO", "MANAGER")
 */
export async function getPositionByCode(
  code: string
): Promise<RepositoryResult<Position | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (error) {
    return failureFromPostgrest(error);
  }

  return success(data);
}
