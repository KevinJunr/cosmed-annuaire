"use client";

import { Check } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import type { PasswordValidationRules } from "@/types";

interface PasswordRuleProps {
  isValid: boolean;
  label: string;
}

function PasswordRule({ isValid, label }: PasswordRuleProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "h-4 w-4 rounded-full border flex items-center justify-center transition-colors",
          isValid
            ? "bg-green-500 border-green-500"
            : "bg-muted border-muted-foreground/30"
        )}
      >
        {isValid && <Check className="h-3 w-3 text-white" />}
      </div>
      <span
        className={cn(
          "text-xs transition-colors",
          isValid ? "text-green-600" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}

interface PasswordRulesDisplayProps {
  rules: PasswordValidationRules;
  labels: {
    minLength: string;
    uppercase: string;
    specialChar: string;
    number: string;
  };
  className?: string;
}

export function PasswordRulesDisplay({
  rules,
  labels,
  className,
}: PasswordRulesDisplayProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <PasswordRule isValid={rules.minLength} label={labels.minLength} />
      <PasswordRule isValid={rules.hasUppercase} label={labels.uppercase} />
      <PasswordRule isValid={rules.hasSpecialChar} label={labels.specialChar} />
      <PasswordRule isValid={rules.hasNumber} label={labels.number} />
    </div>
  );
}
