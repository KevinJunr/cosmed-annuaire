"use client";

import { useOnboarding } from "@/providers/onboarding-provider";
import { OnboardingStepper } from "./onboarding-stepper";
import { StepPurpose } from "./steps/step-purpose";
import { StepPersonalInfo } from "./steps/step-personal-info";
import { StepCompanySelect } from "./steps/step-company-select";
import { StepCompanyCreate } from "./steps/step-company-create";

export function OnboardingWizard() {
  const { state } = useOnboarding();
  const { currentStep, path } = state;

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

  return (
    <div className="w-full max-w-lg flex flex-col gap-8">
      {/* Step content */}
      <div className="flex-1">{renderStep()}</div>

      {/* Stepper at bottom */}
      <OnboardingStepper />
    </div>
  );
}
