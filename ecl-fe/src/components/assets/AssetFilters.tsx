"use client"

import { Field } from "@base-ui/react/field"
import type { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { enUS, es } from "date-fns/locale"
import { useRef, useState } from "react"

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
import { useTranslation } from "@/hooks/use-translation"
import { dateToIso, formatDisplayDate, isoToDate } from "@/lib/assets/date"
import type { AssetFilterCriteria, DateField, SeverityFilterValue } from "@/lib/assets/types"
import type { TranslationKey } from "@/lib/i18n/types"

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

const DATE_FIELD_ITEMS: { value: DateField; labelKey: TranslationKey }[] = [
  { value: "createdAt", labelKey: "filters.dateField.createdAt" },
  { value: "lastScan", labelKey: "filters.dateField.lastScan" },
]

const SEVERITY_ITEMS: { value: SeverityFilterValue; labelKey: TranslationKey }[] = [
  { value: "ALL", labelKey: "filters.severity.all" },
  { value: "CRITICAL", labelKey: "filters.severity.critical" },
  { value: "HIGH", labelKey: "filters.severity.high" },
  { value: "MEDIUM", labelKey: "filters.severity.medium" },
  { value: "LOW", labelKey: "filters.severity.low" },
]

interface DateFilterFieldProps {
  id: string
  label: string
  value: string | null
  onChange: (date: string | null) => void
  actionsRef?: React.RefObject<PopoverPrimitive.Root.Actions | null>
  onOpen?: () => void
}

function DateFilterField({
  id,
  label,
  value,
  onChange,
  actionsRef,
  onOpen,
}: DateFilterFieldProps) {
  const { t, locale } = useTranslation()
  const [open, setOpen] = useState(false)
  const selected = isoToDate(value)
  const dateFnsLocale = locale === "en" ? enUS : es

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) onOpen?.()
          setOpen(nextOpen)
        }}
        actionsRef={actionsRef}
      >
        <PopoverTrigger
          render={<Button id={id} variant="outline" size="sm" className="justify-start gap-1.5" />}
        >
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
          {formatDisplayDate(value, locale) ?? t("filters.datePlaceholder")}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            locale={dateFnsLocale}
            labels={{
              labelPrevious: () => t("filters.calendar.previousMonth"),
              labelNext: () => t("filters.calendar.nextMonth"),
              labelMonthDropdown: () => t("filters.calendar.chooseMonth"),
              labelYearDropdown: () => t("filters.calendar.chooseYear"),
            }}
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
  const { t } = useTranslation()
  const dateFromActionsRef = useRef<PopoverPrimitive.Root.Actions>(null)
  const dateToActionsRef = useRef<PopoverPrimitive.Root.Actions>(null)

  return (
    <div
      className="flex flex-wrap items-end gap-3 rounded-lg border border-border/50 bg-card/50 p-3"
      data-testid="asset-filters"
    >
      <Field.Root className="flex flex-col gap-1">
        <Field.Label className="text-xs font-medium text-muted-foreground">
          {t("filters.search")}
        </Field.Label>
        <Input
          id="asset-query"
          placeholder={t("filters.searchPlaceholder")}
          value={criteria.query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-48"
        />
      </Field.Root>

      <div className="flex flex-col gap-1">
        <label htmlFor="asset-date-field" className="text-xs font-medium text-muted-foreground">
          {t("filters.dateField.label")}
        </label>
        <Select
          items={DATE_FIELD_ITEMS.map((item) => ({ value: item.value, label: t(item.labelKey) }))}
          value={criteria.dateField}
          onValueChange={(value) => onDateFieldChange(value as DateField)}
        >
          <SelectTrigger id="asset-date-field">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_FIELD_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {t(item.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DateFilterField
        id="asset-date-from"
        label={t("filters.dateFrom.label")}
        value={criteria.dateFrom}
        onChange={onDateFromChange}
        actionsRef={dateFromActionsRef}
        onOpen={() => dateToActionsRef.current?.unmount()}
      />

      <DateFilterField
        id="asset-date-to"
        label={t("filters.dateTo.label")}
        value={criteria.dateTo}
        onChange={onDateToChange}
        actionsRef={dateToActionsRef}
        onOpen={() => dateFromActionsRef.current?.unmount()}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="asset-severity" className="text-xs font-medium text-muted-foreground">
          {t("filters.severity.label")}
        </label>
        <Select
          items={SEVERITY_ITEMS.map((item) => ({ value: item.value, label: t(item.labelKey) }))}
          value={criteria.severity}
          onValueChange={(value) => onSeverityChange(value as SeverityFilterValue)}
        >
          <SelectTrigger id="asset-severity">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEVERITY_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {t(item.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm" onClick={onReset} disabled={!isFiltered}>
        {t("filters.reset")}
      </Button>
    </div>
  )
}
