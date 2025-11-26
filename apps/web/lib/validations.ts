/**
 * Validation utilities for forms
 */

// Email regex - RFC 5322 compliant (simplified)
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone regex - International format with optional country code
// Supports: +33612345678, 0612345678, +1-555-555-5555, etc.
export const PHONE_REGEX = /^(\+?[1-9]\d{0,2}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

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
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
  // Remove all whitespace and common separators for validation
  const cleanPhone = phone.replace(/[\s.-]/g, '');
  return PHONE_REGEX.test(phone) && cleanPhone.length >= 8 && cleanPhone.length <= 15;
}

/**
 * Determine if input is email or phone
 */
export function getIdentifierType(identifier: string): 'email' | 'phone' | 'invalid' {
  const trimmed = identifier.trim();

  if (isValidEmail(trimmed)) {
    return 'email';
  }

  if (isValidPhone(trimmed)) {
    return 'phone';
  }

  return 'invalid';
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
 * Format phone number for Supabase (E.164 format)
 * Assumes French number if no country code provided
 */
export function formatPhoneForAuth(phone: string): string {
  // Remove all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // If starts with 0 (French format), replace with +33
  if (cleaned.startsWith('0')) {
    cleaned = '+33' + cleaned.slice(1);
  }

  // If no + prefix, assume it needs one
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
}
