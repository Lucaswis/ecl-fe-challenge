import type { Asset, AssetFilterCriteria } from "./types"

export function filterAssets(assets: Asset[], criteria: AssetFilterCriteria): Asset[] {
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

    return true
  })
}
