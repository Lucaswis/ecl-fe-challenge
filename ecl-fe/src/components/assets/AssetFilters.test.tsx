import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AssetFilters } from "./AssetFilters"
import type { AssetFilterCriteria } from "@/lib/assets/types"

const CRITERIA: AssetFilterCriteria = {
  query: "",
  dateField: "createdAt",
  dateFrom: null,
  dateTo: null,
  severity: "ALL",
}

function setup(overrides: Partial<AssetFilterCriteria> = {}, isFiltered = false) {
  const onQueryChange = jest.fn()
  const onDateFieldChange = jest.fn()
  const onDateFromChange = jest.fn()
  const onDateToChange = jest.fn()
  const onSeverityChange = jest.fn()
  const onReset = jest.fn()

  render(
    <AssetFilters
      criteria={{ ...CRITERIA, ...overrides }}
      onQueryChange={onQueryChange}
      onDateFieldChange={onDateFieldChange}
      onDateFromChange={onDateFromChange}
      onDateToChange={onDateToChange}
      onSeverityChange={onSeverityChange}
      onReset={onReset}
      isFiltered={isFiltered}
    />
  )

  return { onQueryChange, onDateFieldChange, onDateFromChange, onDateToChange, onSeverityChange, onReset }
}

describe("AssetFilters", () => {
  it("renders the query input controlled by criteria.query", () => {
    setup({ query: "server" })

    expect(screen.getByLabelText("Buscar")).toHaveValue("server")
  })

  it("calls onQueryChange as the user types", async () => {
    const user = userEvent.setup()
    const { onQueryChange } = setup()

    await user.type(screen.getByLabelText("Buscar"), "a")

    expect(onQueryChange).toHaveBeenCalledWith("a")
  })

  it("calls onDateFromChange and onDateToChange when the date inputs change", async () => {
    const user = userEvent.setup()
    const { onDateFromChange, onDateToChange } = setup()

    await user.type(screen.getByLabelText("Desde"), "2025-01-01")
    await user.type(screen.getByLabelText("Hasta"), "2025-01-31")

    expect(onDateFromChange).toHaveBeenCalled()
    expect(onDateToChange).toHaveBeenCalled()
  })

  it("calls onDateFieldChange when the date field selector changes", async () => {
    const user = userEvent.setup()
    const { onDateFieldChange } = setup()

    await user.click(screen.getByLabelText("Fecha de"))
    await user.click(await screen.findByRole("option", { name: "Último escaneo" }))

    expect(onDateFieldChange).toHaveBeenCalledWith("lastScan")
  })

  it("disables the reset button when no filter is active", () => {
    setup({}, false)

    expect(screen.getByRole("button", { name: "Limpiar filtros" })).toBeDisabled()
  })

  it("enables the reset button and calls onReset when a filter is active", async () => {
    const user = userEvent.setup()
    const { onReset } = setup({ query: "server" }, true)

    const resetButton = screen.getByRole("button", { name: "Limpiar filtros" })
    expect(resetButton).toBeEnabled()

    await user.click(resetButton)

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it("renders a severity select with exactly the four real severities plus Todas", async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByLabelText("Severidad"))
    const options = await screen.findAllByRole("option")

    expect(options.map((option) => option.textContent)).toEqual([
      "Todas",
      "Crítica",
      "Alta",
      "Media",
      "Baja",
    ])
  })

  it("does not offer Sin vulnerabilidades or N/D as severity filter options", async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByLabelText("Severidad"))
    await screen.findAllByRole("option")

    expect(screen.queryByText(/sin vulnerabilidades/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/n\/d/i)).not.toBeInTheDocument()
  })

  it("calls onSeverityChange when the severity select changes", async () => {
    const user = userEvent.setup()
    const { onSeverityChange } = setup()

    await user.click(screen.getByLabelText("Severidad"))
    await user.click(await screen.findByRole("option", { name: "Crítica" }))

    expect(onSeverityChange).toHaveBeenCalledWith("CRITICAL")
  })
})
