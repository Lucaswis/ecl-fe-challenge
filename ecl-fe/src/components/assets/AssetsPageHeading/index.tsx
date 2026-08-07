"use client"

import { useTranslation } from "@/hooks/use-translation"

export function AssetsPageHeading() {
  const { t } = useTranslation()

  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold text-foreground">{t("assetsPage.heading")}</h1>
      <p className="text-sm text-muted-foreground">{t("assetsPage.description")}</p>
    </header>
  )
}
