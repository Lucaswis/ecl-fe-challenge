import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { Footer } from "./Footer"

describe("Footer", () => {
  it("renders the created-by credit with the author's name", () => {
    renderWithLocale(<Footer />)

    expect(screen.getByText("Creado por:")).toBeInTheDocument()
    expect(screen.getByText("Lucas Wisgikl")).toBeInTheDocument()
  })

  it("translates the created-by label in English", () => {
    renderWithLocale(<Footer />, "en")

    expect(screen.getByText("Created by:")).toBeInTheDocument()
    expect(screen.getByText("Lucas Wisgikl")).toBeInTheDocument()
  })

  it("links to the LinkedIn profile", () => {
    renderWithLocale(<Footer />)

    const link = screen.getByRole("link", { name: /lucas wisgikl/i })
    expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/lucas-wisgikl/")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"))
    expect(link.querySelector("svg")).toBeInTheDocument()
  })
})
