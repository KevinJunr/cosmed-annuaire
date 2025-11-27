import { z } from "zod";
import { isValidEmail, isValidPhone } from "@/lib/validations";

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
  position: z.string().min(1, { message: "required" }),
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

// Step 5 Path B: Company Creation
export const companyCreateSchema = z.object({
  companyName: z
    .string()
    .min(1, { message: "required" })
    .min(2, { message: "tooShort" })
    .max(100, { message: "tooLong" }),
  sectorId: z.string().min(1, { message: "required" }),
  country: z.string().min(1, { message: "required" }),
  address: z.string().optional(),
  rcs: z.string().optional(),
  primaryPhone: z
    .string()
    .optional()
    .refine((val) => !val || isValidPhone(val), { message: "invalidPhone" }),
  primaryEmail: z
    .string()
    .optional()
    .refine((val) => !val || isValidEmail(val), { message: "invalidEmail" }),
  linkedinUrl: z
    .string()
    .optional()
    .refine((val) => !val || val.includes("linkedin.com"), {
      message: "invalidLinkedin",
    }),
});

// Inferred types from schemas
export type PurposeFormData = z.infer<typeof purposeSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type CompanySelectFormData = z.infer<typeof companySelectSchema>;
export type CompanyCreateFormData = z.infer<typeof companyCreateSchema>;
