import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider } from "next-themes"

import { LocaleProvider } from "@/lib/i18n/locale-context"
import { ThemeToggle } from "./ThemeToggle"

function renderToggle(locale: "es" | "en" = "es") {
  return render(
    <LocaleProvider locale={locale}>
      <ThemeProvider attribute="class">
        <ThemeToggle />
      </ThemeProvider>
    </LocaleProvider>
  )
}

describe("ThemeToggle", () => {
  it("flips the dark class on html when clicked", async () => {
    const user = userEvent.setup()
    renderToggle()

    const before = document.documentElement.classList.contains("dark")
    await user.click(screen.getByRole("button"))

    expect(document.documentElement.classList.contains("dark")).toBe(!before)
  })

  it("has an accessible name in Spanish", () => {
    renderToggle("es")

    expect(screen.getByRole("button", { name: "Cambiar tema" })).toBeInTheDocument()
  })

  it("has an accessible name in English", () => {
    renderToggle("en")

    expect(screen.getByRole("button", { name: "Toggle theme" })).toBeInTheDocument()
  })

  it("shows the sun icon hidden in light mode, visible in dark mode", () => {
    const { container } = renderToggle()

    const sun = container.querySelector("svg:first-of-type")
    expect(sun).toHaveClass("hidden", "dark:block")
  })

  it("shows the moon icon visible in light mode, hidden in dark mode", () => {
    const { container } = renderToggle()

    const moon = container.querySelector("svg:last-of-type")
    expect(moon).toHaveClass("dark:hidden")
    expect(moon).not.toHaveClass("hidden")
  })
})
