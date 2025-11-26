"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Search, Building2, Users, Check } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { cn } from "@workspace/ui/lib/utils";

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import { purposeSchema, type PurposeFormData } from "@/lib/validations/onboarding";

const PURPOSE_OPTIONS = [
  { value: "SEARCH", icon: Search, colorClass: "text-blue-500" },
  { value: "REGISTER", icon: Building2, colorClass: "text-green-500" },
  { value: "BOTH", icon: Users, colorClass: "text-purple-500" },
] as const;

export function StepPurpose() {
  const t = useTranslations("onboarding.step2");
  const tCommon = useTranslations("onboarding.common");
  const { state, updateData, setPath, nextStep, prevStep } = useOnboarding();

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm<PurposeFormData>({
    resolver: zodResolver(purposeSchema),
    defaultValues: {
      purpose: state.data.purpose ?? undefined,
    },
  });

  const selectedPurpose = watch("purpose");

  const handlePurposeSelect = (value: "SEARCH" | "REGISTER" | "BOTH") => {
    setValue("purpose", value, { shouldValidate: true });
  };

  const onSubmit = (data: PurposeFormData) => {
    updateData({ purpose: data.purpose });
    // Set path based on purpose
    if (data.purpose === "SEARCH") {
      setPath("search");
    } else {
      setPath(data.purpose === "REGISTER" ? "register" : "both");
    }
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

        <RadioGroup
          value={selectedPurpose}
          onValueChange={handlePurposeSelect}
          className="grid gap-3"
        >
          {PURPOSE_OPTIONS.map(({ value, icon: Icon, colorClass }) => (
            <Label
              key={value}
              htmlFor={value}
              className={cn(
                "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all",
                "hover:bg-muted/50",
                selectedPurpose === value && "border-primary bg-primary/5"
              )}
            >
              <RadioGroupItem value={value} id={value} className="sr-only" />
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full bg-muted",
                  selectedPurpose === value && "bg-primary/10"
                )}
              >
                <Icon className={cn("h-5 w-5", colorClass)} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t(`options.${value}.title`)}</p>
                <p className="text-sm text-muted-foreground">
                  {t(`options.${value}.description`)}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                  selectedPurpose === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                )}
              >
                {selectedPurpose === value && <Check className="h-3 w-3" />}
              </div>
            </Label>
          ))}
        </RadioGroup>

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
          <Button type="submit" className="flex-1" disabled={!isValid}>
            {tCommon("continue")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </StepContainer>
  );
}
