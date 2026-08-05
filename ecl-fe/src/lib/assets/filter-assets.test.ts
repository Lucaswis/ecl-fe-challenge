import { filterAssets } from "./filter-assets"
import type { Asset, AssetFilterCriteria } from "./types"

const ASSETS: Asset[] = [
  {
    id: "asset-1",
    name: "Production Server",
    description: "Main backend server",
    createdAt: "2025-01-10T12:00:00Z",
    lastScan: "2025-02-01T10:00:00Z",
  },
  {
    id: "asset-2",
    name: "Frontend Cluster",
    description: "Cluster for web apps",
    createdAt: "2025-01-20T08:30:00Z",
    lastScan: "2025-02-02T09:30:00Z",
  },
  {
    id: "asset-3",
    name: "Analytics Pipeline",
    description: "Batch SERVER jobs",
    createdAt: "2025-03-05T00:00:00Z",
    lastScan: "2025-01-05T00:00:00Z",
  },
]

const BASE_CRITERIA: AssetFilterCriteria = {
  query: "",
  dateField: "createdAt",
  dateFrom: null,
  dateTo: null,
}

describe("filterAssets", () => {
  it("returns every asset when the query is empty (passthrough)", () => {
    expect(filterAssets(ASSETS, BASE_CRITERIA)).toEqual(ASSETS)
  })

  it("matches by name, case-insensitively", () => {
    const result = filterAssets(ASSETS, { ...BASE_CRITERIA, query: "production" })

    expect(result.map((a) => a.id)).toEqual(["asset-1"])
  })

  it("matches by description when the name does not match", () => {
    const result = filterAssets(ASSETS, { ...BASE_CRITERIA, query: "server" })

    expect(result.map((a) => a.id).sort()).toEqual(["asset-1", "asset-3"])
  })

  it("trims surrounding whitespace from the query", () => {
    const result = filterAssets(ASSETS, { ...BASE_CRITERIA, query: "  cluster  " })

    expect(result.map((a) => a.id)).toEqual(["asset-2"])
  })

  it("includes assets on the exact dateFrom boundary (inclusive)", () => {
    const result = filterAssets(ASSETS, { ...BASE_CRITERIA, dateFrom: "2025-01-10" })

    expect(result.map((a) => a.id).sort()).toEqual(["asset-1", "asset-2", "asset-3"])
  })

  it("includes assets on the exact dateTo boundary (inclusive)", () => {
    const result = filterAssets(ASSETS, { ...BASE_CRITERIA, dateTo: "2025-01-20" })

    expect(result.map((a) => a.id).sort()).toEqual(["asset-1", "asset-2"])
  })

  it("excludes assets outside the date range", () => {
    const result = filterAssets(ASSETS, {
      ...BASE_CRITERIA,
      dateFrom: "2025-01-15",
      dateTo: "2025-01-25",
    })

    expect(result.map((a) => a.id)).toEqual(["asset-2"])
  })

  it("switches which date field is compared based on dateField", () => {
    const result = filterAssets(ASSETS, {
      ...BASE_CRITERIA,
      dateField: "lastScan",
      dateFrom: "2025-01-01",
      dateTo: "2025-01-10",
    })

    expect(result.map((a) => a.id)).toEqual(["asset-3"])
  })

  it("combines query and date range with AND semantics", () => {
    const result = filterAssets(ASSETS, {
      ...BASE_CRITERIA,
      query: "server",
      dateTo: "2025-01-15",
    })

    expect(result.map((a) => a.id)).toEqual(["asset-1"])
  })
})
