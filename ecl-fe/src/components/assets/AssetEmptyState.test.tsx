import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AssetEmptyState } from "./AssetEmptyState"

describe("AssetEmptyState", () => {
  it("shows the no-data copy and no reset button for the no-data variant", () => {
    render(<AssetEmptyState variant="no-data" />)

    expect(screen.getByText("No hay assets registrados")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Limpiar filtros" })).not.toBeInTheDocument()
  })

  it("shows the no-matches copy and a reset button for the no-matches variant", async () => {
    const onReset = jest.fn()
    const user = userEvent.setup()
    render(<AssetEmptyState variant="no-matches" onReset={onReset} />)

    expect(screen.getByText("Ningún asset coincide con los filtros")).toBeInTheDocument()

    const resetButton = screen.getByRole("button", { name: "Limpiar filtros" })
    await user.click(resetButton)

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it("does not render a reset button for no-matches without an onReset handler", () => {
    render(<AssetEmptyState variant="no-matches" />)

    expect(screen.queryByRole("button", { name: "Limpiar filtros" })).not.toBeInTheDocument()
  })
})
