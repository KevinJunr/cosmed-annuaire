"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@workspace/ui/components/input-otp";
import { cn } from "@workspace/ui/lib/utils";

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import { PasswordInput, PasswordRulesDisplay } from "@/components/ui";
import { passwordSchema, type PasswordFormData } from "@/lib/validations/onboarding";
import { validatePassword, formatPhoneForAuth } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";

type SubStep = "password" | "otp" | "email-sent";

export function StepPasswordOtp() {
  const t = useTranslations("onboarding.step4");
  const tCommon = useTranslations("onboarding.common");
  const { state, updateData, nextStep, prevStep, setLoading } = useOnboarding();

  const [subStep, setSubStep] = useState<SubStep>("password");
  const [otpCode, setOtpCode] = useState("");
  const [phoneForOtp, setPhoneForOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: state.data.password,
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password");
  const passwordValidation = validatePassword(password || "");

  const onSubmitPassword = async (data: PasswordFormData) => {
    setError(null);
    setLoading(true);

    try {
      const identifierType = state.data.identifierType;
      const identifier = state.data.identifier;

      if (identifierType === "email") {
        await supabase.auth.signUp({
          email: identifier.trim(),
          password: data.password,
        });
        updateData({ password: data.password });
        setSubStep("email-sent");
      } else if (identifierType === "phone") {
        const formattedPhone = formatPhoneForAuth(identifier);
        await supabase.auth.signUp({
          phone: formattedPhone,
          password: data.password,
        });
        updateData({ password: data.password });
        setPhoneForOtp(formattedPhone);
        setSubStep("otp");
      }
    } catch {
      // Always show generic success to prevent enumeration
      const identifierType = state.data.identifierType;
      if (identifierType === "email") {
        setSubStep("email-sent");
      } else {
        setPhoneForOtp(formatPhoneForAuth(state.data.identifier));
        setSubStep("otp");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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

      updateData({ isVerified: true });
      nextStep();
    } catch {
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setLoading(true);

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
      setLoading(false);
    }
  };

  // Email confirmation screen
  if (subStep === "email-sent") {
    return (
      <StepContainer>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{t("emailSent.title")}</h1>
            <p className="text-balance text-sm text-muted-foreground">
              {t("emailSent.subtitle")}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubStep("password")}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {tCommon("back")}
            </Button>
          </div>
        </div>
      </StepContainer>
    );
  }

  // OTP verification screen
  if (subStep === "otp") {
    return (
      <StepContainer>
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
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
              disabled={otpCode.length < 6 || state.isLoading}
            >
              {state.isLoading ? (
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
              disabled={state.isLoading}
              className="text-primary underline-offset-4 hover:underline font-medium disabled:opacity-50"
            >
              {t("otp.resend")}
            </button>
            <button
              type="button"
              onClick={() => setSubStep("password")}
              disabled={state.isLoading}
              className="flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {tCommon("back")}
            </button>
          </div>
        </form>
      </StepContainer>
    );
  }

  // Password form
  return (
    <StepContainer>
      <form
        onSubmit={handleSubmit(onSubmitPassword)}
        className="flex flex-col gap-6"
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

        <div className="grid gap-4">
          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">{t("password")}</Label>
            <PasswordInput
              id="password"
              placeholder={t("passwordPlaceholder")}
              autoComplete="new-password"
              showLabel={t("showPassword")}
              hideLabel={t("hidePassword")}
              {...register("password")}
              className={cn(
                errors.password &&
                  "border-destructive focus-visible:ring-destructive"
              )}
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
              autoComplete="new-password"
              showLabel={t("showPassword")}
              hideLabel={t("hidePassword")}
              {...register("confirmPassword")}
              className={cn(
                errors.confirmPassword &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.confirmPassword.message}`)}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tCommon("back")}
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!isValid || state.isLoading}
          >
            {state.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              <>
                {tCommon("continue")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </StepContainer>
  );
}
