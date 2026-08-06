import { getAssets } from "./get-assets"
import { getAssetVulnerabilities } from "./get-asset-vulnerabilities"
import { highestSeverityOf } from "./severity"
import type { AssetWithSeverity } from "./types"

export async function getAssetsWithSeverity(): Promise<AssetWithSeverity[]> {
  const assets = await getAssets()

  const results = await Promise.allSettled(assets.map((asset) => getAssetVulnerabilities(asset.id)))

  return assets.map((asset, index) => {
    const result = results[index]

    if (result.status === "rejected") {
      return { ...asset, highestSeverity: null, vulnerabilityCount: 0 }
    }

    return {
      ...asset,
      highestSeverity: highestSeverityOf(result.value),
      vulnerabilityCount: result.value.length,
    }
  })
}
