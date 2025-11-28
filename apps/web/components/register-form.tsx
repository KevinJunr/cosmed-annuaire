"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { cn } from "@workspace/ui/lib/utils";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  validatePassword,
  isValidEmail,
  isValidPhone,
  formatPhoneForAuth,
} from "@/lib/validations";
import { usePhoneState } from "@/hooks";
import {
  PasswordInput,
  PasswordRulesDisplay,
  FormError,
  AuthMethodTabs,
  type AuthMethod,
} from "@/components/ui";
import { updatePreferredLanguageAction } from "@/lib/actions/profiles";

type Step = "form" | "otp" | "confirmation";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const t = useTranslations("auth.register");
  const tCountry = useTranslations("countrySelector");
  const locale = useLocale();
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<Step>("form");

  // Auth method state
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");

  // Email state
  const [email, setEmail] = useState("");

  // Phone state (using custom hook)
  const { phone, phoneE164, countryCode, handlePhoneChange } = usePhoneState();

  // Password state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP state
  const [otpCode, setOtpCode] = useState("");
  const [phoneForOtp, setPhoneForOtp] = useState("");

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Validation states
  const passwordValidation = validatePassword(password);
  const isEmailValid = email ? isValidEmail(email) : null;
  const isPhoneValidState = phone ? isValidPhone(phone, countryCode) : null;
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const canSubmit =
    (authMethod === "email" ? isEmailValid : isPhoneValidState) &&
    passwordValidation.isValid &&
    passwordsMatch &&
    !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;

    setIsLoading(true);

    try {
      if (authMethod === "email") {
        // Always show confirmation screen to prevent email enumeration
        // Include locale in redirect URL to set preferred_language after confirmation
        const redirectUrl = `${window.location.origin}/auth/callback?locale=${locale}`;
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        // Don't check for errors - always show generic confirmation
        setStep("confirmation");
      } else {
        // Phone registration
        const formattedPhone = phoneE164 || formatPhoneForAuth(phone, countryCode);
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
      if (authMethod === "email") {
        setStep("confirmation");
      } else {
        const formattedPhone = phoneE164 || formatPhoneForAuth(phone, countryCode);
        setPhoneForOtp(formattedPhone);
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

      // Set preferred_language based on current locale
      await updatePreferredLanguageAction(locale);

      router.push("/onboarding");
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

        <FormError message={error} />

        <div className="grid gap-4">
          <div className="flex flex-col items-center gap-3">
            <Label htmlFor="otpCode" className="text-center">
              {t("otp.code")}
            </Label>
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
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
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

      <FormError message={error} />

      <div className="grid gap-5">
        <AuthMethodTabs
          authMethod={authMethod}
          onAuthMethodChange={setAuthMethod}
          email={email}
          onEmailChange={setEmail}
          isEmailValid={isEmailValid}
          phone={phone}
          onPhoneChange={handlePhoneChange}
          isPhoneValid={isPhoneValidState}
          disabled={isLoading}
          showValidMessage
          labels={{
            tabs: {
              email: t("tabs.email"),
              phone: t("tabs.phone"),
            },
            email: {
              label: t("email"),
              placeholder: t("emailPlaceholder"),
              invalidError: t("errors.invalidEmail"),
              validMessage: t("usingEmail"),
            },
            phone: {
              label: t("phone"),
              invalidError: t("errors.invalidPhone"),
              validMessage: t("usingPhone"),
            },
            countrySelector: {
              placeholder: tCountry("placeholder"),
              searchPlaceholder: tCountry("searchPlaceholder"),
              noResultsText: tCountry("noResults"),
            },
          }}
        />

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <PasswordInput
            id="password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
          />
          <PasswordRulesDisplay
            rules={passwordValidation.rules}
            labels={{
              minLength: t("passwordRules.minLength"),
              uppercase: t("passwordRules.uppercase"),
              specialChar: t("passwordRules.specialChar"),
              number: t("passwordRules.number"),
            }}
            className="mt-1"
          />
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder={t("confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            showLabel={t("showPassword")}
            hideLabel={t("hidePassword")}
            className={cn(
              confirmPassword &&
                !passwordsMatch &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-destructive">
              {t("errors.passwordMismatch")}
            </p>
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
