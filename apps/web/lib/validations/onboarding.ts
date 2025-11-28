import { z } from "zod";

// Step 1: Purpose
export const purposeSchema = z.object({
  purpose: z.enum(["SEARCH", "REGISTER", "BOTH"], {
    required_error: "required",
  }),
});

// Step 2: Personal Info
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "required" })
    .min(2, { message: "tooShort" })
    .max(50, { message: "tooLong" }),
  lastName: z
    .string()
    .min(1, { message: "required" })
    .min(2, { message: "tooShort" })
    .max(50, { message: "tooLong" }),
  departmentId: z.string().min(1, { message: "required" }),
  positionId: z.string().min(1, { message: "required" }),
});

// Step 5 Path A: Company Selection
export const companySelectSchema = z
  .object({
    companyChoice: z.enum(["existing", "new", "none"], {
      required_error: "required",
    }),
    selectedCompanyId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.companyChoice === "existing") {
        return !!data.selectedCompanyId;
      }
      return true;
    },
    { message: "selectCompany", path: ["selectedCompanyId"] }
  );

// Legal ID types
export const LEGAL_ID_TYPES = ["DUNS", "SIREN"] as const;
export type LegalIdType = (typeof LEGAL_ID_TYPES)[number];

// Validation: DUNS and SIREN are both 9 digits
const legalIdRegex = /^\d{9}$/;

// Step 3 Path B: Company Creation (simplified for onboarding)
export const companyCreateSchema = z.object({
  countryId: z.string().min(1, { message: "required" }),
  companyName: z
    .string()
    .min(1, { message: "required" })
    .min(2, { message: "tooShort" })
    .max(100, { message: "tooLong" }),
  legalIdType: z.enum(LEGAL_ID_TYPES, { required_error: "required" }),
  legalId: z
    .string()
    .min(1, { message: "required" })
    .regex(legalIdRegex, { message: "invalidFormat" }),
  address: z.string().optional(),
});

// Inferred types from schemas
export type PurposeFormData = z.infer<typeof purposeSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type CompanySelectFormData = z.infer<typeof companySelectSchema>;
export type CompanyCreateFormData = z.infer<typeof companyCreateSchema>;
