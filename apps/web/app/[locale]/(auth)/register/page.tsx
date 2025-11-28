import Image from "next/image"
import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { Search, Building2, BarChart3 } from "lucide-react"

import { RegisterForm } from "@/components/register-form"
import { Link } from "@/i18n/navigation"

export default function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <RegisterPageContent params={params} />
}

async function RegisterPageContent({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <RegisterPageClient />
}

function RegisterPageClient() {
  const t = useTranslations("auth.register")

  const features = [
    {
      icon: Search,
      title: t("hero.features.search.title"),
      description: t("hero.features.search.description"),
    },
    {
      icon: Building2,
      title: t("hero.features.company.title"),
      description: t("hero.features.company.description"),
    },
    {
      icon: BarChart3,
      title: t("hero.features.analytics.title"),
      description: t("hero.features.analytics.description"),
    },
  ]

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo - only on mobile */}
        <div className="flex justify-center lg:hidden">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/logo_full.webp"
              alt="Cosmed Annuaire"
              width={140}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Form centered */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Right side - Hero (hidden on mobile) */}
      <div className="relative hidden bg-primary lg:flex flex-col overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-800" />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url('/assets/bright_circles.svg')",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-1 items-center justify-center p-12">
          <div className="text-center max-w-lg">
            {/* Logo */}
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/logo/logo_full.webp"
                alt="Cosmed Annuaire"
                width={220}
                height={50}
                className="h-14 w-auto brightness-0 invert"
                priority
              />
            </Link>

            {/* Text */}
            <h1 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-white/80 mb-10">
              {t("hero.subtitle")}
            </p>

            {/* Features list */}
            <div className="space-y-5 text-left">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-0.5">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
