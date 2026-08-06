/**
 * @jest-environment node
 */
import { getAssetVulnerabilities } from "./get-asset-vulnerabilities"

const VULN_PAYLOAD = [
  {
    id: "vuln-1",
    description: "OpenSSL out-of-bounds read",
    severity: "HIGH",
  },
]

describe("getAssetVulnerabilities", () => {
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

  it("hits ${BACKEND_URL}/assets/{id}/vulnerabilities", async () => {
    process.env.BACKEND_URL = "http://example.com:9999"
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    }) as unknown as typeof fetch

    await getAssetVulnerabilities("asset-1")

    expect(global.fetch).toHaveBeenCalledWith("http://example.com:9999/assets/asset-1/vulnerabilities")
  })

  it("parses the JSON array on a 200 response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(VULN_PAYLOAD),
    }) as unknown as typeof fetch

    const result = await getAssetVulnerabilities("asset-1")

    expect(result).toEqual(VULN_PAYLOAD)
  })

  it("throws when the response is not ok (500)", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch

    await expect(getAssetVulnerabilities("asset-13")).rejects.toThrow()
  })
})
