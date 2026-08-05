import { act, renderHook } from "@testing-library/react"
import { useAssetTable } from "./use-asset-table"
import type { Asset } from "@/lib/assets/types"

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
]

describe("useAssetTable", () => {
  it("starts unfiltered, showing every asset", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS))

    expect(result.current.visibleAssets).toEqual(ASSETS)
    expect(result.current.totalCount).toBe(2)
    expect(result.current.filteredCount).toBe(2)
    expect(result.current.isFiltered).toBe(false)
  })

  it("narrows visibleAssets when setQuery is called", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS))

    act(() => result.current.setQuery("frontend"))

    expect(result.current.visibleAssets.map((a) => a.id)).toEqual(["asset-2"])
    expect(result.current.filteredCount).toBe(1)
    expect(result.current.isFiltered).toBe(true)
  })

  it("narrows visibleAssets when date setters are called", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS))

    act(() => result.current.setDateFrom("2025-01-15"))

    expect(result.current.visibleAssets.map((a) => a.id)).toEqual(["asset-2"])
    expect(result.current.isFiltered).toBe(true)
  })

  it("switches the compared date field via setDateField", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS))

    act(() => {
      result.current.setDateField("lastScan")
      result.current.setDateTo("2025-02-01")
    })

    expect(result.current.visibleAssets.map((a) => a.id)).toEqual(["asset-1"])
  })

  it("resetFilters restores the default criteria", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS))

    act(() => result.current.setQuery("frontend"))
    expect(result.current.isFiltered).toBe(true)

    act(() => result.current.resetFilters())

    expect(result.current.isFiltered).toBe(false)
    expect(result.current.visibleAssets).toEqual(ASSETS)
    expect(result.current.criteria.query).toBe("")
  })

  it("never calls fetch — it only derives from the assets it is given", () => {
    const fetchSpy = jest.fn()
    const originalFetch = global.fetch
    global.fetch = fetchSpy as unknown as typeof fetch

    renderHook(() => useAssetTable(ASSETS))

    expect(fetchSpy).not.toHaveBeenCalled()

    global.fetch = originalFetch
  })
})
