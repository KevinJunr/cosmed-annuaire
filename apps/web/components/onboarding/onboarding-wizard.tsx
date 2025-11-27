"use client";

import { useOnboarding } from "@/providers/onboarding-provider";
import { OnboardingStepper } from "./onboarding-stepper";
import { StepIdentifier } from "./steps/step-identifier";
import { StepPassword } from "./steps/step-password";
import { StepPurpose } from "./steps/step-purpose";
import { StepPersonalInfo } from "./steps/step-personal-info";
import { StepCompanySelect } from "./steps/step-company-select";
import { StepCompanyCreate } from "./steps/step-company-create";
import { StepVerification } from "./steps/step-verification";

export function OnboardingWizard() {
  const { state } = useOnboarding();
  const { currentStep, path } = state;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepIdentifier />;
      case 2:
        return <StepPassword />;
      case 3:
        return <StepPurpose />;
      case 4:
        return <StepPersonalInfo />;
      case 5:
        // Path A (search) shows company selection
        // Path B (register/both) shows company creation
        if (path === "search") {
          return <StepCompanySelect />;
        }
        return <StepCompanyCreate />;
      case 6:
        return <StepVerification />;
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
