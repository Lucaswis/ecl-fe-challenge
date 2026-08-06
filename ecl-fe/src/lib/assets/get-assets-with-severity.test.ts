/**
 * @jest-environment node
 */
import { getAssetsWithSeverity } from "./get-assets-with-severity"
import { getAssets } from "./get-assets"
import { getAssetVulnerabilities } from "./get-asset-vulnerabilities"
import type { Asset } from "./types"

jest.mock("./get-assets")
jest.mock("./get-asset-vulnerabilities")

const mockedGetAssets = getAssets as jest.MockedFunction<typeof getAssets>
const mockedGetAssetVulnerabilities = getAssetVulnerabilities as jest.MockedFunction<
  typeof getAssetVulnerabilities
>

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

describe("getAssetsWithSeverity", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("returns each asset enriched with its highest severity and vulnerability count", async () => {
    mockedGetAssets.mockResolvedValue(ASSETS)
    mockedGetAssetVulnerabilities.mockImplementation(async (id) =>
      id === "asset-1"
        ? [{ id: "v1", description: "d", severity: "HIGH" }, { id: "v2", description: "d", severity: "MEDIUM" }]
        : [{ id: "v3", description: "d", severity: "LOW" }]
    )

    const result = await getAssetsWithSeverity()

    expect(result[0]).toMatchObject({ id: "asset-1", highestSeverity: "HIGH", vulnerabilityCount: 2 })
    expect(result[1]).toMatchObject({ id: "asset-2", highestSeverity: "LOW", vulnerabilityCount: 1 })
  })

  it("maps an empty vulnerabilities array to NONE", async () => {
    mockedGetAssets.mockResolvedValue([ASSETS[0]])
    mockedGetAssetVulnerabilities.mockResolvedValue([])

    const result = await getAssetsWithSeverity()

    expect(result[0]).toMatchObject({ highestSeverity: "NONE", vulnerabilityCount: 0 })
  })

  it("degrades only the asset whose vulnerabilities call rejected, leaving others intact", async () => {
    mockedGetAssets.mockResolvedValue(ASSETS)
    mockedGetAssetVulnerabilities.mockImplementation(async (id) => {
      if (id === "asset-1") throw new Error("upstream 500")
      return [{ id: "v1", description: "d", severity: "CRITICAL" }]
    })

    const result = await getAssetsWithSeverity()

    expect(result[0]).toMatchObject({
      id: "asset-1",
      name: "Production Server",
      description: "Main backend server",
      highestSeverity: null,
    })
    expect(result[1]).toMatchObject({ id: "asset-2", highestSeverity: "CRITICAL", vulnerabilityCount: 1 })
  })

  it("propagates a total failure from getAssets instead of returning an empty array", async () => {
    mockedGetAssets.mockRejectedValue(new Error("upstream unreachable"))

    await expect(getAssetsWithSeverity()).rejects.toThrow("upstream unreachable")
    expect(mockedGetAssetVulnerabilities).not.toHaveBeenCalled()
  })

  it("preserves index alignment between assets and their severity fan-out", async () => {
    mockedGetAssets.mockResolvedValue(ASSETS)
    mockedGetAssetVulnerabilities.mockImplementation(async (id) => [
      { id: `v-${id}`, description: "d", severity: id === "asset-1" ? "LOW" : "CRITICAL" },
    ])

    const result = await getAssetsWithSeverity()

    expect(result.map((a) => a.id)).toEqual(["asset-1", "asset-2"])
    expect(result[0].highestSeverity).toBe("LOW")
    expect(result[1].highestSeverity).toBe("CRITICAL")
  })
})
