"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useOnboarding } from "@/providers/onboarding-provider";
import { checkNeedsOnboardingAction } from "@/lib/actions/onboarding";
import { OnboardingStepper } from "./onboarding-stepper";
import { StepPurpose } from "./steps/step-purpose";
import { StepPersonalInfo } from "./steps/step-personal-info";
import { StepCompanySelect } from "./steps/step-company-select";
import { StepCompanyCreate } from "./steps/step-company-create";

export function OnboardingWizard() {
  const { state } = useOnboarding();
  const { currentStep, path } = state;
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Check if user has already completed onboarding
  useEffect(() => {
    async function checkStatus() {
      try {
        const result = await checkNeedsOnboardingAction();
        if (result.success && !result.needsOnboarding) {
          // User has already completed onboarding, redirect to home
          router.replace("/home");
          return;
        }
      } catch {
        // On error, stay on onboarding
      }
      setIsChecking(false);
    }
    checkStatus();
  }, [router]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPurpose />;
      case 2:
        return <StepPersonalInfo />;
      case 3:
        // Path "search" shows company selection (optional)
        // Path "register/both" shows company creation
        if (path === "search") {
          return <StepCompanySelect />;
        }
        return <StepCompanyCreate />;
      default:
        return <StepPurpose />;
    }
  };

  // Show loading while checking status
  if (isChecking) {
    return (
      <div className="w-full max-w-lg flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg flex flex-col gap-8">
      {/* Step content */}
      <div className="flex-1">{renderStep()}</div>

      {/* Stepper at bottom */}
      <OnboardingStepper />
    </div>
  );
}
