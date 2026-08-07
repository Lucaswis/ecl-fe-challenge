"use client"

import Link from "next/link"

import { LanguageToggle } from "@/components/layout/LanguageToggle"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { useTranslation } from "@/hooks/use-translation"

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-3">
      <Link href="/" className="text-sm font-semibold text-foreground">
        {t("header.title")}
      </Link>
      <div className="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
