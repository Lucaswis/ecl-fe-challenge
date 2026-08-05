"use client"

import { Button } from "@/components/ui/button"

interface AssetEmptyStateProps {
  variant: "no-data" | "no-matches"
  onReset?: () => void
}

const COPY: Record<AssetEmptyStateProps["variant"], { title: string; description: string }> = {
  "no-data": {
    title: "No hay assets registrados",
    description: "Todavía no se registraron assets en el sistema.",
  },
  "no-matches": {
    title: "Ningún asset coincide con los filtros",
    description: "Probá ajustar o limpiar los filtros activos.",
  },
}

export function AssetEmptyState({ variant, onReset }: AssetEmptyStateProps) {
  const copy = COPY[variant]

  return (
    <div
      role="status"
      data-testid="asset-empty-state"
      data-variant={variant}
      className="flex flex-col items-center justify-center gap-2 py-16 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95"
    >
      <p className="text-sm font-medium text-foreground">{copy.title}</p>
      <p className="text-sm text-muted-foreground">{copy.description}</p>
      {variant === "no-matches" && onReset ? (
        <Button variant="outline" size="sm" onClick={onReset} className="mt-2">
          Limpiar filtros
        </Button>
      ) : null}
    </div>
  )
}
