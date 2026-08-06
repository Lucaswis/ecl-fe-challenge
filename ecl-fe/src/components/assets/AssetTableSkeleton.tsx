import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface AssetTableSkeletonProps {
  rows?: number
}

export function AssetTableSkeleton({ rows = 10 }: AssetTableSkeletonProps) {
  return (
    <Table aria-label="Cargando assets">
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index} data-testid="asset-table-skeleton-row">
            <TableCell colSpan={5}>
              <Skeleton className="h-6 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
