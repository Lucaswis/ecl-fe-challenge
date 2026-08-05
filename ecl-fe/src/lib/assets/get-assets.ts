import { getBackendUrl } from "./backend"
import type { Asset } from "./types"

export async function getAssets(): Promise<Asset[]> {
  const res = await fetch(`${getBackendUrl()}/assets`)

  if (!res.ok) {
    throw new Error(`Failed to fetch assets: ${res.status}`)
  }

  return res.json()
}
