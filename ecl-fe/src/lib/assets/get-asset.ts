import { getBackendUrl } from "./backend"
import type { AssetDetail } from "./types"

export async function getAsset(id: string): Promise<AssetDetail | null> {
  const res = await fetch(`${getBackendUrl()}/assets/${id}`)

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch asset ${id}: ${res.status}`)
  }

  return res.json()
}
