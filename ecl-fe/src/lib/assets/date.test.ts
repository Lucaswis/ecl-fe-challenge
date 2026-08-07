import { dateToIso, formatDisplayDate, isoToDate } from "./date"

describe("isoToDate", () => {
  it("returns undefined for null", () => {
    expect(isoToDate(null)).toBeUndefined()
  })

  it("builds a local date that keeps the same year/month/day as the ISO string", () => {
    const date = isoToDate("2025-01-10")

    expect(date?.getFullYear()).toBe(2025)
    expect(date?.getMonth()).toBe(0)
    expect(date?.getDate()).toBe(10)
  })
})

describe("dateToIso", () => {
  it("formats a local date back to YYYY-MM-DD without shifting days", () => {
    expect(dateToIso(new Date(2025, 0, 10))).toBe("2025-01-10")
  })

  it("pads single-digit months and days", () => {
    expect(dateToIso(new Date(2025, 8, 5))).toBe("2025-09-05")
  })
})

describe("isoToDate + dateToIso round trip", () => {
  it("survives a round trip in a negative-UTC-offset timezone without shifting to the previous day", () => {
    const iso = "2025-01-10"

    expect(dateToIso(isoToDate(iso) as Date)).toBe(iso)
  })
})

describe("formatDisplayDate", () => {
  it("returns null when there is no date", () => {
    expect(formatDisplayDate(null)).toBeNull()
  })

  it("renders a readable Spanish date by default", () => {
    expect(formatDisplayDate("2025-01-10")).toBe("10 de enero de 2025")
  })

  it("renders a readable Spanish date when locale is es", () => {
    expect(formatDisplayDate("2025-09-05", "es")).toBe("5 de septiembre de 2025")
  })

  it("renders a readable English date when locale is en", () => {
    expect(formatDisplayDate("2025-09-05", "en")).toBe("September 5, 2025")
  })
})
