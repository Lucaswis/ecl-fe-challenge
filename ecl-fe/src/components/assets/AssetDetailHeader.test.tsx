import { render, screen } from "@testing-library/react"
import { AssetDetailHeader } from "./AssetDetailHeader"
import type { AssetDetail } from "@/lib/assets/types"

const ASSET: AssetDetail = {
  id: "asset-1",
  name: "Production Server",
  description: "Main backend server",
  createdAt: "2025-01-10T12:00:00Z",
  lastScan: "2025-02-01T10:00:00Z",
  components: ["component-1", "component-2"],
}

describe("AssetDetailHeader", () => {
  it("renders the asset name as a heading", () => {
    render(<AssetDetailHeader asset={ASSET} />)

    expect(screen.getByRole("heading", { name: "Production Server" })).toBeInTheDocument()
  })

  it("renders the description and both dates", () => {
    render(<AssetDetailHeader asset={ASSET} />)

    expect(screen.getByText("Main backend server")).toBeInTheDocument()
    expect(screen.getByText("10 de enero de 2025")).toBeInTheDocument()
    expect(screen.getByText("1 de febrero de 2025")).toBeInTheDocument()
  })
})
