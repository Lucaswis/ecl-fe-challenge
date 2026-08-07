import { render, screen } from "@testing-library/react"
import { ThemeProvider } from "next-themes"

import { LocaleProvider } from "@/lib/i18n/locale-context"
import type { Locale } from "@/lib/i18n/types"
import { Header } from "."

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}))

function renderHeader(locale: Locale = "es") {
  return render(
    <ThemeProvider attribute="class">
      <LocaleProvider locale={locale}>
        <Header />
      </LocaleProvider>
    </ThemeProvider>
  )
}

describe("Header", () => {
  it("renders a banner with the translated title and both toggles", () => {
    renderHeader("es")

    const banner = screen.getByRole("banner")
    expect(banner).toBeInTheDocument()
    const homeLink = screen.getByRole("link", { name: "Assets" })
    expect(homeLink).toHaveAttribute("href", "/")
    expect(screen.getByRole("button", { name: "Cambiar tema" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cambiar a EN" })).toBeInTheDocument()
  })

  it("translates the title when locale is en", () => {
    renderHeader("en")

    expect(screen.getByRole("button", { name: "Switch to ES" })).toBeInTheDocument()
  })
})
