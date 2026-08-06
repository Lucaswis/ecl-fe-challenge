"use client"

import Link from "next/link"

import { useTranslation } from "@/hooks/use-translation"

export function BackToListingLink() {
  const { t } = useTranslation()

  return (
    <Link href="/" className="text-sm text-muted-foreground hover:underline">
      {t("assetDetail.backToListing")}
    </Link>
  )
}
