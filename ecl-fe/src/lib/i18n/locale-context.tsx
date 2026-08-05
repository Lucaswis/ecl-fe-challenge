"use client"

import { createContext, useContext } from "react"
import type { ReactNode } from "react"

import type { Locale } from "./types"

const LocaleContext = createContext<Locale | null>(null)

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  const locale = useContext(LocaleContext)

  if (locale === null) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }

  return locale
}
