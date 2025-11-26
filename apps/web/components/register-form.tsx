"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Check, Loader2, ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from "@workspace/ui/components/input-otp";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  validatePassword,
  getIdentifierType,
  formatPhoneForAuth,
} from "@/lib/validations";

type Step = "form" | "otp" | "confirmation";

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
  const [step, setStep] = useState<Step>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [phoneForOtp, setPhoneForOtp] = useState("");
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
        // Always show confirmation screen to prevent email enumeration
        await supabase.auth.signUp({
          email: identifier.trim(),
          password,
        });
        // Don't check for errors - always show generic confirmation
        setStep("confirmation");
      } else if (type === "phone") {
        const formattedPhone = formatPhoneForAuth(identifier);
        // Always show OTP screen to prevent phone enumeration
        await supabase.auth.signUp({
          phone: formattedPhone,
          password,
        });
        // Don't check for errors - always show OTP step
        setPhoneForOtp(formattedPhone);
        setStep("otp");
      }
    } catch {
      // Even on error, show generic message to prevent enumeration
      const type = getIdentifierType(identifier);
      if (type === "email") {
        setStep("confirmation");
      } else if (type === "phone") {
        setPhoneForOtp(formatPhoneForAuth(identifier));
        setStep("otp");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneForOtp,
        token: otpCode,
        type: "sms",
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        phone: phoneForOtp,
        type: "sms",
      });

      if (error) {
        setError(error.message);
      }
    } catch {
      setError(t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep("form");
    setOtpCode("");
    setError(null);
  };

  // OTP Verification Step
  if (step === "otp") {
    return (
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleVerifyOtp}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("otp.title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("otp.subtitle", { phone: phoneForOtp })}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otpCode">{t("otp.code")}</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={(value) => setOtpCode(value)}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={otpCode.length < 6 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("otp.verifying")}
              </>
            ) : (
              t("otp.verify")
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-2 text-center text-sm">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isLoading}
            className="text-primary underline-offset-4 hover:underline font-medium disabled:opacity-50"
          >
            {t("otp.resend")}
          </button>
          <button
            type="button"
            onClick={handleBackToForm}
            disabled={isLoading}
            className="flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("otp.back")}
          </button>
        </div>
      </form>
    );
  }

  // Email Confirmation Step
  if (step === "confirmation") {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t("confirmation.title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("confirmation.subtitle")}
          </p>
        </div>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={handleBackToForm}
            className="flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("confirmation.back")}
          </button>
        </div>
      </div>
    );
  }

  // Main Registration Form
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
