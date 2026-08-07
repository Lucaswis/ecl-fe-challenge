import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { AssetEmptyState } from "./AssetEmptyState"

describe("AssetEmptyState", () => {
  it("shows the no-data copy and no reset button for the no-data variant", () => {
    renderWithLocale(<AssetEmptyState variant="no-data" />)

    expect(screen.getByText("No hay assets registrados")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Limpiar filtros" })).not.toBeInTheDocument()
  })

  it("shows the no-matches copy and a reset button for the no-matches variant", async () => {
    const onReset = jest.fn()
    const user = userEvent.setup()
    renderWithLocale(<AssetEmptyState variant="no-matches" onReset={onReset} />)

    expect(screen.getByText("Ningún asset coincide con los filtros")).toBeInTheDocument()

    const resetButton = screen.getByRole("button", { name: "Limpiar filtros" })
    await user.click(resetButton)

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it("does not render a reset button for no-matches without an onReset handler", () => {
    renderWithLocale(<AssetEmptyState variant="no-matches" />)

    expect(screen.queryByRole("button", { name: "Limpiar filtros" })).not.toBeInTheDocument()
  })

  it("renders translated copy in English", () => {
    renderWithLocale(<AssetEmptyState variant="no-data" />, "en")
    expect(screen.getByText("No assets registered")).toBeInTheDocument()

    renderWithLocale(<AssetEmptyState variant="no-matches" onReset={jest.fn()} />, "en")
    expect(screen.getByText("No asset matches the filters")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument()
  })
})
