// Types for onboarding flow

export type OnboardingPurpose = "SEARCH" | "REGISTER" | "BOTH";
export type OnboardingPath = "search" | "register" | "both" | null;
export type CompanyChoice = "existing" | "new" | "none" | null;

export type LegalIdType = "DUNS" | "SIREN";

export interface CompanyFormData {
  countryId: string;
  companyName: string;
  legalIdType: LegalIdType;
  legalId: string;
  address?: string;
}

export interface OnboardingData {
  // Step 1: Purpose
  purpose: OnboardingPurpose | null;
  // Step 2: Personal Info
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
  // Step 3: Company
  companyChoice: CompanyChoice;
  selectedCompanyId: string | null;
  newCompanyData: CompanyFormData | null;
}

export interface OnboardingState {
  currentStep: number;
  direction: 1 | -1;
  path: OnboardingPath;
  data: OnboardingData;
  isLoading: boolean;
  isCompleted: boolean;
}

export type OnboardingAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_PATH"; payload: OnboardingPath }
  | { type: "UPDATE_DATA"; payload: Partial<OnboardingData> }
  | { type: "SET_COMPANY_DATA"; payload: CompanyFormData }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "COMPLETE" }
  | { type: "RESET" }
  | { type: "RESTORE_STATE"; payload: OnboardingState };

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  purpose: null,
  firstName: "",
  lastName: "",
  departmentId: "",
  positionId: "",
  companyChoice: null,
  selectedCompanyId: null,
  newCompanyData: null,
};

export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  currentStep: 1,
  direction: 1,
  path: null,
  data: INITIAL_ONBOARDING_DATA,
  isLoading: false,
  isCompleted: false,
};

// Base steps: 1. Purpose, 2. Personal Info, 3. Company Select
// When creating a new company, add step 4: Company Create
export const BASE_STEPS = 3;
export const STEPS_WITH_COMPANY_CREATE = 4;

/**
 * Get total steps based on the current path and company choice
 */
export function getTotalSteps(path: OnboardingPath, companyChoice: CompanyChoice): number {
  // If user chose to create a new company, there's an extra step
  if (path === "register" && companyChoice === "new") {
    return STEPS_WITH_COMPANY_CREATE;
  }
  return BASE_STEPS;
}

// Keep for backwards compatibility
export const TOTAL_STEPS = BASE_STEPS;
export const STORAGE_KEY = "cosmed_onboarding_state";
