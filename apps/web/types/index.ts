// Re-export all types
export * from "./constants";
export * from "./onboarding";
export * from "./auth";

// Database types - explicit exports to avoid conflicts with constants
export type {
  Database,
  Json,
  Tables,
  InsertTables,
  UpdateTables,
  Enums,
  DbUser,
  DbCompany,
  DbUserCompany,
  DbDepartment,
  DbSector,
  User,
  Company,
  UserCompany,
  UserInsert,
  CompanyInsert,
  UserCompanyInsert,
  UserUpdate,
  CompanyUpdate,
} from "./database";
