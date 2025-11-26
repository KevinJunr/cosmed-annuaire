import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server"

import { Navbar } from "@/components/navbar"

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  // This is needed for static rendering with next-intl
  // We need to await params but can't in a sync function, so we use a workaround
  return <HomePageContent params={params} />
}

async function HomePageContent({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <HomePageClient />
}

function HomePageClient() {
  const t = useTranslations("home")

  return (
    <div className="min-h-svh">
      <Navbar />
      <main
        className="flex items-center justify-center"
        style={{ minHeight: "calc(100svh - 3.5rem)" }}
      >
        <div className="flex flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>
      </main>
    </div>
  )
}
