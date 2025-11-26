"use client";

import { cn } from "@workspace/ui/lib/utils";
import { useOnboarding } from "@/providers/onboarding-provider";

interface StepContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function StepContainer({ children, className }: StepContainerProps) {
  const { state } = useOnboarding();
  const { direction } = state;

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto",
        "animate-in fade-in duration-300",
        direction === 1
          ? "slide-in-from-right-4"
          : "slide-in-from-left-4",
        className
      )}
    >
      {children}
    </div>
  );
}
