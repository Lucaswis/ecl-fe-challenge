import { LOCALE_COOKIE } from "./types"
import type { Locale } from "./types"

const ONE_YEAR = 60 * 60 * 24 * 365

export function localeCookieString(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`
}
