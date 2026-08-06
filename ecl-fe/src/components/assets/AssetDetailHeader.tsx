import { formatDisplayDate } from "@/lib/assets/date"
import type { AssetDetail } from "@/lib/assets/types"

interface AssetDetailHeaderProps {
  asset: AssetDetail
}

export function AssetDetailHeader({ asset }: AssetDetailHeaderProps) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold text-foreground">{asset.name}</h1>
      <p className="text-sm text-muted-foreground">{asset.description}</p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Creado</dt>
        <dd>{formatDisplayDate(asset.createdAt.slice(0, 10))}</dd>
        <dt className="text-muted-foreground">Último escaneo</dt>
        <dd>{formatDisplayDate(asset.lastScan.slice(0, 10))}</dd>
      </dl>
    </header>
  )
}
