import { LogoLoader } from "@workspace/ui/components/logo-loader"
import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <LandingPageContent />
}

function LandingPageContent() {
  const t = useTranslations("home")

  return (
    <main
      className="flex items-center justify-center"
      style={{ minHeight: "calc(100svh - 3.5rem)" }}
    >
      <div className="flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
        <LogoLoader></LogoLoader>
      </div>
    </main>
  )
}
