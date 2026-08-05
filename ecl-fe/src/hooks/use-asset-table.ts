import { useMemo, useState } from "react"

import { filterAssets } from "@/lib/assets/filter-assets"
import type { Asset, AssetFilterCriteria, DateField } from "@/lib/assets/types"

const DEFAULT_CRITERIA: AssetFilterCriteria = {
  query: "",
  dateField: "createdAt",
  dateFrom: null,
  dateTo: null,
}

export function useAssetTable(assets: Asset[]) {
  const [criteria, setCriteria] = useState<AssetFilterCriteria>(DEFAULT_CRITERIA)

  const setQuery = (query: string) => setCriteria((prev) => ({ ...prev, query }))
  const setDateField = (dateField: DateField) =>
    setCriteria((prev) => ({ ...prev, dateField }))
  const setDateFrom = (dateFrom: string | null) =>
    setCriteria((prev) => ({ ...prev, dateFrom }))
  const setDateTo = (dateTo: string | null) => setCriteria((prev) => ({ ...prev, dateTo }))
  const resetFilters = () => setCriteria(DEFAULT_CRITERIA)

  const isFiltered =
    criteria.query !== DEFAULT_CRITERIA.query ||
    criteria.dateField !== DEFAULT_CRITERIA.dateField ||
    criteria.dateFrom !== DEFAULT_CRITERIA.dateFrom ||
    criteria.dateTo !== DEFAULT_CRITERIA.dateTo

  const filteredAssets = useMemo(() => filterAssets(assets, criteria), [assets, criteria])

  return {
    criteria,
    setQuery,
    setDateField,
    setDateFrom,
    setDateTo,
    resetFilters,
    isFiltered,
    totalCount: assets.length,
    filteredCount: filteredAssets.length,
    visibleAssets: filteredAssets,
  }
}
