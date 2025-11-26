// Types for onboarding flow

export type OnboardingPurpose = "SEARCH" | "REGISTER" | "BOTH";
export type OnboardingPath = "search" | "register" | "both" | null;
export type IdentifierType = "email" | "phone" | null;
export type CompanyChoice = "existing" | "new" | "none" | null;

export interface CompanyFormData {
  companyName: string;
  sectorId: string;
  country: string;
  address?: string;
  rcs?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  linkedinUrl?: string;
}

export interface OnboardingData {
  // Step 1
  identifier: string;
  identifierType: IdentifierType;
  // Step 2
  purpose: OnboardingPurpose | null;
  // Step 3
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  position: string;
  // Step 4
  password: string;
  isVerified: boolean;
  // Step 5
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
}

export type OnboardingAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_PATH"; payload: OnboardingPath }
  | { type: "UPDATE_DATA"; payload: Partial<OnboardingData> }
  | { type: "SET_COMPANY_DATA"; payload: CompanyFormData }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" }
  | { type: "RESTORE_STATE"; payload: OnboardingState };

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  identifier: "",
  identifierType: null,
  purpose: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  departmentId: "",
  position: "",
  password: "",
  isVerified: false,
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
};

export const TOTAL_STEPS = 5;
export const STORAGE_KEY = "cosmed_onboarding_state";
