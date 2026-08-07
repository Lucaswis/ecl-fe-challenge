"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { useTranslation } from "@/hooks/use-translation"

interface AssetTableSkeletonProps {
  rows?: number
}

export function AssetTableSkeleton({ rows = 10 }: AssetTableSkeletonProps) {
  const { t } = useTranslation()

  return (
    <Table aria-label={t("tableSkeleton.ariaLabel")}>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index} data-testid="asset-table-skeleton-row">
            <TableCell colSpan={6}>
              <Skeleton className="h-6 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
