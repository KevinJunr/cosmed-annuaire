"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  type OnboardingState,
  type OnboardingAction,
  type OnboardingData,
  type OnboardingPath,
  type CompanyFormData,
  INITIAL_ONBOARDING_STATE,
  TOTAL_STEPS,
  STORAGE_KEY,
} from "@/types";

// Reducer
function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        direction: action.payload > state.currentStep ? 1 : -1,
        currentStep: Math.max(1, Math.min(action.payload, TOTAL_STEPS)),
      };

    case "NEXT_STEP":
      if (state.currentStep >= TOTAL_STEPS) return state;
      return {
        ...state,
        direction: 1,
        currentStep: state.currentStep + 1,
      };

    case "PREV_STEP":
      if (state.currentStep <= 1) return state;
      return {
        ...state,
        direction: -1,
        currentStep: state.currentStep - 1,
      };

    case "SET_PATH":
      return {
        ...state,
        path: action.payload,
      };

    case "UPDATE_DATA":
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      };

    case "SET_COMPANY_DATA":
      return {
        ...state,
        data: {
          ...state.data,
          newCompanyData: action.payload,
        },
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "COMPLETE":
      return {
        ...state,
        isCompleted: true,
      };

    case "RESET":
      return INITIAL_ONBOARDING_STATE;

    case "RESTORE_STATE":
      return action.payload;

    default:
      return state;
  }
}

// Context type
interface OnboardingContextValue {
  state: OnboardingState;
  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  // Data management
  updateData: (data: Partial<OnboardingData>) => void;
  setPath: (path: OnboardingPath) => void;
  setCompanyData: (data: CompanyFormData) => void;
  // Utils
  setLoading: (loading: boolean) => void;
  complete: () => void;
  reset: () => void;
  // Computed
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  canGoNext: boolean;
}

// Context
const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

// Provider props
interface OnboardingProviderProps {
  children: ReactNode;
}

// Provider component
export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [state, dispatch] = useReducer(
    onboardingReducer,
    INITIAL_ONBOARDING_STATE
  );

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as OnboardingState;
        dispatch({ type: "RESTORE_STATE", payload: parsed });
      }
    } catch {
      // Ignore parse errors, start fresh
    }
  }, []);

  // Persist state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  // Navigation actions
  const nextStep = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  }, []);

  // Data actions
  const updateData = useCallback((data: Partial<OnboardingData>) => {
    dispatch({ type: "UPDATE_DATA", payload: data });
  }, []);

  const setPath = useCallback((path: OnboardingPath) => {
    dispatch({ type: "SET_PATH", payload: path });
  }, []);

  const setCompanyData = useCallback((data: CompanyFormData) => {
    dispatch({ type: "SET_COMPANY_DATA", payload: data });
  }, []);

  // Utility actions
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const complete = useCallback(() => {
    dispatch({ type: "COMPLETE" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  // Computed values
  const isFirstStep = state.currentStep === 1;
  const isLastStep = state.currentStep === TOTAL_STEPS;
  const progress = (state.currentStep / TOTAL_STEPS) * 100;
  const canGoNext = !state.isLoading && state.currentStep < TOTAL_STEPS;

  const value: OnboardingContextValue = {
    state,
    nextStep,
    prevStep,
    goToStep,
    updateData,
    setPath,
    setCompanyData,
    setLoading,
    complete,
    reset,
    isFirstStep,
    isLastStep,
    progress,
    canGoNext,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Hook
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
