import { CountryCode } from "libphonenumber-js";

/**
 * Maximum number of digits allowed per country (national number length)
 * Used to limit input length in phone fields
 */
export const PHONE_MAX_DIGITS: Partial<Record<CountryCode, number>> = {
  FR: 10, // 0612345678
  US: 10, // 5551234567
  CA: 10,
  GB: 11, // 07911123456
  DE: 11, // 015112345678
  ES: 9,  // 612345678
  IT: 10, // 3123456789
  BE: 9,  // 470123456
  CH: 9,  // 781234567
  AU: 9,  // 412345678
  NL: 9,
  PT: 9,
  AT: 10,
  IE: 9,
  LU: 9,
  MC: 8,
  AD: 6,
};

/**
 * Example phone placeholders per country
 * Shown as placeholder text in phone input fields
 */
export const PHONE_PLACEHOLDERS: Partial<Record<CountryCode, string>> = {
  FR: "6 12 34 56 78",
  US: "(555) 123-4567",
  GB: "7911 123456",
  DE: "151 12345678",
  ES: "612 345 678",
  IT: "312 345 6789",
  BE: "470 12 34 56",
  CH: "78 123 45 67",
  CA: "(555) 123-4567",
  AU: "412 345 678",
};

/**
 * Default country for phone inputs
 */
export const DEFAULT_COUNTRY: CountryCode = "FR";

/**
 * Maximum digits allowed by E.164 standard
 */
export const E164_MAX_DIGITS = 15;

/**
 * Get max digits for a country code
 */
export function getMaxDigitsForCountry(countryCode: CountryCode): number {
  return PHONE_MAX_DIGITS[countryCode] || E164_MAX_DIGITS;
}

/**
 * Get placeholder for a country code
 */
export function getPlaceholderForCountry(countryCode: CountryCode): string {
  return PHONE_PLACEHOLDERS[countryCode] || "Phone number";
}
