"use client"

import { Field } from "@base-ui/react/field"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const DATE_FIELD_ITEMS: { value: DateField; label: string }[] = [
  { value: "createdAt", label: "Creado" },
  { value: "lastScan", label: "Último escaneo" },
]

const SEVERITY_ITEMS: { value: SeverityFilterValue; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "CRITICAL", label: "Crítica" },
  { value: "HIGH", label: "Alta" },
  { value: "MEDIUM", label: "Media" },
  { value: "LOW", label: "Baja" },
]

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
        <Select
          items={DATE_FIELD_ITEMS}
          value={criteria.dateField}
          onValueChange={(value) => onDateFieldChange(value as DateField)}
        >
          <SelectTrigger id="asset-date-field">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_FIELD_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Select
          items={SEVERITY_ITEMS}
          value={criteria.severity}
          onValueChange={(value) => onSeverityChange(value as SeverityFilterValue)}
        >
          <SelectTrigger id="asset-severity">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEVERITY_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm" onClick={onReset} disabled={!isFiltered}>
        Limpiar filtros
      </Button>
    </div>
  )
}
