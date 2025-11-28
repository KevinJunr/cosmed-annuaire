"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Search, Building2, Users, Check } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from "@workspace/ui/components/item";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { cn } from "@workspace/ui/lib/utils";

import { StepContainer } from "../step-container";
import { useOnboarding } from "@/providers/onboarding-provider";
import { purposeSchema, type PurposeFormData } from "@/lib/validations/onboarding";

const PURPOSE_OPTIONS = [
  { value: "SEARCH", icon: Search, colorClass: "text-blue-500", bgClass: "bg-blue-500/10" },
  { value: "REGISTER", icon: Building2, colorClass: "text-green-500", bgClass: "bg-green-500/10" },
  { value: "BOTH", icon: Users, colorClass: "text-purple-500", bgClass: "bg-purple-500/10" },
] as const;

export function StepPurpose() {
  const t = useTranslations("onboarding.step1");
  const tCommon = useTranslations("onboarding.common");
  const { state, updateData, setPath, nextStep } = useOnboarding();

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
          className="contents"
        >
          <ItemGroup className="gap-3">
            {PURPOSE_OPTIONS.map(({ value, icon: Icon, colorClass, bgClass }) => {
              const isSelected = selectedPurpose === value;
              return (
                <label key={value} htmlFor={value} className="cursor-pointer">
                  <RadioGroupItem value={value} id={value} className="sr-only" />
                  <Item
                    variant="outline"
                    className={cn(
                      "transition-all hover:bg-muted/50",
                      isSelected && "border-primary bg-primary/5 ring-1 ring-primary/20"
                    )}
                  >
                    <ItemMedia
                      className={cn(
                        "size-10 rounded-full",
                        isSelected ? bgClass : "bg-muted"
                      )}
                    >
                      <Icon className={cn("size-5", colorClass)} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{t(`options.${value}.title`)}</ItemTitle>
                      <ItemDescription>
                        {t(`options.${value}.description`)}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <div
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && <Check className="size-3" />}
                      </div>
                    </ItemActions>
                  </Item>
                </label>
              );
            })}
          </ItemGroup>
        </RadioGroup>

        <Button type="submit" className="w-full" disabled={!isValid}>
          {tCommon("continue")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </StepContainer>
  );
}
