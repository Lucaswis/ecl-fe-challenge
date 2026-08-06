import { SeverityBadge } from "@/components/assets/SeverityBadge"
import { TableCell, TableRow } from "@/components/ui/table"
import type { AssetWithSeverity } from "@/lib/assets/types"

interface AssetTableRowProps {
  asset: AssetWithSeverity
  index: number
}

function formatDay(iso: string): string {
  return iso.slice(0, 10)
}

export function AssetTableRow({ asset, index }: AssetTableRowProps) {
  return (
    <TableRow
      data-testid="asset-table-row"
      className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1"
      style={{ animationDelay: `${Math.min(index, 8) * 20}ms` }}
    >
      <TableCell className="font-medium">{asset.name}</TableCell>
      <TableCell className="max-w-xs truncate text-muted-foreground">
        {asset.description}
      </TableCell>
      <TableCell>{formatDay(asset.createdAt)}</TableCell>
      <TableCell>{formatDay(asset.lastScan)}</TableCell>
      <TableCell>
        <SeverityBadge severity={asset.highestSeverity} vulnerabilityCount={asset.vulnerabilityCount} />
      </TableCell>
    </TableRow>
  )
}
