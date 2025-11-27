"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Loader2, Mail, CheckCircle2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@workspace/ui/components/input-otp";

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import { formatPhoneForAuth } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";

type SubStep = "confirm" | "otp" | "email-sent";

export function StepVerification() {
  const t = useTranslations("onboarding.step6");
  const tCommon = useTranslations("onboarding.common");
  const router = useRouter();
  const { state, updateData, prevStep, setLoading, reset } = useOnboarding();

  const [subStep, setSubStep] = useState<SubStep>("confirm");
  const [otpCode, setOtpCode] = useState("");
  const [phoneForOtp, setPhoneForOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleFinalize = async () => {
    setError(null);
    setLoading(true);

    try {
      const identifierType = state.data.identifierType;
      const identifier = state.data.identifier;
      const password = state.data.password;

      if (identifierType === "email") {
        await supabase.auth.signUp({
          email: identifier.trim(),
          password: password,
        });
        setSubStep("email-sent");
      } else if (identifierType === "phone") {
        const formattedPhone = formatPhoneForAuth(identifier);
        await supabase.auth.signUp({
          phone: formattedPhone,
          password: password,
        });
        setPhoneForOtp(formattedPhone);
        setSubStep("otp");
      }
    } catch {
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
      reset();
      router.push("/");
      router.refresh();
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
              onClick={() => setSubStep("confirm")}
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
                <InputOTPSeparator />
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
              onClick={() => setSubStep("confirm")}
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

  // Confirmation screen with CTA
  return (
    <StepContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Summary of what was collected */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("summary.identifier")}</span>
            <span className="font-medium">{state.data.identifier}</span>
          </div>
          {state.data.firstName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("summary.name")}</span>
              <span className="font-medium">
                {state.data.firstName} {state.data.lastName}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

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
            type="button"
            onClick={handleFinalize}
            disabled={state.isLoading}
            className="flex-1"
          >
            {state.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("finalizing")}
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t("finalize")}
              </>
            )}
          </Button>
        </div>
      </div>
    </StepContainer>
  );
}
