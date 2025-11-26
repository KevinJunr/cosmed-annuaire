import { defineRouting } from "next-intl/routing"
import { locales, defaultLocale } from "./config"

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed", // Only show locale prefix for non-default locales
})
