"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import {
  identifierSchema,
  type IdentifierFormData,
} from "@/lib/validations/onboarding";
import { getIdentifierType } from "@/lib/validations";
import { Link } from "@/i18n/navigation";

export function StepIdentifier() {
  const t = useTranslations("onboarding.step1");
  const tCommon = useTranslations("onboarding.common");
  const { state, updateData, nextStep } = useOnboarding();
  const [identifierType, setIdentifierType] = useState<
    "email" | "phone" | "invalid" | null
  >(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IdentifierFormData>({
    resolver: zodResolver(identifierSchema),
    defaultValues: {
      identifier: state.data.identifier,
    },
    mode: "onChange",
  });

  const watchIdentifier = watch("identifier");

  // Update identifier type on change
  const handleIdentifierChange = (value: string) => {
    if (value) {
      setIdentifierType(getIdentifierType(value));
    } else {
      setIdentifierType(null);
    }
  };

  const onSubmit = (data: IdentifierFormData) => {
    const type = getIdentifierType(data.identifier);
    updateData({
      identifier: data.identifier.trim(),
      identifierType: type === "invalid" ? null : type,
      // Pre-fill email or phone based on identifier type
      email: type === "email" ? data.identifier.trim() : state.data.email,
      phone: type === "phone" ? data.identifier.trim() : state.data.phone,
    });
    nextStep();
  };

  return (
    <StepContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-balance text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="identifier">{t("identifier")}</Label>
            <Input
              id="identifier"
              type="text"
              placeholder={t("identifierPlaceholder")}
              autoComplete="username"
              autoFocus
              {...register("identifier", {
                onChange: (e) => handleIdentifierChange(e.target.value),
              })}
              className={cn(
                errors.identifier &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.identifier && (
              <p className="text-xs text-destructive">
                {t(`errors.${errors.identifier.message}`)}
              </p>
            )}
            {watchIdentifier && identifierType && identifierType !== "invalid" && (
              <p className="text-xs text-muted-foreground">
                {identifierType === "email" ? t("usingEmail") : t("usingPhone")}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!isValid}>
            {tCommon("continue")}
            <ArrowRight className="ml-2 h-4 w-4" />
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
    </StepContainer>
  );
}
