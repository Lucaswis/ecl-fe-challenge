/**
 * @jest-environment node
 */
import { getAssetDetail } from "./get-asset-detail"
import { getAsset } from "./get-asset"
import { getComponent } from "./get-component"
import { getAssetVulnerabilities } from "./get-asset-vulnerabilities"

jest.mock("./get-asset")
jest.mock("./get-component")
jest.mock("./get-asset-vulnerabilities")

const mockGetAsset = getAsset as jest.MockedFunction<typeof getAsset>
const mockGetComponent = getComponent as jest.MockedFunction<typeof getComponent>
const mockGetAssetVulnerabilities = getAssetVulnerabilities as jest.MockedFunction<
  typeof getAssetVulnerabilities
>

const BASE_ASSET = {
  id: "asset-1",
  name: "Production Server",
  description: "Main backend server",
  createdAt: "2025-01-10T12:00:00Z",
  lastScan: "2025-02-01T10:00:00Z",
  components: ["component-1", "component-2"],
}

const COMPONENT_1 = {
  id: "component-1",
  name: "nginx",
  version: "1.25.3",
  vendor: "F5",
  type: "web-server",
  createdAt: "2025-01-10T12:00:00Z",
  lastScan: "2025-02-01T10:00:00Z",
  assetId: "asset-1",
}

const COMPONENT_2 = { ...COMPONENT_1, id: "component-2", name: "PostgreSQL" }

const VULNERABILITY = { id: "vuln-1", description: "OpenSSL out-of-bounds read", severity: "HIGH" as const }

describe("getAssetDetail", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("returns null when the asset does not exist", async () => {
    mockGetAsset.mockResolvedValue(null)

    const result = await getAssetDetail("asset-999")

    expect(result).toBeNull()
    expect(mockGetComponent).not.toHaveBeenCalled()
    expect(mockGetAssetVulnerabilities).not.toHaveBeenCalled()
  })

  it("returns full data when every fetch succeeds", async () => {
    mockGetAsset.mockResolvedValue(BASE_ASSET)
    mockGetComponent.mockImplementation((assetId, componentId) =>
      Promise.resolve(componentId === "component-1" ? COMPONENT_1 : COMPONENT_2)
    )
    mockGetAssetVulnerabilities.mockResolvedValue([VULNERABILITY])

    const result = await getAssetDetail("asset-1")

    expect(result).toEqual({
      asset: BASE_ASSET,
      components: [
        { id: "component-1", data: COMPONENT_1, error: false },
        { id: "component-2", data: COMPONENT_2, error: false },
      ],
      vulnerabilities: [VULNERABILITY],
    })
  })

  it("marks a rejected component as an error without affecting its siblings", async () => {
    mockGetAsset.mockResolvedValue(BASE_ASSET)
    mockGetComponent.mockImplementation((assetId, componentId) =>
      componentId === "component-2"
        ? Promise.reject(new Error("boom"))
        : Promise.resolve(COMPONENT_1)
    )
    mockGetAssetVulnerabilities.mockResolvedValue([VULNERABILITY])

    const result = await getAssetDetail("asset-1")

    expect(result?.components).toEqual([
      { id: "component-1", data: COMPONENT_1, error: false },
      { id: "component-2", data: null, error: true },
    ])
  })

  it("returns null vulnerabilities when that fetch rejects, without affecting components", async () => {
    mockGetAsset.mockResolvedValue(BASE_ASSET)
    mockGetComponent.mockImplementation((assetId, componentId) =>
      Promise.resolve(componentId === "component-1" ? COMPONENT_1 : COMPONENT_2)
    )
    mockGetAssetVulnerabilities.mockRejectedValue(new Error("boom"))

    const result = await getAssetDetail("asset-1")

    expect(result?.vulnerabilities).toBeNull()
    expect(result?.components).toEqual([
      { id: "component-1", data: COMPONENT_1, error: false },
      { id: "component-2", data: COMPONENT_2, error: false },
    ])
  })

  it("returns an empty components list when the asset has none", async () => {
    mockGetAsset.mockResolvedValue({ ...BASE_ASSET, components: [] })
    mockGetAssetVulnerabilities.mockResolvedValue([])

    const result = await getAssetDetail("asset-3")

    expect(result?.components).toEqual([])
    expect(mockGetComponent).not.toHaveBeenCalled()
  })
})
