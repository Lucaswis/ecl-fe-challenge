import type { AssetFilterCriteria, AssetWithSeverity } from "./types"

export function filterAssets(
  assets: AssetWithSeverity[],
  criteria: AssetFilterCriteria
): AssetWithSeverity[] {
  const query = criteria.query.trim().toLowerCase()

  return assets.filter((asset) => {
    if (query) {
      const matchesQuery =
        asset.name.toLowerCase().includes(query) ||
        asset.description.toLowerCase().includes(query)
      if (!matchesQuery) return false
    }

    const day = asset[criteria.dateField].slice(0, 10)
    if (criteria.dateFrom && day < criteria.dateFrom) return false
    if (criteria.dateTo && day > criteria.dateTo) return false

    if (criteria.severity !== "ALL" && asset.highestSeverity !== criteria.severity) return false

    return true
  })
}
