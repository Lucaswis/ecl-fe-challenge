import { mergeAssets } from "./local-store"
import type { AssetWithSeverity, LocalAsset } from "./types"

const BASE: AssetWithSeverity[] = [
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

const CREATED: LocalAsset[] = [
  {
    id: "local-1",
    name: "Local Asset",
    description: "Created in this session",
    createdAt: "2025-03-01T00:00:00Z",
    lastScan: "2025-03-01T00:00:00Z",
    components: [],
    vulnerabilities: [],
  },
]

describe("mergeAssets", () => {
  it("returns base unchanged when there are no created or deleted assets", () => {
    expect(mergeAssets(BASE, [], new Set())).toEqual(BASE)
  })

  it("prepends created assets and filters out deleted ids from both created and base", () => {
    const result = mergeAssets(BASE, CREATED, new Set(["asset-1"]))

    expect(result.map((asset) => asset.id)).toEqual(["local-1", "asset-2"])
  })
})
