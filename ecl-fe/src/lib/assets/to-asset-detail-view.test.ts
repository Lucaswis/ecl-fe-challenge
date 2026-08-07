import { toAssetDetailView } from "./to-asset-detail-view"
import type { LocalAsset } from "./types"

const LOCAL_ASSET: LocalAsset = {
  id: "local-1",
  name: "Local Asset",
  description: "Created in this session",
  createdAt: "2025-03-01T00:00:00Z",
  lastScan: "2025-03-01T00:00:00Z",
  components: [
    {
      id: "local-comp-1",
      name: "nginx",
      version: "1.25.3",
      vendor: "F5",
      type: "web-server",
      createdAt: "2025-03-01T00:00:00Z",
      lastScan: "2025-03-01T00:00:00Z",
      assetId: "local-1",
    },
  ],
  vulnerabilities: [{ id: "local-vuln-1", description: "Weak cipher", severity: "HIGH" }],
}

describe("toAssetDetailView", () => {
  it("maps a local asset's components to ComponentResult entries with error: false", () => {
    const result = toAssetDetailView(LOCAL_ASSET)

    expect(result.components).toEqual([
      { id: "local-comp-1", data: LOCAL_ASSET.components[0], error: false },
    ])
  })

  it("carries the base asset fields plus the component ids into the asset field", () => {
    const result = toAssetDetailView(LOCAL_ASSET)

    expect(result.asset).toEqual({
      id: "local-1",
      name: "Local Asset",
      description: "Created in this session",
      createdAt: "2025-03-01T00:00:00Z",
      lastScan: "2025-03-01T00:00:00Z",
      components: ["local-comp-1"],
    })
  })

  it("passes the vulnerabilities through unchanged", () => {
    const result = toAssetDetailView(LOCAL_ASSET)

    expect(result.vulnerabilities).toEqual(LOCAL_ASSET.vulnerabilities)
  })

  it("returns empty arrays for an asset with no components or vulnerabilities", () => {
    const result = toAssetDetailView({ ...LOCAL_ASSET, components: [], vulnerabilities: [] })

    expect(result.asset.components).toEqual([])
    expect(result.components).toEqual([])
    expect(result.vulnerabilities).toEqual([])
  })
})
