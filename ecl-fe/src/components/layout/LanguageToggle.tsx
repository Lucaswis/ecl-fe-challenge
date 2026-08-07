"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { LanguageSkillIcon } from "@hugeicons/core-free-icons"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { localeCookieString } from "@/lib/i18n/locale-cookie"
import { useTranslation } from "@/hooks/use-translation"
import type { Locale } from "@/lib/i18n/types"

const FLAGS: Record<Locale, string> = {
  es: "🇪🇸",
  en: "🇺🇸",
}

export function LanguageToggle() {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const next: Locale = locale === "es" ? "en" : "es"

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={t("header.language.switchTo", { locale: next.toUpperCase() })}
      onClick={() => {
        document.cookie = localeCookieString(next)
        router.refresh()
      }}
    >
      <HugeiconsIcon icon={LanguageSkillIcon} strokeWidth={2} />
      <span aria-hidden="true">{FLAGS[locale]}</span>
      {locale.toUpperCase()}
    </Button>
  )
}
