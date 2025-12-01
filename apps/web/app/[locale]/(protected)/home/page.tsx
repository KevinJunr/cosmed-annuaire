"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import { LogoLoader } from "@workspace/ui/components/logo-loader"
import { useAuth } from "@/providers/auth-provider"
import { checkNeedsOnboardingAction } from "@/lib/actions/onboarding"
import { getProfileAction } from "@/lib/actions/profiles"
import { SearchBar } from "@/components/search"

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

  // Get display name (firstName or full name)
  const getDisplayName = () => {
    if (profile?.firstName) {
      return profile.firstName
    }
    if (!user) return ""
    // Fallback to email username or phone
    if (user.email) {
      return user.email.split("@")[0]
    }
    return user.phone || ""
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
      className="flex flex-col"
      style={{ minHeight: "calc(100svh - 3.5rem)" }}
    >
      {/* Hero Section with Search */}
      <section className="relative flex flex-col items-center justify-center px-4 py-12 md:py-20 lg:py-28">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background -z-10" />

        {/* Welcome message */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-sm md:text-base text-primary font-medium mb-2">
            {t("welcomeSubtitle")}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t("welcome", { name: getDisplayName() || "" })}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-4xl px-2">
          <SearchBar />
        </div>

        {/* Quick stats or suggestions placeholder */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("searchHint")}
          </p>
        </div>
      </section>

      {/* Content placeholder - for future featured companies, etc. */}
      <section className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Future: Featured companies, recent searches, etc. */}
        </div>
      </section>
    </main>
  )
}
