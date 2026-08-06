/**
 * @jest-environment node
 */
import { getAsset } from "./get-asset"

const ASSET_PAYLOAD = {
  id: "asset-1",
  name: "Production Server",
  description: "Main backend server",
  createdAt: "2025-01-10T12:00:00Z",
  lastScan: "2025-02-01T10:00:00Z",
  components: ["component-1", "component-2"],
}

describe("getAsset", () => {
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

  it("returns null on a 404 response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch

    const result = await getAsset("asset-999")

    expect(result).toBeNull()
  })

  it("parses the JSON object on a 200 response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(ASSET_PAYLOAD),
    }) as unknown as typeof fetch

    const result = await getAsset("asset-1")

    expect(result).toEqual(ASSET_PAYLOAD)
  })

  it("hits ${BACKEND_URL}/assets/{id}", async () => {
    process.env.BACKEND_URL = "http://example.com:9999"
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(ASSET_PAYLOAD),
    }) as unknown as typeof fetch

    await getAsset("asset-1")

    expect(global.fetch).toHaveBeenCalledWith("http://example.com:9999/assets/asset-1")
  })

  it("throws when the response is a non-404 error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch

    await expect(getAsset("asset-1")).rejects.toThrow()
  })

  it("throws when the network request rejects", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network error")) as unknown as typeof fetch

    await expect(getAsset("asset-1")).rejects.toThrow("network error")
  })
})
