"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("header.theme.toggle")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <HugeiconsIcon icon={Sun02Icon} strokeWidth={2} className="hidden dark:block" />
      <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} className="dark:hidden" />
    </Button>
  )
}
