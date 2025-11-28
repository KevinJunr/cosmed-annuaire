"use client";

import * as React from "react";
import { Phone } from "lucide-react";
import {
  AsYouType,
  parsePhoneNumber,
  isValidPhoneNumber,
  CountryCode,
} from "libphonenumber-js";

import { cn } from "@workspace/ui/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import {
  CountrySelector,
  CountryData,
  COUNTRIES,
  FlagIcon,
} from "./country-selector";

interface PhoneInputProps {
  value: string;
  onChange: (e164: string, national: string, countryCode: CountryCode) => void;
  defaultCountry?: CountryCode;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  countrySelectorLabels?: {
    placeholder?: string;
    searchPlaceholder?: string;
    noResultsText?: string;
  };
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = "FR",
  disabled = false,
  placeholder,
  error = false,
  id,
  name,
  required,
  autoComplete = "tel",
  countrySelectorLabels,
  className,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = React.useState<CountryCode>(defaultCountry);
  const [inputValue, setInputValue] = React.useState(value);

  // Get placeholder based on country
  const getPlaceholder = React.useCallback((): string => {
    if (placeholder) return placeholder;

    // Common placeholders by country
    const placeholders: Partial<Record<CountryCode, string>> = {
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

    return placeholders[countryCode] || "Phone number";
  }, [countryCode, placeholder]);

  // Format phone number as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Use AsYouType formatter
    const formatter = new AsYouType(countryCode);
    const formatted = formatter.input(rawValue);
    setInputValue(formatted);

    // Get E.164 format for storage
    try {
      if (rawValue.trim()) {
        const phoneNumber = parsePhoneNumber(rawValue, countryCode);
        if (phoneNumber) {
          onChange(phoneNumber.format("E.164"), formatted, countryCode);
          return;
        }
      }
      // If parsing fails, still update with raw value
      onChange("", formatted, countryCode);
    } catch {
      onChange("", formatted, countryCode);
    }
  };

  // Handle country change
  const handleCountryChange = (country: CountryData) => {
    setCountryCode(country.code);

    // Reformat existing value with new country
    if (inputValue) {
      const formatter = new AsYouType(country.code);
      // Extract just digits from current value
      const digits = inputValue.replace(/\D/g, "");
      const formatted = formatter.input(digits);
      setInputValue(formatted);

      try {
        const phoneNumber = parsePhoneNumber(digits, country.code);
        if (phoneNumber) {
          onChange(phoneNumber.format("E.164"), formatted, country.code);
          return;
        }
      } catch {
        // Ignore parsing errors
      }
      onChange("", formatted, country.code);
    } else {
      onChange("", "", country.code);
    }
  };

  // Check if current value is valid
  const isValid = React.useMemo(() => {
    if (!inputValue.trim()) return null;
    try {
      return isValidPhoneNumber(inputValue, countryCode);
    } catch {
      return false;
    }
  }, [inputValue, countryCode]);

  const selectedCountry = COUNTRIES.find((c) => c.code === countryCode);

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
      {/* Country selector - full width on mobile */}
      <CountrySelector
        value={countryCode}
        onChange={handleCountryChange}
        disabled={disabled}
        placeholder={countrySelectorLabels?.placeholder}
        searchPlaceholder={countrySelectorLabels?.searchPlaceholder}
        noResultsText={countrySelectorLabels?.noResultsText}
        className="w-full sm:w-auto sm:min-w-[140px]"
      />

      {/* Phone input with flag and icon */}
      <InputGroup
        className={cn(
          "flex-1",
          error && "border-destructive focus-within:ring-destructive",
          isValid === false && "border-destructive",
          isValid === true && "border-green-500"
        )}
        data-disabled={disabled}
      >
        <InputGroupAddon>
          {selectedCountry && (
            <FlagIcon countryCode={selectedCountry.code} className="h-4 w-5 hidden sm:inline-block" />
          )}
          <span className="text-xs text-muted-foreground font-medium">
            {selectedCountry?.dialCode}
          </span>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          name={name}
          type="tel"
          inputMode="tel"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={getPlaceholder()}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error || isValid === false}
        />
        <InputGroupAddon align="inline-end">
          <Phone className="h-4 w-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

// Helper to check if a phone is valid for a country
export function isPhoneValid(phone: string, countryCode: CountryCode): boolean {
  try {
    return isValidPhoneNumber(phone, countryCode);
  } catch {
    return false;
  }
}

// Format phone to E.164
export function formatPhoneE164(
  phone: string,
  countryCode: CountryCode
): string | null {
  try {
    const phoneNumber = parsePhoneNumber(phone, countryCode);
    return phoneNumber?.format("E.164") ?? null;
  } catch {
    return null;
  }
}
