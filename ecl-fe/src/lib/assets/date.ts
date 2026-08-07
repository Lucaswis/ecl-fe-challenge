import type { Locale } from "@/lib/i18n/types"
import { DEFAULT_LOCALE } from "@/lib/i18n/types"

export function isoToDate(iso: string | null): Date | undefined {
  if (!iso) return undefined

  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function dateToIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatDisplayDate(iso: string | null, locale: Locale = DEFAULT_LOCALE): string | null {
  const date = isoToDate(iso)
  if (!date) return null

  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date)
}
