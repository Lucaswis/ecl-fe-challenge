import { screen } from "@testing-library/react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { renderWithLocale } from "@/test-utils/render-with-locale"
import { BackToListingLink } from "."

describe("BackToListingLink", () => {
  it("links back to the asset listing, styled as a button", () => {
    renderWithLocale(<BackToListingLink />)

    const link = screen.getByRole("link", { name: "Volver al listado" })
    expect(link).toHaveAttribute("href", "/")
    expect(link.className).toBe(cn(buttonVariants({ variant: "outline", size: "sm" }), "self-start"))
  })

  it("sizes to its own content instead of stretching to fill its container", () => {
    renderWithLocale(<BackToListingLink />)

    const link = screen.getByRole("link", { name: "Volver al listado" })
    expect(link.className.split(" ")).toContain("self-start")
  })

  it("renders a back arrow icon before the label", () => {
    renderWithLocale(<BackToListingLink />)

    const link = screen.getByRole("link", { name: "Volver al listado" })
    expect(link.querySelector("svg")).toBeInTheDocument()
  })

  it("renders the translated label in English", () => {
    renderWithLocale(<BackToListingLink />, "en")

    expect(screen.getByRole("link", { name: "Back to listing" })).toBeInTheDocument()
  })
})
