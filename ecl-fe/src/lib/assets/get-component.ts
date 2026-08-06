import { getBackendUrl } from "./backend"
import type { Component } from "./types"

export async function getComponent(assetId: string, componentId: string): Promise<Component> {
  const res = await fetch(`${getBackendUrl()}/assets/${assetId}/components/${componentId}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch component ${componentId} for asset ${assetId}: ${res.status}`)
  }

  return res.json()
}
