"use client"

import { AssetEmptyState } from "@/components/assets/AssetEmptyState"
import { AssetFilters } from "@/components/assets/AssetFilters"
import { AssetPagination } from "@/components/assets/AssetPagination"
import { AssetTableRow } from "@/components/assets/AssetTableRow"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAssetTable } from "@/hooks/use-asset-table"
import type { Asset } from "@/lib/assets/types"

interface AssetTableProps {
  assets: Asset[]
}

export function AssetTable({ assets }: AssetTableProps) {
  const {
    criteria,
    setQuery,
    setDateField,
    setDateFrom,
    setDateTo,
    resetFilters,
    isFiltered,
    totalCount,
    filteredCount,
    visibleAssets,
    page,
    totalPages,
    nextPage,
    prevPage,
  } = useAssetTable(assets)

  return (
    <div className="flex flex-col gap-4">
      <AssetFilters
        criteria={criteria}
        onQueryChange={setQuery}
        onDateFieldChange={setDateField}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onReset={resetFilters}
        isFiltered={isFiltered}
      />

      {totalCount === 0 ? (
        <AssetEmptyState variant="no-data" />
      ) : filteredCount === 0 ? (
        <AssetEmptyState variant="no-matches" onReset={resetFilters} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Último escaneo</TableHead>
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
