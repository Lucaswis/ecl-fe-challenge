import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithLocale } from "@/test-utils/render-with-locale"
import { AssetTable } from "./AssetTable"
import { mergeAssets } from "@/lib/assets/local-store"
import type { AssetWithSeverity } from "@/lib/assets/types"

jest.mock("../../lib/assets/local-store", () => {
  const actual = jest.requireActual("../../lib/assets/local-store")
  return { ...actual, mergeAssets: jest.fn(actual.mergeAssets) }
})

const mockedMergeAssets = mergeAssets as jest.MockedFunction<typeof mergeAssets>

const ASSETS: AssetWithSeverity[] = [
  {
    id: "asset-1",
    name: "Production Server",
    description: "Main backend server",
    createdAt: "2025-01-10T12:00:00Z",
    lastScan: "2025-02-01T10:00:00Z",
    highestSeverity: "HIGH",
    vulnerabilityCount: 2,
  },
  {
    id: "asset-2",
    name: "Frontend Cluster",
    description: "Cluster for web apps",
    createdAt: "2025-01-20T08:30:00Z",
    lastScan: "2025-02-02T09:30:00Z",
    highestSeverity: "CRITICAL",
    vulnerabilityCount: 1,
  },
]

describe("AssetTable", () => {
  it("renders a row for each asset from props with name/description/createdAt/lastScan/severity", () => {
    renderWithLocale(<AssetTable assets={ASSETS} />)

    expect(screen.getByText("Production Server")).toBeInTheDocument()
    expect(screen.getByText("Main backend server")).toBeInTheDocument()
    expect(screen.getByText("2025-01-10")).toBeInTheDocument()
    expect(screen.getByText("2025-02-01")).toBeInTheDocument()
    expect(screen.getByText("Frontend Cluster")).toBeInTheDocument()
    expect(screen.getAllByTestId("asset-table-row")).toHaveLength(2)

    expect(screen.getByRole("columnheader", { name: "Nombre" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Descripción" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Creado" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Último escaneo" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Severidad" })).toBeInTheDocument()
    expect(screen.getByText("HIGH · 2 vulnerabilidades")).toBeInTheDocument()
    expect(screen.getByText("CRITICAL · 1 vulnerabilidad")).toBeInTheDocument()
  })

  it("narrows the rendered rows when the user types in the filter", async () => {
    const user = userEvent.setup()
    renderWithLocale(<AssetTable assets={ASSETS} />)

    await user.type(screen.getByLabelText("Buscar"), "frontend")

    expect(screen.queryByText("Production Server")).not.toBeInTheDocument()
    expect(screen.getByText("Frontend Cluster")).toBeInTheDocument()
  })

  it("shows the no-data empty state when there are no assets at all", () => {
    renderWithLocale(<AssetTable assets={[]} />)

    expect(screen.getByText("No hay assets registrados")).toBeInTheDocument()
  })

  it("shows the no-matches empty state when the filter matches nothing, and resetting restores the list", async () => {
    const user = userEvent.setup()
    renderWithLocale(<AssetTable assets={ASSETS} />)

    await user.type(screen.getByLabelText("Buscar"), "does-not-exist")

    expect(screen.getByText("Ningún asset coincide con los filtros")).toBeInTheDocument()

    const emptyState = screen.getByTestId("asset-empty-state")
    await user.click(within(emptyState).getByRole("button", { name: "Limpiar filtros" }))

    expect(screen.getByText("Production Server")).toBeInTheDocument()
    expect(screen.getByText("Frontend Cluster")).toBeInTheDocument()
  })

  it("does not render any pagination controls", () => {
    renderWithLocale(<AssetTable assets={ASSETS} />)

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument()
    expect(screen.queryByText(/página/i)).not.toBeInTheDocument()
  })

  it("renders translated column headers in English", () => {
    renderWithLocale(<AssetTable assets={ASSETS} />, "en")

    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Description" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Created" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Last scan" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Severity" })).toBeInTheDocument()
  })

  it("merges an empty store into the table as a content no-op against the assets prop", () => {
    renderWithLocale(<AssetTable assets={ASSETS} />)

    expect(mockedMergeAssets).toHaveBeenCalledWith(ASSETS, [], new Set())
  })

  it("keeps the surviving row's DOM node stable when an earlier row gets filtered out", async () => {
    const user = userEvent.setup()
    renderWithLocale(<AssetTable assets={ASSETS} />)

    const rowBefore = screen.getByText("Frontend Cluster").closest("tr")
    await user.type(screen.getByLabelText("Buscar"), "frontend")
    const rowAfter = screen.getByText("Frontend Cluster").closest("tr")

    expect(rowAfter).toBe(rowBefore)
  })

  it("renders the Action column header", () => {
    renderWithLocale(<AssetTable assets={ASSETS} />)

    expect(screen.getByRole("columnheader", { name: "Acciones" })).toBeInTheDocument()
  })

  it("removes a row from the table once its delete is confirmed", async () => {
    const user = userEvent.setup()
    renderWithLocale(<AssetTable assets={ASSETS} />)

    await user.click(screen.getByRole("button", { name: "Eliminar Production Server" }))
    await user.click(screen.getByRole("button", { name: "Eliminar" }))

    expect(screen.queryByText("Production Server")).not.toBeInTheDocument()
    expect(screen.getByText("Frontend Cluster")).toBeInTheDocument()
  })

  it("resets the view to page 1 once a delete leaves only one page of results", async () => {
    const user = userEvent.setup()
    const manyAssets: AssetWithSeverity[] = Array.from({ length: 11 }, (_, i) => ({
      ...ASSETS[0],
      id: `asset-many-${i}`,
      name: `Asset ${i}`,
    }))
    renderWithLocale(<AssetTable assets={manyAssets} />)

    await user.click(screen.getByRole("button", { name: "Siguiente" }))
    expect(screen.getByText("Asset 10")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Eliminar Asset 10" }))
    await user.click(screen.getByRole("button", { name: "Eliminar" }))

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument()
    expect(screen.getByText("Asset 0")).toBeInTheDocument()
  })
})
