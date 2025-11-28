"use client"

import { useLocale } from "next-intl"
import { useTransition } from "react"
import { Globe, Check } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import { usePathname, useRouter } from "@/i18n/navigation"
import { locales, localeNames, type Locale } from "@/i18n/config"
import { flags } from "@/components/flags"
import { useAuth } from "@/providers/auth-provider"
import { updatePreferredLanguageAction } from "@/lib/actions/profiles"

interface LanguageSwitcherProps {
  variant?: "default" | "compact"
  className?: string
}

export function LanguageSwitcher({
  variant = "default",
  className,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const { user } = useAuth()

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(async () => {
      // Update URL locale
      router.replace(pathname, { locale: newLocale })

      // If user is authenticated, also update their preferred language in DB
      if (user) {
        await updatePreferredLanguageAction(newLocale)
      }
    })
  }

  const CurrentFlag = flags[locale]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "compact" ? "icon" : "sm"}
          className={cn(
            "gap-2",
            isPending && "opacity-50 pointer-events-none",
            className
          )}
          disabled={isPending}
        >
          {variant === "compact" ? (
            <CurrentFlag />
          ) : (
            <>
              <CurrentFlag />
              <span className="hidden sm:inline">{localeNames[locale]}</span>
              <Globe className="h-4 w-4 sm:hidden" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((loc) => {
          const Flag = flags[loc]
          const isActive = locale === loc
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className="flex items-center justify-between cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
            >
              <span className="flex items-center gap-2">
                <Flag />
                <span className={cn(isActive && "font-medium")}>
                  {localeNames[loc]}
                </span>
              </span>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
