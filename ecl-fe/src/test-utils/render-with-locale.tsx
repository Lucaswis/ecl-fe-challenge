import type { ReactElement } from "react"
import { render } from "@testing-library/react"

import { LocaleProvider } from "@/lib/i18n/locale-context"
import { DEFAULT_LOCALE } from "@/lib/i18n/types"
import type { Locale } from "@/lib/i18n/types"

export function renderWithLocale(ui: ReactElement, locale: Locale = DEFAULT_LOCALE) {
  return render(ui, {
    wrapper: ({ children }) => <LocaleProvider locale={locale}>{children}</LocaleProvider>,
  })
}
