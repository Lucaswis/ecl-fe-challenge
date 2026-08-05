import { renderHook } from "@testing-library/react"
import type { ReactNode } from "react"

import { LocaleProvider } from "@/lib/i18n/locale-context"
import { useTranslation } from "./use-translation"

function wrapperFor(locale: "es" | "en") {
  function Wrapper({ children }: { children: ReactNode }) {
    return <LocaleProvider locale={locale}>{children}</LocaleProvider>
  }

  return Wrapper
}

describe("useTranslation", () => {
  it("returns the provider's locale and translates through it", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapperFor("es") })

    expect(result.current.locale).toBe("es")
    expect(result.current.t("header.theme.toggle")).toBe("Cambiar tema")
  })

  it("switches dictionaries when the provider locale changes", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapperFor("en") })

    expect(result.current.locale).toBe("en")
    expect(result.current.t("header.theme.toggle")).toBe("Toggle theme")
  })

  it("throws when used outside a LocaleProvider", () => {
    expect(() => renderHook(() => useTranslation())).toThrow("useLocale must be used within a LocaleProvider")
  })
})
