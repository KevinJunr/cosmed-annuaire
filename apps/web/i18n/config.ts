export const locales = ["fr", "en", "zh", "ar", "es"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "fr"

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  zh: "中文",
  ar: "العربية",
  es: "Español",
}

// RTL languages
export const rtlLocales: Locale[] = ["ar"]

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}
