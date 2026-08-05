import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AssetTable } from "./AssetTable"
import type { Asset } from "@/lib/assets/types"

const ASSETS: Asset[] = [
  {
    id: "asset-1",
    name: "Production Server",
    description: "Main backend server",
    createdAt: "2025-01-10T12:00:00Z",
    lastScan: "2025-02-01T10:00:00Z",
  },
  {
    id: "asset-2",
    name: "Frontend Cluster",
    description: "Cluster for web apps",
    createdAt: "2025-01-20T08:30:00Z",
    lastScan: "2025-02-02T09:30:00Z",
  },
]

describe("AssetTable", () => {
  it("renders a row for each asset from props with name/description/createdAt/lastScan and no severity column", () => {
    render(<AssetTable assets={ASSETS} />)

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
    expect(screen.queryByRole("columnheader", { name: /severidad/i })).not.toBeInTheDocument()
  })

  it("narrows the rendered rows when the user types in the filter", async () => {
    const user = userEvent.setup()
    render(<AssetTable assets={ASSETS} />)

    await user.type(screen.getByLabelText("Buscar"), "frontend")

    expect(screen.queryByText("Production Server")).not.toBeInTheDocument()
    expect(screen.getByText("Frontend Cluster")).toBeInTheDocument()
  })

  it("shows the no-data empty state when there are no assets at all", () => {
    render(<AssetTable assets={[]} />)

    expect(screen.getByText("No hay assets registrados")).toBeInTheDocument()
  })

  it("shows the no-matches empty state when the filter matches nothing, and resetting restores the list", async () => {
    const user = userEvent.setup()
    render(<AssetTable assets={ASSETS} />)

    await user.type(screen.getByLabelText("Buscar"), "does-not-exist")

    expect(screen.getByText("Ningún asset coincide con los filtros")).toBeInTheDocument()

    const emptyState = screen.getByTestId("asset-empty-state")
    await user.click(within(emptyState).getByRole("button", { name: "Limpiar filtros" }))

    expect(screen.getByText("Production Server")).toBeInTheDocument()
    expect(screen.getByText("Frontend Cluster")).toBeInTheDocument()
  })

  it("does not render any pagination controls", () => {
    render(<AssetTable assets={ASSETS} />)

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument()
    expect(screen.queryByText(/página/i)).not.toBeInTheDocument()
  })
})
