/**
 * Database types - Re-exported from auto-generated Supabase types
 *
 * To regenerate types, run:
 * SUPABASE_ACCESS_TOKEN=your_token npx supabase gen types typescript --project-id tgrbsfxtqzvhntssdjsf --schema public > apps/web/types/database.generated.ts
 */

// Re-export everything from generated types
export * from "./database.generated";

import type { Database } from "./database.generated";

// ===========================================
// Convenience type aliases
// ===========================================

// Table Row types (what you get when you SELECT)
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Country = Database["public"]["Tables"]["countries"]["Row"];
export type Department = Database["public"]["Tables"]["departments"]["Row"];
export type Position = Database["public"]["Tables"]["positions"]["Row"];
export type Onboarding = Database["public"]["Tables"]["onboarding"]["Row"];

// Insert types (what you use for INSERT)
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
export type CountryInsert = Database["public"]["Tables"]["countries"]["Insert"];
export type DepartmentInsert = Database["public"]["Tables"]["departments"]["Insert"];
export type PositionInsert = Database["public"]["Tables"]["positions"]["Insert"];
export type OnboardingInsert = Database["public"]["Tables"]["onboarding"]["Insert"];

// Update types (what you use for UPDATE)
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];
export type CountryUpdate = Database["public"]["Tables"]["countries"]["Update"];
export type DepartmentUpdate = Database["public"]["Tables"]["departments"]["Update"];
export type PositionUpdate = Database["public"]["Tables"]["positions"]["Update"];
export type OnboardingUpdate = Database["public"]["Tables"]["onboarding"]["Update"];

// ===========================================
// Custom enums (not in DB but used in app)
// ===========================================

export type OnboardingPurpose = "SEARCH" | "REGISTER" | "BOTH";
export type CompanyRole = "admin" | "profile_manager" | "payment_manager" | "user";

// ===========================================
// Backwards compatibility aliases
// ===========================================

// Keep User as alias for Profile for backwards compatibility
export type User = Profile;
export type UserInsert = ProfileInsert;
export type UserUpdate = ProfileUpdate;
