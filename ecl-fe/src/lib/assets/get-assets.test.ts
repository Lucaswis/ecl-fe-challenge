/**
 * @jest-environment node
 */
import { getAssets } from "./get-assets"

const ASSET_PAYLOAD = [
  {
    id: "asset-1",
    name: "Production Server",
    description: "Main backend server",
    createdAt: "2025-01-10T12:00:00Z",
    lastScan: "2025-02-01T10:00:00Z",
  },
]

describe("getAssets", () => {
  const originalFetch = global.fetch
  const originalBackendUrl = process.env.BACKEND_URL

  afterEach(() => {
    global.fetch = originalFetch
    if (originalBackendUrl === undefined) {
      delete process.env.BACKEND_URL
    } else {
      process.env.BACKEND_URL = originalBackendUrl
    }
  })

  it("parses the JSON array on a 200 response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(ASSET_PAYLOAD),
    }) as unknown as typeof fetch

    const result = await getAssets()

    expect(result).toEqual(ASSET_PAYLOAD)
  })

  it("hits ${BACKEND_URL}/assets", async () => {
    process.env.BACKEND_URL = "http://example.com:9999"
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    }) as unknown as typeof fetch

    await getAssets()

    expect(global.fetch).toHaveBeenCalledWith("http://example.com:9999/assets")
  })

  it("throws when the response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch

    await expect(getAssets()).rejects.toThrow()
  })

  it("throws when the network request rejects", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network error")) as unknown as typeof fetch

    await expect(getAssets()).rejects.toThrow("network error")
  })
})
