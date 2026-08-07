import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import NotFound from "./not-found"

describe("AssetDetail NotFound", () => {
  it("renders the not-found message and a link back to the listing", () => {
    renderWithLocale(<NotFound />)

    expect(screen.getByText("No encontramos este asset")).toBeInTheDocument()
    expect(screen.getByText("Puede que el id no exista o haya sido eliminado.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Volver al listado" })).toHaveAttribute("href", "/")
  })

  it("translates the message when locale is en", () => {
    renderWithLocale(<NotFound />, "en")

    expect(screen.getByText("We couldn't find this asset")).toBeInTheDocument()
    expect(screen.getByText("The id might not exist or may have been removed.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Back to listing" })).toBeInTheDocument()
  })
})
