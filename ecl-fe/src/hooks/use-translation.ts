"use client"

import { useMemo } from "react"

import { DICTIONARIES } from "@/lib/i18n/dictionaries"
import { translate } from "@/lib/i18n/translate"
import { useLocale } from "@/lib/i18n/locale-context"
import type { TranslationKey } from "@/lib/i18n/types"

export function useTranslation() {
  const locale = useLocale()
  const dict = DICTIONARIES[locale]

  const t = useMemo(
    () => (key: TranslationKey, vars?: Record<string, string>) => translate(dict, key, vars),
    [dict]
  )

  return { t, locale }
}
