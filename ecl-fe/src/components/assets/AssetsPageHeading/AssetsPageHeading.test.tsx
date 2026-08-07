import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { AssetsPageHeading } from "."

describe("AssetsPageHeading", () => {
  it("renders the heading and description in Spanish by default", () => {
    renderWithLocale(<AssetsPageHeading />)

    expect(screen.getByRole("heading", { name: "Assets" })).toBeInTheDocument()
    expect(
      screen.getByText("Listado de assets registrados, con filtros por nombre, descripción y fecha.")
    ).toBeInTheDocument()
  })

  it("renders the translated description in English", () => {
    renderWithLocale(<AssetsPageHeading />, "en")

    expect(
      screen.getByText("List of registered assets, with filters by name, description and date.")
    ).toBeInTheDocument()
  })
})
