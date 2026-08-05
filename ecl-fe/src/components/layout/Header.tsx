"use client"

import { ThemeToggle } from "@/components/layout/ThemeToggle"

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-3">
      <span className="text-sm font-semibold text-foreground">Assets</span>
      <ThemeToggle />
    </header>
  )
}
