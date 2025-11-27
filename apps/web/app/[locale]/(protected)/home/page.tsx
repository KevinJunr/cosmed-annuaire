"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import { useAuth } from "@/providers/auth-provider"
import { STORAGE_KEY, type OnboardingState } from "@/types"

export default function AuthenticatedHomePage() {
  const t = useTranslations("home")
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)

  // Check onboarding completion status on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const state = JSON.parse(saved) as OnboardingState
        if (!state.isCompleted) {
          router.replace("/onboarding")
          return
        }
      } else {
        // No saved state means onboarding not completed
        router.replace("/onboarding")
        return
      }
    } catch {
      // On error, redirect to onboarding to be safe
      router.replace("/onboarding")
      return
    }
    setIsCheckingOnboarding(false)
  }, [router])

  // Get display identifier (email or phone)
  const getDisplayIdentifier = () => {
    if (!user) return ""
    return user.email || user.phone || ""
  }

  // Show loading state while checking auth or onboarding
  if (authLoading || isCheckingOnboarding) {
    return (
      <main
        className="flex items-center justify-center"
        style={{ minHeight: "calc(100svh - 3.5rem)" }}
      >
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </main>
    )
  }

  return (
    <main
      className="flex items-center justify-center"
      style={{ minHeight: "calc(100svh - 3.5rem)" }}
    >
      <div className="flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold text-center">
          {t("welcome", { identifier: getDisplayIdentifier() })}
        </h1>
        <p className="text-muted-foreground">{t("welcomeSubtitle")}</p>
      </div>
    </main>
  )
}
