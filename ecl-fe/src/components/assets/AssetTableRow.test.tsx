import { render, screen } from "@testing-library/react"
import { Table, TableBody } from "@/components/ui/table"
import { AssetTableRow } from "./AssetTableRow"
import type { AssetWithSeverity } from "@/lib/assets/types"

const ASSET: AssetWithSeverity = {
  id: "asset-1",
  name: "Production Server",
  description: "Main backend server",
  createdAt: "2025-01-10T12:00:00Z",
  lastScan: "2025-02-01T10:00:00Z",
  highestSeverity: "HIGH",
  vulnerabilityCount: 2,
}

describe("AssetTableRow", () => {
  it("renders the asset name as a link to its detail page", () => {
    render(
      <Table>
        <TableBody>
          <AssetTableRow asset={ASSET} index={0} />
        </TableBody>
      </Table>
    )

    const link = screen.getByRole("link", { name: "Production Server" })
    expect(link).toHaveAttribute("href", "/assets/asset-1")
  })

  it("leaves the other cells unchanged", () => {
    render(
      <Table>
        <TableBody>
          <AssetTableRow asset={ASSET} index={0} />
        </TableBody>
      </Table>
    )

    expect(screen.getByText("Main backend server")).toBeInTheDocument()
    expect(screen.getByText("2025-01-10")).toBeInTheDocument()
    expect(screen.getByText("2025-02-01")).toBeInTheDocument()
    expect(screen.getByText("HIGH · 2 vulnerabilidades")).toBeInTheDocument()
  })
})
