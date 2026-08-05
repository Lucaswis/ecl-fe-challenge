import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider } from "next-themes"
import { ThemeToggle } from "./ThemeToggle"

function renderToggle() {
  return render(
    <ThemeProvider attribute="class">
      <ThemeToggle />
    </ThemeProvider>
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

  it("has a stable accessible name", () => {
    renderToggle()

    expect(screen.getByRole("button", { name: "Cambiar tema" })).toBeInTheDocument()
  })
})
