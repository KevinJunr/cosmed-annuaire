"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
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
} from "@/types";
import {
  loadOnboardingProgressAction,
  saveOnboardingProgressAction,
  completeOnboardingAction,
} from "@/lib/actions/onboarding";

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
  complete: (overrideData?: Partial<OnboardingData>, locale?: string) => Promise<boolean>;
  reset: () => void;
  // Computed
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  canGoNext: boolean;
  isInitialized: boolean;
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
  const isInitializedRef = useRef(false);
  const isSavingRef = useRef(false);

  // Load state from database on mount
  useEffect(() => {
    async function loadProgress() {
      try {
        // Load from database only (no localStorage)
        const result = await loadOnboardingProgressAction();
        if (result.success && result.data) {
          const dbState: OnboardingState = {
            ...INITIAL_ONBOARDING_STATE,
            currentStep: result.data.currentStep,
            data: {
              ...INITIAL_ONBOARDING_STATE.data,
              ...result.data.data,
            },
            path: result.data.data.purpose
              ? (result.data.data.purpose.toLowerCase() as OnboardingPath)
              : null,
          };
          dispatch({ type: "RESTORE_STATE", payload: dbState });
        }
        // If no DB state, user starts fresh at step 1
      } catch {
        // Ignore errors, use initial state (step 1)
      } finally {
        isInitializedRef.current = true;
      }
    }

    loadProgress();
  }, []);

  // Save to database when step changes (debounced)
  useEffect(() => {
    if (!isInitializedRef.current || isSavingRef.current) return;

    async function saveToDb() {
      isSavingRef.current = true;
      try {
        await saveOnboardingProgressAction(state.currentStep, state.data);
      } catch {
        // Ignore errors, localStorage is the fallback
      } finally {
        isSavingRef.current = false;
      }
    }

    // Debounce save
    const timeout = setTimeout(saveToDb, 500);
    return () => clearTimeout(timeout);
  }, [state.currentStep, state.data]);

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

  const complete = useCallback(async (overrideData?: Partial<OnboardingData>, locale?: string): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Merge current state with override data
      const finalData: OnboardingData = {
        ...state.data,
        ...overrideData,
      };

      const result = await completeOnboardingAction(finalData, locale);

      if (result.success) {
        dispatch({ type: "COMPLETE" });
        return true;
      }

      console.error("Failed to complete onboarding:", result.error);
      return false;
    } catch (error) {
      console.error("Error completing onboarding:", error);
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.data]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
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
    isInitialized: isInitializedRef.current,
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
