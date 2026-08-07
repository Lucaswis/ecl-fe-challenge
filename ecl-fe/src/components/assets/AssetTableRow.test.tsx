import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Table, TableBody } from "@/components/ui/table"
import { renderWithLocale } from "@/test-utils/render-with-locale"
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
    renderWithLocale(
      <Table>
        <TableBody>
          <AssetTableRow asset={ASSET} index={0} onDelete={jest.fn()} />
        </TableBody>
      </Table>
    )

    const link = screen.getByRole("link", { name: "Production Server" })
    expect(link).toHaveAttribute("href", "/assets/asset-1")
    expect(link).toHaveClass("text-primary", "underline")
  })

  it("leaves the other cells unchanged", () => {
    renderWithLocale(
      <Table>
        <TableBody>
          <AssetTableRow asset={ASSET} index={0} onDelete={jest.fn()} />
        </TableBody>
      </Table>
    )

    expect(screen.getByText("Main backend server")).toBeInTheDocument()
    expect(screen.getByText("2025-01-10")).toBeInTheDocument()
    expect(screen.getByText("2025-02-01")).toBeInTheDocument()
    expect(screen.getByText("HIGH · 2 vulnerabilidades")).toBeInTheDocument()
  })

  it("renders a delete trigger with an accessible name identifying the asset", () => {
    renderWithLocale(
      <Table>
        <TableBody>
          <AssetTableRow asset={ASSET} index={0} onDelete={jest.fn()} />
        </TableBody>
      </Table>
    )

    expect(screen.getByRole("button", { name: "Eliminar Production Server" })).toBeInTheDocument()
  })

  it("calls onDelete with the asset id once the delete is confirmed", async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn()
    renderWithLocale(
      <Table>
        <TableBody>
          <AssetTableRow asset={ASSET} index={0} onDelete={onDelete} />
        </TableBody>
      </Table>
    )

    await user.click(screen.getByRole("button", { name: "Eliminar Production Server" }))
    await user.click(screen.getByRole("button", { name: "Eliminar" }))

    expect(onDelete).toHaveBeenCalledWith("asset-1")
  })
})
