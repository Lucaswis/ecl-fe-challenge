import { en } from "./en"

export const LOCALES = ["es", "en"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "es"

export const LOCALE_COOKIE = "locale"

export type TranslationKey = keyof typeof en

export type Dictionary = Record<TranslationKey, string>
