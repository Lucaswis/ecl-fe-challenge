import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
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
    renderWithLocale(<AssetDetailHeader asset={ASSET} />)

    expect(screen.getByRole("heading", { name: "Production Server" })).toBeInTheDocument()
  })

  it("renders the description and both dates in Spanish by default", () => {
    renderWithLocale(<AssetDetailHeader asset={ASSET} />)

    expect(screen.getByText("Main backend server")).toBeInTheDocument()
    expect(screen.getByText("Creado")).toBeInTheDocument()
    expect(screen.getByText("10 de enero de 2025")).toBeInTheDocument()
    expect(screen.getByText("Último escaneo")).toBeInTheDocument()
    expect(screen.getByText("1 de febrero de 2025")).toBeInTheDocument()
  })

  it("translates the date labels and formats dates in English", () => {
    renderWithLocale(<AssetDetailHeader asset={ASSET} />, "en")

    expect(screen.getByText("Created")).toBeInTheDocument()
    expect(screen.getByText("January 10, 2025")).toBeInTheDocument()
    expect(screen.getByText("Last scan")).toBeInTheDocument()
    expect(screen.getByText("February 1, 2025")).toBeInTheDocument()
  })
})
