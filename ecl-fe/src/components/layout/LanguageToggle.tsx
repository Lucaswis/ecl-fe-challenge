"use client"

import { useRouter } from "next/navigation"
import { ES, US } from "country-flag-icons/react/3x2"

import { Button } from "@/components/ui/button"
import { localeCookieString } from "@/lib/i18n/locale-cookie"
import { useTranslation } from "@/hooks/use-translation"
import type { Locale } from "@/lib/i18n/types"

const FLAGS: Record<Locale, typeof ES> = {
  es: ES,
  en: US,
}

export function LanguageToggle() {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const next: Locale = locale === "es" ? "en" : "es"
  const NextFlag = FLAGS[next]

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
      <NextFlag aria-hidden="true" title={next.toUpperCase()} className="size-4 rounded-xs" />
      {next.toUpperCase()}
    </Button>
  )
}
