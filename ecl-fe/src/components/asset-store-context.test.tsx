import { act, renderHook } from "@testing-library/react"

import { AssetStoreProvider, useAssetStore } from "./asset-store-context"
import type { LocalAsset } from "@/lib/assets/types"

function localAsset(id: string): LocalAsset {
  return {
    id,
    name: id,
    description: "test asset",
    createdAt: "2025-01-01T00:00:00Z",
    lastScan: "2025-01-01T00:00:00Z",
    components: [],
    vulnerabilities: [],
  }
}

describe("useAssetStore", () => {
  it("throws when used outside an AssetStoreProvider", () => {
    expect(() => renderHook(() => useAssetStore())).toThrow(
      "useAssetStore must be used within an AssetStoreProvider"
    )
  })

  it("addAsset prepends the given asset into created", () => {
    const { result } = renderHook(() => useAssetStore(), { wrapper: AssetStoreProvider })

    act(() => {
      result.current.addAsset(localAsset("local-1"))
    })

    act(() => {
      result.current.addAsset(localAsset("local-2"))
    })

    expect(result.current.created.map((asset) => asset.id)).toEqual(["local-2", "local-1"])
  })
})
