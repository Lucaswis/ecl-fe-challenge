import { en } from "./en"
import { es } from "./es"
import { DEFAULT_LOCALE, LOCALES } from "./types"
import type { Dictionary, Locale } from "./types"

export const DICTIONARIES: Record<Locale, Dictionary> = { en, es }

export function resolveLocale(raw?: string): Locale {
  if (raw && (LOCALES as readonly string[]).includes(raw)) return raw as Locale
  return DEFAULT_LOCALE
}
