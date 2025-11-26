import { z } from "zod";
import { isValidEmail, isValidPhone, PASSWORD_RULES } from "@/lib/validations";

// Step 1: Identifier (email or phone)
export const identifierSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "required" })
    .refine((val) => isValidEmail(val) || isValidPhone(val), {
      message: "invalidFormat",
    }),
});

// Step 2: Purpose
export const purposeSchema = z.object({
  purpose: z.enum(["SEARCH", "REGISTER", "BOTH"], {
    required_error: "required",
  }),
});

// Step 3: Personal Info
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
  email: z
    .string()
    .optional()
    .refine((val) => !val || isValidEmail(val), { message: "invalidEmail" }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || isValidPhone(val), { message: "invalidPhone" }),
  departmentId: z.string().min(1, { message: "required" }),
  position: z.string().min(1, { message: "required" }),
});

// Step 4: Password
export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(PASSWORD_RULES.minLength, { message: "tooShort" })
      .regex(PASSWORD_RULES.hasUppercase, { message: "needsUppercase" })
      .regex(PASSWORD_RULES.hasSpecialChar, { message: "needsSpecialChar" })
      .regex(PASSWORD_RULES.hasNumber, { message: "needsNumber" }),
    confirmPassword: z.string().min(1, { message: "required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
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
export type IdentifierFormData = z.infer<typeof identifierSchema>;
export type PurposeFormData = z.infer<typeof purposeSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type CompanySelectFormData = z.infer<typeof companySelectSchema>;
export type CompanyCreateFormData = z.infer<typeof companyCreateSchema>;
