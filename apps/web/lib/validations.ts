/**
 * Validation utilities for forms
 */

import {
  parsePhoneNumber,
  isValidPhoneNumber,
  AsYouType,
  type CountryCode,
} from "libphonenumber-js";

// Email regex - RFC 5322 compliant (simplified)
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password validation rules
export const PASSWORD_RULES = {
  minLength: 10,
  hasUppercase: /[A-Z]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\`~;']/,
  hasNumber: /\d/,
} as const;

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate phone format using libphonenumber-js
 * @param phone - Phone number to validate
 * @param countryCode - Optional country code for validation (e.g., "FR", "US")
 */
export function isValidPhone(phone: string, countryCode?: CountryCode): boolean {
  try {
    // If country code provided, validate against that country
    if (countryCode) {
      return isValidPhoneNumber(phone, countryCode);
    }

    // Try to parse without country code (works if phone has country prefix like +33)
    const phoneNumber = parsePhoneNumber(phone);
    return phoneNumber?.isValid() ?? false;
  } catch {
    return false;
  }
}

/**
 * Determine if input is email or phone
 * Note: For phone, this only works reliably with international format (+33...)
 * For national format, use isValidPhone with countryCode instead
 */
export function getIdentifierType(identifier: string): "email" | "phone" | "invalid" {
  const trimmed = identifier.trim();

  if (isValidEmail(trimmed)) {
    return "email";
  }

  // Check if it looks like a phone number (starts with + or contains mostly digits)
  const cleanPhone = trimmed.replace(/[\s.\-()]/g, "");
  if (/^\+?\d{8,15}$/.test(cleanPhone)) {
    return "phone";
  }

  return "invalid";
}

/**
 * Validate password and return which rules pass
 */
export function validatePassword(password: string): {
  isValid: boolean;
  rules: {
    minLength: boolean;
    hasUppercase: boolean;
    hasSpecialChar: boolean;
    hasNumber: boolean;
  };
} {
  const rules = {
    minLength: password.length >= PASSWORD_RULES.minLength,
    hasUppercase: PASSWORD_RULES.hasUppercase.test(password),
    hasSpecialChar: PASSWORD_RULES.hasSpecialChar.test(password),
    hasNumber: PASSWORD_RULES.hasNumber.test(password),
  };

  return {
    isValid: Object.values(rules).every(Boolean),
    rules,
  };
}

/**
 * Format phone number for Supabase Auth (E.164 format)
 * @param phone - Phone number to format
 * @param countryCode - Country code (e.g., "FR", "US"). Defaults to "FR"
 */
export function formatPhoneForAuth(phone: string, countryCode: CountryCode = "FR"): string {
  try {
    const phoneNumber = parsePhoneNumber(phone, countryCode);
    if (phoneNumber) {
      return phoneNumber.format("E.164");
    }
  } catch {
    // Fallback: clean and format manually
  }

  // Fallback: basic cleaning
  let cleaned = phone.replace(/[^\d+]/g, "");

  // If starts with 0 (national format), replace with country code
  if (cleaned.startsWith("0") && countryCode === "FR") {
    cleaned = "+33" + cleaned.slice(1);
  }

  // If no + prefix, add it
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  return cleaned;
}

/**
 * Format phone number as user types (national format)
 * @param phone - Raw phone input
 * @param countryCode - Country code for formatting
 */
export function formatPhoneNational(phone: string, countryCode: CountryCode): string {
  const formatter = new AsYouType(countryCode);
  return formatter.input(phone);
}

// Re-export CountryCode type for convenience
export type { CountryCode };
