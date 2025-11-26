"use client"

import { useTranslations } from "next-intl"

import { useAuth } from "@/providers/auth-provider"

export default function AuthenticatedHomePage() {
  const t = useTranslations("home")
  const { user, isLoading } = useAuth()

  // Get display identifier (email or phone)
  const getDisplayIdentifier = () => {
    if (!user) return ""
    return user.email || user.phone || ""
  }

  // Show loading state
  if (isLoading) {
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
