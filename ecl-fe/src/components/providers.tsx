"use client"

import { ThemeProvider } from "next-themes"

import { LocaleProvider } from "@/lib/i18n/locale-context"
import type { Locale } from "@/lib/i18n/types"

export function Providers({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LocaleProvider locale={locale}>{children}</LocaleProvider>
    </ThemeProvider>
  )
}
