/**
 * @jest-environment node
 */
import { GET } from "./route"
import { getAssetsWithSeverity } from "../../../lib/assets/get-assets-with-severity"

jest.mock("../../../lib/assets/get-assets-with-severity")

const mockedGetAssetsWithSeverity = getAssetsWithSeverity as jest.MockedFunction<
  typeof getAssetsWithSeverity
>

describe("GET /api/assets", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("returns 200 with the aggregated asset list on success", async () => {
    const assets = [
      {
        id: "asset-1",
        name: "Production Server",
        description: "Main backend server",
        createdAt: "2025-01-10T12:00:00Z",
        lastScan: "2025-02-01T10:00:00Z",
        highestSeverity: "HIGH" as const,
        vulnerabilityCount: 2,
      },
    ]
    mockedGetAssetsWithSeverity.mockResolvedValue(assets)

    const res = await GET()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(assets)
  })

  it("returns 502 with a generic error body when aggregation throws", async () => {
    mockedGetAssetsWithSeverity.mockRejectedValue(new Error("upstream detail that must not leak"))

    const res = await GET()

    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body).toEqual({ error: "Upstream asset service unavailable" })
    expect(JSON.stringify(body)).not.toContain("upstream detail")
  })
})
