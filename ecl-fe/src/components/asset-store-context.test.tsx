import { renderHook } from "@testing-library/react"

import { useAssetStore } from "./asset-store-context"

describe("useAssetStore", () => {
  it("throws when used outside an AssetStoreProvider", () => {
    expect(() => renderHook(() => useAssetStore())).toThrow(
      "useAssetStore must be used within an AssetStoreProvider"
    )
  })
})
