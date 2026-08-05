import { localeCookieString } from "./locale-cookie"

describe("localeCookieString", () => {
  it("builds the exact cookie string for es", () => {
    expect(localeCookieString("es")).toBe("locale=es; path=/; max-age=31536000; samesite=lax")
  })

  it("builds the exact cookie string for en", () => {
    expect(localeCookieString("en")).toBe("locale=en; path=/; max-age=31536000; samesite=lax")
  })

  it("never marks the cookie httpOnly or secure", () => {
    const cookie = localeCookieString("es").toLowerCase()

    expect(cookie).not.toContain("httponly")
    expect(cookie).not.toContain("secure")
  })
})
