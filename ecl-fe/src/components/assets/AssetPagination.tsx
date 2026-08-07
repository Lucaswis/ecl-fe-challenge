"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

interface AssetPaginationProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function AssetPagination({ page, totalPages, onPrev, onNext }: AssetPaginationProps) {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t("pagination.label")}
      className="flex items-center justify-between gap-2 text-xs text-muted-foreground"
    >
      <span>{t("pagination.pageOfTotal", { page: String(page), totalPages: String(totalPages) })}</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={page <= 1}>
          {t("pagination.previous")}
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} disabled={page >= totalPages}>
          {t("pagination.next")}
        </Button>
      </div>
    </nav>
  )
}
