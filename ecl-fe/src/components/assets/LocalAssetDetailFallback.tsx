"use client"

import { notFound } from "next/navigation"

import { AssetDetailContent } from "@/components/assets/AssetDetailContent"
import { useAssetStore } from "@/components/asset-store-context"
import { toAssetDetailView } from "@/lib/assets/to-asset-detail-view"

interface LocalAssetDetailFallbackProps {
  id: string
}

export function LocalAssetDetailFallback({ id }: LocalAssetDetailFallbackProps) {
  const { getLocalAsset } = useAssetStore()
  const local = getLocalAsset(id)

  if (local === undefined) {
    notFound()
  }

  return <AssetDetailContent detail={toAssetDetailView(local)} />
}
