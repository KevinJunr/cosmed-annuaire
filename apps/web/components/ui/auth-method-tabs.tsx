"use client";

import { Mail, Phone } from "lucide-react";
import { CountryCode } from "libphonenumber-js";

import { RequiredLabel } from "./required-label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { cn } from "@workspace/ui/lib/utils";
import { PhoneInput } from "./phone-input";

export type AuthMethod = "email" | "phone";

interface AuthMethodTabsLabels {
  tabs: {
    email: string;
    phone: string;
  };
  email: {
    label: string;
    placeholder: string;
    invalidError?: string;
    validMessage?: string;
  };
  phone: {
    label: string;
    invalidError?: string;
    validMessage?: string;
  };
  countrySelector: {
    placeholder: string;
    searchPlaceholder: string;
    noResultsText: string;
  };
}

interface AuthMethodTabsProps {
  authMethod: AuthMethod;
  onAuthMethodChange: (method: AuthMethod) => void;
  // Email props
  email: string;
  onEmailChange: (email: string) => void;
  isEmailValid: boolean | null;
  // Phone props
  phone: string;
  onPhoneChange: (e164: string, national: string, country: CountryCode) => void;
  isPhoneValid: boolean | null;
  // Labels
  labels: AuthMethodTabsLabels;
  // Optional
  disabled?: boolean;
  showValidMessage?: boolean;
}

export function AuthMethodTabs({
  authMethod,
  onAuthMethodChange,
  email,
  onEmailChange,
  isEmailValid,
  phone,
  onPhoneChange,
  isPhoneValid,
  labels,
  disabled = false,
  showValidMessage = false,
}: AuthMethodTabsProps) {
  return (
    <Tabs
      defaultValue="email"
      value={authMethod}
      onValueChange={(value: string) => onAuthMethodChange(value as AuthMethod)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email" className="gap-2" disabled={disabled}>
          <Mail className="h-4 w-4" />
          {labels.tabs.email}
        </TabsTrigger>
        <TabsTrigger value="phone" className="gap-2" disabled={disabled}>
          <Phone className="h-4 w-4" />
          {labels.tabs.phone}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email" className="mt-4">
        <div className="grid gap-2">
          <RequiredLabel htmlFor="email" required>{labels.email.label}</RequiredLabel>
          <InputGroup
            className={cn(isEmailValid === false && "border-destructive")}
          >
            <InputGroupAddon>
              <Mail className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              id="email"
              type="email"
              placeholder={labels.email.placeholder}
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required={authMethod === "email"}
              autoComplete="email"
              disabled={disabled}
            />
          </InputGroup>
          {isEmailValid === false && labels.email.invalidError && (
            <p className="text-xs text-destructive">
              {labels.email.invalidError}
            </p>
          )}
          {showValidMessage && isEmailValid === true && labels.email.validMessage && (
            <p className="text-xs text-muted-foreground">
              {labels.email.validMessage}
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="phone" className="mt-4">
        <div className="grid gap-2">
          <RequiredLabel htmlFor="phone" required>{labels.phone.label}</RequiredLabel>
          <PhoneInput
            id="phone"
            value={phone}
            onChange={onPhoneChange}
            defaultCountry="FR"
            error={isPhoneValid === false}
            disabled={disabled}
            countrySelectorLabels={{
              placeholder: labels.countrySelector.placeholder,
              searchPlaceholder: labels.countrySelector.searchPlaceholder,
              noResultsText: labels.countrySelector.noResultsText,
            }}
          />
          {isPhoneValid === false && labels.phone.invalidError && (
            <p className="text-xs text-destructive">
              {labels.phone.invalidError}
            </p>
          )}
          {showValidMessage && isPhoneValid === true && labels.phone.validMessage && (
            <p className="text-xs text-muted-foreground">
              {labels.phone.validMessage}
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
