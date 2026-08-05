import { render, screen } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import { Header } from "./Header"

function renderHeader() {
  return render(
    <ThemeProvider attribute="class">
      <Header />
    </ThemeProvider>
  )
}

describe("Header", () => {
  it("renders a banner containing the theme toggle", () => {
    renderHeader()

    const banner = screen.getByRole("banner")
    expect(banner).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cambiar tema" })).toBeInTheDocument()
  })
})
