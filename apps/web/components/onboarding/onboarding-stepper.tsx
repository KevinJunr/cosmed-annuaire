"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useOnboarding } from "@/providers/onboarding-provider";

export function OnboardingStepper() {
  const t = useTranslations("onboarding.stepper");
  const { state, totalSteps } = useOnboarding();
  const currentStep = state.currentStep;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex items-center justify-center w-full max-w-xs">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              {/* Step indicator */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isActive && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step
                )}
              </div>

              {/* Separator line */}
              {step < totalSteps && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors",
                    step < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {t(`step${currentStep}`)}
      </p>
    </div>
  );
}
