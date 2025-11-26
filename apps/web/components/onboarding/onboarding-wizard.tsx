"use client";

import { useOnboarding } from "@/providers/onboarding-provider";
import { OnboardingStepper } from "./onboarding-stepper";
import { StepIdentifier } from "./steps/step-identifier";
import { StepPurpose } from "./steps/step-purpose";
import { StepPersonalInfo } from "./steps/step-personal-info";
import { StepPasswordOtp } from "./steps/step-password-otp";
import { StepCompanySelect } from "./steps/step-company-select";
import { StepCompanyCreate } from "./steps/step-company-create";

export function OnboardingWizard() {
  const { state } = useOnboarding();
  const { currentStep, path } = state;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepIdentifier />;
      case 2:
        return <StepPurpose />;
      case 3:
        return <StepPersonalInfo />;
      case 4:
        return <StepPasswordOtp />;
      case 5:
        // Path A (search) shows company selection
        // Path B (register/both) shows company creation
        if (path === "search") {
          return <StepCompanySelect />;
        }
        return <StepCompanyCreate />;
      default:
        return <StepIdentifier />;
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
