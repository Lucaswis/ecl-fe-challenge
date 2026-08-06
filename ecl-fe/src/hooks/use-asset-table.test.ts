import { act, renderHook } from "@testing-library/react"
import { useAssetTable } from "./use-asset-table"
import type { AssetWithSeverity } from "@/lib/assets/types"

const ASSETS: AssetWithSeverity[] = [
  {
    id: "asset-1",
    name: "Production Server",
    description: "Main backend server",
    createdAt: "2025-01-10T12:00:00Z",
    lastScan: "2025-02-01T10:00:00Z",
    highestSeverity: "HIGH",
    vulnerabilityCount: 2,
  },
  {
    id: "asset-2",
    name: "Frontend Cluster",
    description: "Cluster for web apps",
    createdAt: "2025-01-20T08:30:00Z",
    lastScan: "2025-02-02T09:30:00Z",
    highestSeverity: "CRITICAL",
    vulnerabilityCount: 1,
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

  it("narrows visibleAssets when setSeverity is called with a real value", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS))

    act(() => result.current.setSeverity("CRITICAL"))

    expect(result.current.visibleAssets.map((a) => a.id)).toEqual(["asset-2"])
    expect(result.current.isFiltered).toBe(true)
  })

  it("resetFilters restores the default criteria, including severity", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS))

    act(() => result.current.setSeverity("HIGH"))
    expect(result.current.isFiltered).toBe(true)

    act(() => result.current.resetFilters())

    expect(result.current.isFiltered).toBe(false)
    expect(result.current.visibleAssets).toEqual(ASSETS)
    expect(result.current.criteria.query).toBe("")
    expect(result.current.criteria.severity).toBe("ALL")
  })

  it("never calls fetch — it only derives from the assets it is given", () => {
    const fetchSpy = jest.fn()
    const originalFetch = global.fetch
    global.fetch = fetchSpy as unknown as typeof fetch

    renderHook(() => useAssetTable(ASSETS))

    expect(fetchSpy).not.toHaveBeenCalled()

    global.fetch = originalFetch
  })

  it("starts on page 1 and slices visibleAssets by pageSize", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS, { pageSize: 1 }))

    expect(result.current.page).toBe(1)
    expect(result.current.totalPages).toBe(2)
    expect(result.current.visibleAssets.map((a) => a.id)).toEqual(["asset-1"])
  })

  it("goToPage moves to the requested page", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS, { pageSize: 1 }))

    act(() => result.current.goToPage(2))

    expect(result.current.page).toBe(2)
    expect(result.current.visibleAssets.map((a) => a.id)).toEqual(["asset-2"])
  })

  it("nextPage and prevPage clamp to [1, totalPages]", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS, { pageSize: 1 }))

    act(() => result.current.prevPage())
    expect(result.current.page).toBe(1)

    act(() => result.current.nextPage())
    expect(result.current.page).toBe(2)

    act(() => result.current.nextPage())
    expect(result.current.page).toBe(2)
  })

  it("resets to page 1 whenever a filter setter is called", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS, { pageSize: 1 }))

    act(() => result.current.goToPage(2))
    expect(result.current.page).toBe(2)

    act(() => result.current.setQuery("frontend"))

    expect(result.current.page).toBe(1)
  })

  it("resets to page 1 when setSeverity is called", () => {
    const { result } = renderHook(() => useAssetTable(ASSETS, { pageSize: 1 }))

    act(() => result.current.goToPage(2))
    expect(result.current.page).toBe(2)

    act(() => result.current.setSeverity("HIGH"))

    expect(result.current.page).toBe(1)
  })
})
