import { DICTIONARIES, resolveLocale } from "./dictionaries"

describe("resolveLocale", () => {
  it("passes through known locales", () => {
    expect(resolveLocale("es")).toBe("es")
    expect(resolveLocale("en")).toBe("en")
  })

  it("falls back to the default locale for unknown or missing values", () => {
    expect(resolveLocale(undefined)).toBe("es")
    expect(resolveLocale("")).toBe("es")
    expect(resolveLocale("fr")).toBe("es")
    expect(resolveLocale("EN")).toBe("es")
  })
})

describe("DICTIONARIES", () => {
  it("exposes the same keys for every locale", () => {
    expect(Object.keys(DICTIONARIES.en).sort()).toEqual(Object.keys(DICTIONARIES.es).sort())
  })
})
