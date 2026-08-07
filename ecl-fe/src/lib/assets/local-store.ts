import type { AssetWithSeverity, LocalAsset } from "./types"

function asAssetWithSeverity(local: LocalAsset): AssetWithSeverity {
  return { ...local, highestSeverity: null, vulnerabilityCount: local.vulnerabilities.length }
}

export function mergeAssets(
  base: AssetWithSeverity[],
  created: LocalAsset[],
  deletedIds: ReadonlySet<string>
): AssetWithSeverity[] {
  return [...created.map(asAssetWithSeverity), ...base].filter((asset) => !deletedIds.has(asset.id))
}
