"use client";

import { useState, useCallback } from "react";
import { CountryCode } from "libphonenumber-js";

export interface PhoneState {
  phone: string;
  phoneE164: string;
  countryCode: CountryCode;
}

export interface UsePhoneStateReturn extends PhoneState {
  setPhone: (phone: string) => void;
  setPhoneE164: (e164: string) => void;
  setCountryCode: (code: CountryCode) => void;
  handlePhoneChange: (e164: string, national: string, country: CountryCode) => void;
  resetPhone: () => void;
}

/**
 * Custom hook for managing phone input state
 * Centralizes phone, E.164 format, and country code state management
 */
export function usePhoneState(defaultCountry: CountryCode = "FR"): UsePhoneStateReturn {
  const [phone, setPhone] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>(defaultCountry);

  const handlePhoneChange = useCallback(
    (e164: string, national: string, country: CountryCode) => {
      setPhone(national);
      setPhoneE164(e164);
      setCountryCode(country);
    },
    []
  );

  const resetPhone = useCallback(() => {
    setPhone("");
    setPhoneE164("");
    setCountryCode(defaultCountry);
  }, [defaultCountry]);

  return {
    phone,
    phoneE164,
    countryCode,
    setPhone,
    setPhoneE164,
    setCountryCode,
    handlePhoneChange,
    resetPhone,
  };
}
