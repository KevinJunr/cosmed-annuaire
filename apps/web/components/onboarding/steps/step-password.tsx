"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import { PasswordInput, PasswordRulesDisplay } from "@/components/ui";
import { passwordSchema, type PasswordFormData } from "@/lib/validations/onboarding";
import { validatePassword } from "@/lib/validations";

export function StepPassword() {
  const t = useTranslations("onboarding.step2");
  const tCommon = useTranslations("onboarding.common");
  const { state, updateData, nextStep, prevStep } = useOnboarding();

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

  const onSubmit = (data: PasswordFormData) => {
    updateData({ password: data.password });
    nextStep();
  };

  return (
    <StepContainer>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-4">
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
            disabled={!isValid}
          >
            {tCommon("continue")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </StepContainer>
  );
}
