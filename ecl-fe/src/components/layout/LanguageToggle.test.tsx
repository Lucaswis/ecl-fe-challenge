import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { LocaleProvider } from "@/lib/i18n/locale-context"
import { LanguageToggle } from "./LanguageToggle"

const refresh = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}))

function renderToggle(locale: "es" | "en" = "es") {
  return render(
    <LocaleProvider locale={locale}>
      <LanguageToggle />
    </LocaleProvider>
  )
}

describe("LanguageToggle", () => {
  beforeEach(() => {
    refresh.mockClear()
    document.cookie = "locale=; max-age=0"
  })

  it("shows the current locale", () => {
    renderToggle("es")

    expect(screen.getByRole("button")).toHaveTextContent("ES")
  })

  it("shows the flag for the current locale", () => {
    renderToggle("es")

    expect(screen.getByRole("button")).toHaveTextContent("🇪🇸")
  })

  it("swaps the flag when the locale changes", () => {
    renderToggle("en")

    const button = screen.getByRole("button")
    expect(button).toHaveTextContent("🇺🇸")
    expect(button).not.toHaveTextContent("🇪🇸")
  })

  it("writes the cookie for the other locale and refreshes, cookie first", async () => {
    const user = userEvent.setup()
    renderToggle("es")

    await user.click(screen.getByRole("button"))

    expect(document.cookie).toContain("locale=en")
    expect(refresh).toHaveBeenCalledTimes(1)
  })
})
