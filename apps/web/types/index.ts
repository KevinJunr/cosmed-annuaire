// Re-export all types
export * from "./onboarding";
export * from "./auth";

// Database types (from Supabase)
export type {
  Database,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./database.generated";

export type {
  // Aliases
  Profile,
  Company,
  Country,
  Department,
  Position,
  Onboarding,
  // Insert types
  ProfileInsert,
  CompanyInsert,
  CountryInsert,
  DepartmentInsert,
  PositionInsert,
  OnboardingInsert,
  // Update types
  ProfileUpdate,
  CompanyUpdate,
  CountryUpdate,
  DepartmentUpdate,
  PositionUpdate,
  OnboardingUpdate,
  // Enums
  OnboardingPurpose,
  CompanyRole,
  // Backwards compatibility
  User,
  UserInsert,
  UserUpdate,
} from "./database";

