"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"

import type { LocalAsset } from "@/lib/assets/types"

interface AssetStoreValue {
  created: LocalAsset[]
  deletedIds: ReadonlySet<string>
  addAsset: (asset: LocalAsset) => void
  deleteAsset: (id: string) => void
  getLocalAsset: (id: string) => LocalAsset | undefined
}

const AssetStoreContext = createContext<AssetStoreValue | null>(null)

export function AssetStoreProvider({ children }: { children: ReactNode }) {
  const [created, setCreated] = useState<LocalAsset[]>([])
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<string>>(new Set())

  const addAsset = useCallback((asset: LocalAsset) => {
    setCreated((prev) => [asset, ...prev])
  }, [])
  const deleteAsset = useCallback((id: string) => {
    setDeletedIds((prev) => new Set(prev).add(id))
  }, [])
  const getLocalAsset = useCallback(
    (id: string) => {
      if (deletedIds.has(id)) return undefined
      return created.find((asset) => asset.id === id)
    },
    [created, deletedIds]
  )

  const value = useMemo(
    () => ({ created, deletedIds, addAsset, deleteAsset, getLocalAsset }),
    [created, deletedIds, addAsset, deleteAsset, getLocalAsset]
  )

  return <AssetStoreContext.Provider value={value}>{children}</AssetStoreContext.Provider>
}

export function useAssetStore(): AssetStoreValue {
  const store = useContext(AssetStoreContext)

  if (store === null) {
    throw new Error("useAssetStore must be used within an AssetStoreProvider")
  }

  return store
}
