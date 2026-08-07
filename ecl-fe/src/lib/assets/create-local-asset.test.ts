import { createLocalAsset } from "./create-local-asset"
import { toAssetWithSeverity } from "./local-store"
import type { CreateAssetFormState } from "./types"

const FORM: CreateAssetFormState = {
  name: "Production Server",
  description: "Main backend server",
  components: [
    { key: "c1", name: "nginx", version: "1.25", vendor: "F5", type: "web-server" },
    { key: "c2", name: "postgres", version: "16", vendor: "PostgreSQL", type: "database" },
  ],
  vulnerabilities: [],
}

describe("createLocalAsset", () => {
  it("produces a deterministic id and assetId back-references, using the injected clock and id generator", () => {
    const now = new Date("2026-08-07T12:00:00Z")
    let counter = 0
    const newId = () => `id-${++counter}`

    const asset = createLocalAsset(FORM, now, newId)

    expect(asset.id).toBe("local-id-1")
    expect(asset.createdAt).toBe(now.toISOString())
    expect(asset.lastScan).toBe(now.toISOString())
    expect(asset.components).toHaveLength(2)
    expect(asset.components[0]).toMatchObject({ id: "local-id-2", assetId: "local-id-1", name: "nginx" })
    expect(asset.components[1]).toMatchObject({ id: "local-id-3", assetId: "local-id-1", name: "postgres" })
  })

  it("feeds the existing severity ranking with no duplicated logic, for a mix of vulnerabilities", () => {
    const form: CreateAssetFormState = {
      ...FORM,
      components: [],
      vulnerabilities: [
        { key: "v1", description: "SQL injection", severity: "CRITICAL" },
        { key: "v2", description: "Outdated dependency", severity: "LOW" },
      ],
    }

    const asset = createLocalAsset(form)
    const withSeverity = toAssetWithSeverity(asset)

    expect(withSeverity.highestSeverity).toBe("CRITICAL")
    expect(withSeverity.vulnerabilityCount).toBe(2)
  })
})
