import { useMemo, useState } from "react"

import { filterAssets } from "@/lib/assets/filter-assets"
import { paginate, totalPagesOf } from "@/lib/assets/paginate"
import type {
  AssetFilterCriteria,
  AssetWithSeverity,
  DateField,
  SeverityFilterValue,
} from "@/lib/assets/types"

const DEFAULT_CRITERIA: AssetFilterCriteria = {
  query: "",
  dateField: "createdAt",
  dateFrom: null,
  dateTo: null,
  severity: "ALL",
}

interface UseAssetTableOptions {
  pageSize?: number
}

export function useAssetTable(
  assets: AssetWithSeverity[],
  { pageSize = 10 }: UseAssetTableOptions = {}
) {
  const [criteria, setCriteria] = useState<AssetFilterCriteria>(DEFAULT_CRITERIA)
  const [page, setPage] = useState(1)

  const setQuery = (query: string) => {
    setCriteria((prev) => ({ ...prev, query }))
    setPage(1)
  }
  const setDateField = (dateField: DateField) => {
    setCriteria((prev) => ({ ...prev, dateField }))
    setPage(1)
  }
  const setDateFrom = (dateFrom: string | null) => {
    setCriteria((prev) => ({ ...prev, dateFrom }))
    setPage(1)
  }
  const setDateTo = (dateTo: string | null) => {
    setCriteria((prev) => ({ ...prev, dateTo }))
    setPage(1)
  }
  const setSeverity = (severity: SeverityFilterValue) => {
    setCriteria((prev) => ({ ...prev, severity }))
    setPage(1)
  }
  const resetFilters = () => {
    setCriteria(DEFAULT_CRITERIA)
    setPage(1)
  }

  const isFiltered =
    criteria.query !== DEFAULT_CRITERIA.query ||
    criteria.dateField !== DEFAULT_CRITERIA.dateField ||
    criteria.dateFrom !== DEFAULT_CRITERIA.dateFrom ||
    criteria.dateTo !== DEFAULT_CRITERIA.dateTo ||
    criteria.severity !== DEFAULT_CRITERIA.severity

  const filteredAssets = useMemo(() => filterAssets(assets, criteria), [assets, criteria])
  const totalPages = totalPagesOf(filteredAssets.length, pageSize)
  const safePage = Math.min(page, totalPages)
  const visibleAssets = useMemo(
    () => paginate(filteredAssets, safePage, pageSize),
    [filteredAssets, safePage, pageSize]
  )

  const goToPage = (target: number) => setPage(Math.min(Math.max(target, 1), totalPages))
  const nextPage = () => goToPage(safePage + 1)
  const prevPage = () => goToPage(safePage - 1)

  return {
    criteria,
    setQuery,
    setDateField,
    setDateFrom,
    setDateTo,
    setSeverity,
    resetFilters,
    isFiltered,
    totalCount: assets.length,
    filteredCount: filteredAssets.length,
    visibleAssets,
    page: safePage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  }
}
