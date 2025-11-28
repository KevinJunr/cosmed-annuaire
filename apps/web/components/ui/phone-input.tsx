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
import { CountrySelector, CountryData } from "./country-selector";
import {
  getMaxDigitsForCountry,
  getPlaceholderForCountry,
} from "@/lib/phone-constants";

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
  const currentPlaceholder = React.useMemo(
    () => placeholder || getPlaceholderForCountry(countryCode),
    [countryCode, placeholder]
  );

  // Format phone number as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Extract digits only to check length
    const digitsOnly = rawValue.replace(/\D/g, "");
    const maxDigits = getMaxDigitsForCountry(countryCode);

    // If exceeds max digits, don't update
    if (digitsOnly.length > maxDigits) {
      return;
    }

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
      let digits = inputValue.replace(/\D/g, "");

      // Truncate if exceeds new country's max length
      const maxDigits = getMaxDigitsForCountry(country.code);
      if (digits.length > maxDigits) {
        digits = digits.slice(0, maxDigits);
      }

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

      {/* Phone input */}
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
          <Phone className="h-4 w-4" />
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          name={name}
          type="tel"
          inputMode="tel"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={currentPlaceholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error || isValid === false}
        />
      </InputGroup>
    </div>
  );
}
