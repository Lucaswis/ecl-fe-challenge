"use client"

import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-32 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
      <h2 className="text-lg font-semibold text-foreground">{t("assetDetail.notFound.title")}</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {t("assetDetail.notFound.description")}
      </p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        {t("assetDetail.backToListing")}
      </Link>
    </div>
  )
}
