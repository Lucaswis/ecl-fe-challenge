"use client"

import type { ReactNode } from "react"

import { useTranslation } from "@/hooks/use-translation"
import type { TranslationKey } from "@/lib/i18n/types"

interface AssetDetailSectionProps {
  titleKey: TranslationKey
  children: ReactNode
}

export function AssetDetailSection({ titleKey, children }: AssetDetailSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground">{t(titleKey)}</h2>
      {children}
    </section>
  )
}
