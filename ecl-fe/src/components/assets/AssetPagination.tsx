"use client"

import { Button } from "@/components/ui/button"

interface AssetPaginationProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function AssetPagination({ page, totalPages, onPrev, onNext }: AssetPaginationProps) {
  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-between gap-2 text-xs text-muted-foreground"
    >
      <span>
        Página {page} de {totalPages}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={page <= 1}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} disabled={page >= totalPages}>
          Siguiente
        </Button>
      </div>
    </nav>
  )
}
