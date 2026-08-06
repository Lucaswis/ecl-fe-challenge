/**
 * @jest-environment node
 */
import { getComponent } from "./get-component"

const COMPONENT_PAYLOAD = {
  id: "component-1",
  name: "nginx",
  version: "1.25.3",
  vendor: "F5",
  type: "web-server",
  createdAt: "2025-01-10T12:00:00Z",
  lastScan: "2025-02-01T10:00:00Z",
  assetId: "asset-1",
}

describe("getComponent", () => {
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

  it("hits ${BACKEND_URL}/assets/{assetId}/components/{componentId}", async () => {
    process.env.BACKEND_URL = "http://example.com:9999"
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(COMPONENT_PAYLOAD),
    }) as unknown as typeof fetch

    await getComponent("asset-1", "component-1")

    expect(global.fetch).toHaveBeenCalledWith(
      "http://example.com:9999/assets/asset-1/components/component-1"
    )
  })

  it("parses the JSON object on a 200 response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(COMPONENT_PAYLOAD),
    }) as unknown as typeof fetch

    const result = await getComponent("asset-1", "component-1")

    expect(result).toEqual(COMPONENT_PAYLOAD)
  })

  it("throws when the response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch

    await expect(getComponent("asset-1", "component-1")).rejects.toThrow()
  })

  it("throws when the network request rejects", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network error")) as unknown as typeof fetch

    await expect(getComponent("asset-1", "component-1")).rejects.toThrow("network error")
  })
})
