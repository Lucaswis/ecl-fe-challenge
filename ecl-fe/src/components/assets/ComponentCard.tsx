import type { ComponentResult } from "@/lib/assets/types"

interface ComponentCardProps {
  result: ComponentResult
}

export function ComponentCard({ result }: ComponentCardProps) {
  if (result.error || !result.data) {
    return (
      <div className="text-sm">
        <p className="font-medium text-foreground">{result.id}</p>
        <p className="text-muted-foreground">Componente no disponible</p>
      </div>
    )
  }

  const { name, version, vendor } = result.data

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
      <dt className="text-muted-foreground">Nombre</dt>
      <dd className="font-medium text-foreground">{name}</dd>
      <dt className="text-muted-foreground">Versión</dt>
      <dd>{version}</dd>
      <dt className="text-muted-foreground">Proveedor</dt>
      <dd>{vendor}</dd>
    </dl>
  )
}
