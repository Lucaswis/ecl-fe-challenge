import { getBackendUrl } from "./backend"
import type { Vulnerability } from "./types"

export async function getAssetVulnerabilities(id: string): Promise<Vulnerability[]> {
  const res = await fetch(`${getBackendUrl()}/assets/${id}/vulnerabilities`)

  if (!res.ok) {
    throw new Error(`Failed to fetch vulnerabilities for ${id}: ${res.status}`)
  }

  return res.json()
}
