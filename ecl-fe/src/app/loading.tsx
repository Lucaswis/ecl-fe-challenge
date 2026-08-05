import { AssetTableSkeleton } from "@/components/assets/AssetTableSkeleton"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">Assets</h1>
        <p className="text-sm text-muted-foreground">
          Listado de assets registrados, con filtros por nombre, descripción y fecha.
        </p>
      </header>
      <AssetTableSkeleton rows={10} />
    </div>
  )
}
