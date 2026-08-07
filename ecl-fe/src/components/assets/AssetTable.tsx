"use client"

import { useMemo } from "react"

import { AssetEmptyState } from "@/components/assets/AssetEmptyState"
import { AssetFilters } from "@/components/assets/AssetFilters"
import { AssetPagination } from "@/components/assets/AssetPagination"
import { AssetTableRow } from "@/components/assets/AssetTableRow"
import { useAssetStore } from "@/components/asset-store-context"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAssetTable } from "@/hooks/use-asset-table"
import { useTranslation } from "@/hooks/use-translation"
import { mergeAssets } from "@/lib/assets/local-store"
import type { AssetWithSeverity } from "@/lib/assets/types"

interface AssetTableProps {
  assets: AssetWithSeverity[]
}

export function AssetTable({ assets }: AssetTableProps) {
  const { t } = useTranslation()
  const { created, deletedIds } = useAssetStore()
  const merged = useMemo(
    () => mergeAssets(assets, created, deletedIds),
    [assets, created, deletedIds]
  )
  const {
    criteria,
    setQuery,
    setDateField,
    setDateFrom,
    setDateTo,
    setSeverity,
    resetFilters,
    isFiltered,
    totalCount,
    filteredCount,
    visibleAssets,
    page,
    totalPages,
    nextPage,
    prevPage,
  } = useAssetTable(merged)

  return (
    <div className="flex flex-col gap-4">
      <AssetFilters
        criteria={criteria}
        onQueryChange={setQuery}
        onDateFieldChange={setDateField}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSeverityChange={setSeverity}
        onReset={resetFilters}
        isFiltered={isFiltered}
      />

      {totalCount === 0 ? (
        <AssetEmptyState variant="no-data" />
      ) : filteredCount === 0 ? (
        <AssetEmptyState variant="no-matches" onReset={resetFilters} />
      ) : (
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-56">{t("table.columns.name")}</TableHead>
              <TableHead className="w-72">{t("table.columns.description")}</TableHead>
              <TableHead className="w-28">{t("filters.dateField.createdAt")}</TableHead>
              <TableHead className="w-36">{t("filters.dateField.lastScan")}</TableHead>
              <TableHead className="w-52">{t("table.columns.severity")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleAssets.map((asset, index) => (
              <AssetTableRow key={asset.id} asset={asset} index={index} />
            ))}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 ? (
        <AssetPagination page={page} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} />
      ) : null}
    </div>
  )
}
