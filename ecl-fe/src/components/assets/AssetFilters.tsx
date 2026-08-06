"use client"

import { Field } from "@base-ui/react/field"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dateToIso, formatDisplayDate, isoToDate } from "@/lib/assets/date"
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

interface DateFilterFieldProps {
  id: string
  label: string
  value: string | null
  onChange: (date: string | null) => void
}

function DateFilterField({ id, label, value, onChange }: DateFilterFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = isoToDate(value)

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={<Button id={id} variant="outline" size="sm" className="justify-start gap-1.5" />}
        >
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
          {formatDisplayDate(value) ?? "Seleccionar fecha"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected ?? new Date()}
            onSelect={(date) => {
              onChange(date ? dateToIso(date) : null)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

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

      <DateFilterField
        id="asset-date-from"
        label="Desde"
        value={criteria.dateFrom}
        onChange={onDateFromChange}
      />

      <DateFilterField
        id="asset-date-to"
        label="Hasta"
        value={criteria.dateTo}
        onChange={onDateToChange}
      />

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
