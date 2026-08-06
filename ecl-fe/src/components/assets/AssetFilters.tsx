"use client"

import { Field } from "@base-ui/react/field"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { AssetFilterCriteria, DateField, SeverityFilterValue } from "@/lib/assets/types"

interface AssetFiltersProps {
  criteria: AssetFilterCriteria
  onQueryChange: (query: string) => void
  onDateFieldChange: (field: DateField) => void
  onDateFromChange: (date: string | null) => void
  onDateToChange: (date: string | null) => void
  onSeverityChange: (severity: SeverityFilterValue) => void
  onReset: () => void
  isFiltered: boolean
}

const dateFieldSelectClassName =
  "h-7 rounded-md border border-input bg-input/20 px-2 text-xs/relaxed outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"

export function AssetFilters({
  criteria,
  onQueryChange,
  onDateFieldChange,
  onDateFromChange,
  onDateToChange,
  onSeverityChange,
  onReset,
  isFiltered,
}: AssetFiltersProps) {
  return (
    <div
      className="flex flex-wrap items-end gap-3 rounded-lg border border-border/50 bg-card/50 p-3"
      data-testid="asset-filters"
    >
      <Field.Root className="flex flex-col gap-1">
        <label htmlFor="asset-query" className="text-xs font-medium text-muted-foreground">
          Buscar
        </label>
        <Input
          id="asset-query"
          placeholder="Nombre o descripción"
          value={criteria.query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-48"
        />
      </Field.Root>

      <div className="flex flex-col gap-1">
        <label htmlFor="asset-date-field" className="text-xs font-medium text-muted-foreground">
          Fecha de
        </label>
        <select
          id="asset-date-field"
          value={criteria.dateField}
          onChange={(event) => onDateFieldChange(event.target.value as DateField)}
          className={cn(dateFieldSelectClassName)}
        >
          <option value="createdAt">Creado</option>
          <option value="lastScan">Último escaneo</option>
        </select>
      </div>

      <Field.Root className="flex flex-col gap-1">
        <label htmlFor="asset-date-from" className="text-xs font-medium text-muted-foreground">
          Desde
        </label>
        <Input
          id="asset-date-from"
          type="date"
          value={criteria.dateFrom ?? ""}
          onChange={(event) => onDateFromChange(event.target.value || null)}
        />
      </Field.Root>

      <Field.Root className="flex flex-col gap-1">
        <label htmlFor="asset-date-to" className="text-xs font-medium text-muted-foreground">
          Hasta
        </label>
        <Input
          id="asset-date-to"
          type="date"
          value={criteria.dateTo ?? ""}
          onChange={(event) => onDateToChange(event.target.value || null)}
        />
      </Field.Root>

      <div className="flex flex-col gap-1">
        <label htmlFor="asset-severity" className="text-xs font-medium text-muted-foreground">
          Severidad
        </label>
        <select
          id="asset-severity"
          value={criteria.severity}
          onChange={(event) => onSeverityChange(event.target.value as SeverityFilterValue)}
          className={cn(dateFieldSelectClassName)}
        >
          <option value="ALL">Todas</option>
          <option value="CRITICAL">Crítica</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
        </select>
      </div>

      <Button variant="outline" size="sm" onClick={onReset} disabled={!isFiltered}>
        Limpiar filtros
      </Button>
    </div>
  )
}
