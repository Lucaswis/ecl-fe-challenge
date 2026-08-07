import type { AssetWithSeverity, LocalAsset } from "./types"

export function mergeAssets(
  base: AssetWithSeverity[],
  created: LocalAsset[],
  deletedIds: ReadonlySet<string>
): AssetWithSeverity[] {
  return base
}
