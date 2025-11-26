import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { RegisterForm } from "@/components/register-form";
import { Link } from "@/i18n/navigation";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <RegisterPageContent params={params} />;
}

async function RegisterPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterPageClient />;
}

function RegisterPageClient() {
  const t = useTranslations("auth.register");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo */}
        <div className="flex justify-center lg:justify-start">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/logo_full.svg"
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
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Right side - Image (hidden on mobile) */}
      <div className="relative hidden bg-primary lg:block overflow-hidden">
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
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-secondary mb-2">
              {t("title")}
            </h2>
            <p className="text-secondary max-w-md">{t("subtitle")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
