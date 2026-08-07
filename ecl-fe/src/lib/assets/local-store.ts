import { highestSeverityOf } from "./severity"
import type { AssetWithSeverity, LocalAsset } from "./types"

export function toAssetWithSeverity(local: LocalAsset): AssetWithSeverity {
  return {
    id: local.id,
    name: local.name,
    description: local.description,
    createdAt: local.createdAt,
    lastScan: local.lastScan,
    highestSeverity: highestSeverityOf(local.vulnerabilities),
    vulnerabilityCount: local.vulnerabilities.length,
  }
}

export function mergeAssets(
  base: AssetWithSeverity[],
  created: LocalAsset[],
  deletedIds: ReadonlySet<string>
): AssetWithSeverity[] {
  return [...created.map(toAssetWithSeverity), ...base].filter((asset) => !deletedIds.has(asset.id))
}
