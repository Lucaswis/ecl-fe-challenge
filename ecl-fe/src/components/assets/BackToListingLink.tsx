"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"

import { buttonVariants } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export function BackToListingLink() {
  const { t } = useTranslation()

  return (
    <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
      <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
      {t("assetDetail.backToListing")}
    </Link>
  )
}
