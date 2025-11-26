// Types for authentication

export type AuthIdentifierType = "email" | "phone" | "invalid";

export interface PasswordValidationRules {
  minLength: boolean;
  hasUppercase: boolean;
  hasSpecialChar: boolean;
  hasNumber: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  rules: PasswordValidationRules;
}
