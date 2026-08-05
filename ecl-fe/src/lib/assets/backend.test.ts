/**
 * @jest-environment node
 */
import { getBackendUrl } from "./backend"

describe("getBackendUrl", () => {
  const originalValue = process.env.BACKEND_URL

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env.BACKEND_URL
    } else {
      process.env.BACKEND_URL = originalValue
    }
  })

  it("defaults to http://localhost:8080 when BACKEND_URL is not set", () => {
    delete process.env.BACKEND_URL

    expect(getBackendUrl()).toBe("http://localhost:8080")
  })

  it("uses BACKEND_URL when it is set", () => {
    process.env.BACKEND_URL = "http://example.com:9999"

    expect(getBackendUrl()).toBe("http://example.com:9999")
  })
})
