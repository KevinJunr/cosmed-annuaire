"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import { LogoLoader } from "@workspace/ui/components/logo-loader"
import { useAuth } from "@/providers/auth-provider"
import { checkNeedsOnboardingAction } from "@/lib/actions/onboarding"
import { getProfileAction } from "@/lib/actions/profiles"

interface ProfileData {
  firstName: string | null
  lastName: string | null
}

export default function AuthenticatedHomePage() {
  const t = useTranslations("home")
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)
  const [profile, setProfile] = useState<ProfileData | null>(null)

  // Check onboarding completion status and fetch profile
  useEffect(() => {
    async function checkOnboardingAndFetchProfile() {
      try {
        const result = await checkNeedsOnboardingAction()
        if (result.success && result.needsOnboarding) {
          router.replace("/onboarding")
          return
        }

        // Fetch profile data for welcome message
        const profileResult = await getProfileAction()
        if (profileResult.success && profileResult.profile) {
          setProfile({
            firstName: profileResult.profile.firstName,
            lastName: profileResult.profile.lastName,
          })
        }
      } catch {
        // On error, stay on home page (don't redirect to avoid loops)
        console.error("Error checking onboarding status")
      }
      setIsCheckingOnboarding(false)
    }

    if (!authLoading && user) {
      checkOnboardingAndFetchProfile()
    }
  }, [router, authLoading, user])

  // Get display name (firstName lastName or email/phone fallback)
  const getDisplayName = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`
    }
    if (profile?.firstName) {
      return profile.firstName
    }
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
        <LogoLoader size="lg" />
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
          {t("welcome", { name: getDisplayName() })}
        </h1>
        <p className="text-muted-foreground">{t("welcomeSubtitle")}</p>
      </div>
    </main>
  )
}
