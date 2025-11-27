import { OnboardingProvider } from "@/providers/onboarding-provider";
import { OnboardingNavbar } from "@/components/onboarding/onboarding-navbar";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <OnboardingNavbar />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          {children}
        </main>
      </div>
    </OnboardingProvider>
  );
}
