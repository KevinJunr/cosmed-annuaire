import Image from "next/image"
import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server"

import { LoginForm } from "@/components/login-form"
import { Link } from "@/i18n/navigation"

export default function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return <LoginPageContent params={params} />
}

async function LoginPageContent({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <LoginPageClient />
}

function LoginPageClient() {
  const t = useTranslations("auth.login")

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
            <LoginForm />
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
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-xl text-white/80">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
