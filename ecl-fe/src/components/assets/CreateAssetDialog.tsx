"use client"

import type { FormEvent, ReactNode } from "react"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateAssetForm } from "@/hooks/use-create-asset-form"
import { useTranslation } from "@/hooks/use-translation"
import { createLocalAsset } from "@/lib/assets/create-local-asset"
import type { LocalAsset, Severity } from "@/lib/assets/types"
import type { TranslationKey } from "@/lib/i18n/types"

interface CreateAssetDialogProps {
  onCreate: (asset: LocalAsset) => void
}

const VULNERABILITY_SEVERITY_ITEMS: { value: Severity; labelKey: TranslationKey }[] = [
  { value: "LOW", labelKey: "filters.severity.low" },
  { value: "MEDIUM", labelKey: "filters.severity.medium" },
  { value: "HIGH", labelKey: "filters.severity.high" },
  { value: "CRITICAL", labelKey: "filters.severity.critical" },
]

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}

function DraftSection({
  heading,
  addLabel,
  onAdd,
  children,
}: {
  heading: string
  addLabel: string
  onAdd: () => void
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{heading}</span>
        <Button type="button" variant="outline" size="xs" className="gap-1" onClick={onAdd}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3" />
          {addLabel}
        </Button>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

export function CreateAssetDialog({ onCreate }: CreateAssetDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const form = useCreateAssetForm()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) form.reset()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onCreate(createLocalAsset(form.state))
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3.5" />
        {t("createAssetDialog.trigger")}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createAssetDialog.title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Field id="create-asset-name" label={t("table.columns.name")}>
              <Input
                id="create-asset-name"
                value={form.state.name}
                onChange={(event) => form.setField("name", event.target.value)}
                required
              />
            </Field>
            <Field id="create-asset-description" label={t("table.columns.description")}>
              <Input
                id="create-asset-description"
                value={form.state.description}
                onChange={(event) => form.setField("description", event.target.value)}
              />
            </Field>
          </div>

          <DraftSection
            heading={t("createAssetDialog.components.heading")}
            addLabel={t("createAssetDialog.components.addRow")}
            onAdd={form.addComponent}
          >
            {form.state.components.map((component) => (
              <div key={component.key} data-testid="component-draft-row" className="flex items-end gap-2">
                <Field id={`component-name-${component.key}`} label={t("table.columns.name")}>
                  <Input
                    id={`component-name-${component.key}`}
                    value={component.name}
                    onChange={(event) => form.setComponentField(component.key, "name", event.target.value)}
                  />
                </Field>
                <Field
                  id={`component-version-${component.key}`}
                  label={t("createAssetDialog.components.fields.version")}
                >
                  <Input
                    id={`component-version-${component.key}`}
                    value={component.version}
                    onChange={(event) => form.setComponentField(component.key, "version", event.target.value)}
                  />
                </Field>
                <Field
                  id={`component-vendor-${component.key}`}
                  label={t("createAssetDialog.components.fields.vendor")}
                >
                  <Input
                    id={`component-vendor-${component.key}`}
                    value={component.vendor}
                    onChange={(event) => form.setComponentField(component.key, "vendor", event.target.value)}
                  />
                </Field>
                <Field id={`component-type-${component.key}`} label={t("createAssetDialog.components.fields.type")}>
                  <Input
                    id={`component-type-${component.key}`}
                    value={component.type}
                    onChange={(event) => form.setComponentField(component.key, "type", event.target.value)}
                  />
                </Field>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("createAssetDialog.components.removeRow")}
                  onClick={() => form.removeComponent(component.key)}
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                </Button>
              </div>
            ))}
          </DraftSection>

          <DraftSection
            heading={t("createAssetDialog.vulnerabilities.heading")}
            addLabel={t("createAssetDialog.vulnerabilities.addRow")}
            onAdd={form.addVulnerability}
          >
            {form.state.vulnerabilities.map((vulnerability) => (
              <div
                key={vulnerability.key}
                data-testid="vulnerability-draft-row"
                className="flex items-end gap-2"
              >
                <Field
                  id={`vulnerability-description-${vulnerability.key}`}
                  label={t("table.columns.description")}
                >
                  <Input
                    id={`vulnerability-description-${vulnerability.key}`}
                    value={vulnerability.description}
                    onChange={(event) =>
                      form.setVulnerabilityField(vulnerability.key, "description", event.target.value)
                    }
                  />
                </Field>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`vulnerability-severity-${vulnerability.key}`}
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {t("filters.severity.label")}
                  </label>
                  <Select
                    items={VULNERABILITY_SEVERITY_ITEMS.map((item) => ({
                      value: item.value,
                      label: t(item.labelKey),
                    }))}
                    value={vulnerability.severity}
                    onValueChange={(value) =>
                      form.setVulnerabilityField(vulnerability.key, "severity", value as Severity)
                    }
                  >
                    <SelectTrigger id={`vulnerability-severity-${vulnerability.key}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VULNERABILITY_SEVERITY_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {t(item.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("createAssetDialog.vulnerabilities.removeRow")}
                  onClick={() => form.removeVulnerability(vulnerability.key)}
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                </Button>
              </div>
            ))}
          </DraftSection>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" size="sm" />}>
              {t("deleteAssetDialog.cancel")}
            </DialogClose>
            <Button type="submit" size="sm">
              {t("createAssetDialog.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
