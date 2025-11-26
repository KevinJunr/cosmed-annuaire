"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  validatePassword,
  getIdentifierType,
  formatPhoneForAuth,
} from "@/lib/validations";

interface PasswordRuleProps {
  isValid: boolean;
  label: string;
}

function PasswordRule({ isValid, label }: PasswordRuleProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "h-4 w-4 rounded border flex items-center justify-center transition-colors",
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

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Validation states
  const passwordValidation = validatePassword(password);
  const identifierType = identifier ? getIdentifierType(identifier) : null;
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const canSubmit =
    identifier &&
    identifierType !== "invalid" &&
    passwordValidation.isValid &&
    passwordsMatch &&
    !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;

    setIsLoading(true);

    try {
      const type = getIdentifierType(identifier);

      if (type === "email") {
        const { error } = await supabase.auth.signUp({
          email: identifier.trim(),
          password,
        });

        if (error) {
          setError(error.message);
          return;
        }
      } else if (type === "phone") {
        const formattedPhone = formatPhoneForAuth(identifier);
        const { error } = await supabase.auth.signUp({
          phone: formattedPhone,
          password,
        });

        if (error) {
          setError(error.message);
          return;
        }
      }

      // Redirect to home or dashboard on success
      router.push("/");
      router.refresh();
    } catch {
      setError(t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-5">
        {/* Identifier (Email or Phone) */}
        <div className="grid gap-2">
          <Label htmlFor="identifier">{t("identifier")}</Label>
          <Input
            id="identifier"
            type="text"
            placeholder={t("identifierPlaceholder")}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
            className={cn(
              identifier &&
                identifierType === "invalid" &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {identifier && identifierType === "invalid" && (
            <p className="text-xs text-destructive">{t("errors.invalidIdentifier")}</p>
          )}
          {identifier && identifierType !== "invalid" && (
            <p className="text-xs text-muted-foreground">
              {identifierType === "email" ? t("usingEmail") : t("usingPhone")}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Rules */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <PasswordRule
              isValid={passwordValidation.rules.minLength}
              label={t("passwordRules.minLength")}
            />
            <PasswordRule
              isValid={passwordValidation.rules.hasUppercase}
              label={t("passwordRules.uppercase")}
            />
            <PasswordRule
              isValid={passwordValidation.rules.hasSpecialChar}
              label={t("passwordRules.specialChar")}
            />
            <PasswordRule
              isValid={passwordValidation.rules.hasNumber}
              label={t("passwordRules.number")}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={cn(
                "pr-10",
                confirmPassword &&
                  !passwordsMatch &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={
                showConfirmPassword ? t("hidePassword") : t("showPassword")
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-destructive">{t("errors.passwordMismatch")}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={!canSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </Button>
      </div>

      <div className="text-center text-sm">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="text-primary underline-offset-4 hover:underline font-medium"
        >
          {t("login")}
        </Link>
      </div>
    </form>
  );
}
