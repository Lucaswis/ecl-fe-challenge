import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithLocale } from "@/test-utils/render-with-locale"
import type { Locale } from "@/lib/i18n/types"
import { AssetFilters } from "./AssetFilters"
import type { AssetFilterCriteria } from "@/lib/assets/types"

const CRITERIA: AssetFilterCriteria = {
  query: "",
  dateField: "createdAt",
  dateFrom: null,
  dateTo: null,
  severity: "ALL",
}

async function findCalendarDay(day: string) {
  const cells = await screen.findAllByRole("gridcell")
  const match = cells.find(
    (cell) => cell.textContent === day && !cell.hasAttribute("data-outside")
  )

  const button = match?.querySelector("button")
  if (!button) throw new Error(`No calendar day found for "${day}"`)

  return button
}

function setup(overrides: Partial<AssetFilterCriteria> = {}, isFiltered = false, locale: Locale = "es") {
  const onQueryChange = jest.fn()
  const onDateFieldChange = jest.fn()
  const onDateFromChange = jest.fn()
  const onDateToChange = jest.fn()
  const onSeverityChange = jest.fn()
  const onReset = jest.fn()

  renderWithLocale(
    <AssetFilters
      criteria={{ ...CRITERIA, ...overrides }}
      onQueryChange={onQueryChange}
      onDateFieldChange={onDateFieldChange}
      onDateFromChange={onDateFromChange}
      onDateToChange={onDateToChange}
      onSeverityChange={onSeverityChange}
      onReset={onReset}
      isFiltered={isFiltered}
    />,
    locale
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

  it("shows a placeholder when no date is selected", () => {
    setup()

    expect(screen.getByLabelText("Desde")).toHaveTextContent("Seleccionar fecha")
    expect(screen.getByLabelText("Hasta")).toHaveTextContent("Seleccionar fecha")
  })

  it("shows the formatted date when dateFrom/dateTo are set", () => {
    setup({ dateFrom: "2025-01-10", dateTo: "2025-01-31" })

    expect(screen.getByLabelText("Desde")).toHaveTextContent("10 de enero de 2025")
    expect(screen.getByLabelText("Hasta")).toHaveTextContent("31 de enero de 2025")
  })

  it("calls onDateFromChange with an ISO string when a day is picked from the calendar", async () => {
    const user = userEvent.setup()
    const { onDateFromChange } = setup({ dateFrom: "2025-01-10" })

    await user.click(screen.getByLabelText("Desde"))
    await user.click(await findCalendarDay("15"))

    expect(onDateFromChange).toHaveBeenCalledWith("2025-01-15")
  })

  it("calls onDateToChange with an ISO string when a day is picked from the calendar", async () => {
    const user = userEvent.setup()
    const { onDateToChange } = setup({ dateTo: "2025-01-10" })

    await user.click(screen.getByLabelText("Hasta"))
    await user.click(await findCalendarDay("20"))

    expect(onDateToChange).toHaveBeenCalledWith("2025-01-20")
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

  it("translates the calendar's own previous/next month and dropdown aria-labels", async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByLabelText("Desde"))

    expect(await screen.findByRole("button", { name: "Ir al mes anterior" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Ir al mes siguiente" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Elegir el mes" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Elegir el año" })).toBeInTheDocument()
  })

  it("renders translated copy and labels in English", async () => {
    const user = userEvent.setup()
    setup({}, false, "en")

    expect(screen.getByLabelText("Search")).toHaveAttribute("placeholder", "Name or description")
    expect(screen.getByLabelText("Date field")).toBeInTheDocument()
    expect(screen.getByLabelText("From")).toHaveTextContent("Select date")
    expect(screen.getByLabelText("To")).toHaveTextContent("Select date")
    expect(screen.getByLabelText("Severity")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument()

    await user.click(screen.getByLabelText("From"))

    expect(await screen.findByRole("button", { name: "Go to the previous month" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Go to the next month" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Choose the month" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Choose the year" })).toBeInTheDocument()
  })
})
