// Types for onboarding flow

export type OnboardingPurpose = "SEARCH" | "REGISTER" | "BOTH";
export type OnboardingPath = "search" | "register" | "both" | null;
export type CompanyChoice = "existing" | "new" | "none" | null;

export interface CompanyFormData {
  companyName: string;
  rcs?: string;
  country: string;
  address?: string;
}

export interface OnboardingData {
  // Step 1: Purpose
  purpose: OnboardingPurpose | null;
  // Step 2: Personal Info
  firstName: string;
  lastName: string;
  departmentId: string;
  position: string;
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
  position: "",
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

export const TOTAL_STEPS = 3;
export const STORAGE_KEY = "cosmed_onboarding_state";
