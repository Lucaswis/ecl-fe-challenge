import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { BackToListingLink } from "./BackToListingLink"

describe("BackToListingLink", () => {
  it("links back to the asset listing", () => {
    renderWithLocale(<BackToListingLink />)

    const link = screen.getByRole("link", { name: "Volver al listado" })
    expect(link).toHaveAttribute("href", "/")
  })

  it("renders the translated label in English", () => {
    renderWithLocale(<BackToListingLink />, "en")

    expect(screen.getByRole("link", { name: "Back to listing" })).toBeInTheDocument()
  })
})
