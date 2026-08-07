"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import type { TranslationKey } from "@/lib/i18n/types"

interface AssetEmptyStateProps {
  variant: "no-data" | "no-matches"
  onReset?: () => void
}

const COPY_KEYS: Record<AssetEmptyStateProps["variant"], { title: TranslationKey; description: TranslationKey }> = {
  "no-data": {
    title: "emptyState.noData.title",
    description: "emptyState.noData.description",
  },
  "no-matches": {
    title: "emptyState.noMatches.title",
    description: "emptyState.noMatches.description",
  },
}

export function AssetEmptyState({ variant, onReset }: AssetEmptyStateProps) {
  const { t } = useTranslation()
  const copyKeys = COPY_KEYS[variant]

  return (
    <div
      role="status"
      data-testid="asset-empty-state"
      data-variant={variant}
      className="flex flex-col items-center justify-center gap-2 py-16 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95"
    >
      <p className="text-sm font-medium text-foreground">{t(copyKeys.title)}</p>
      <p className="text-sm text-muted-foreground">{t(copyKeys.description)}</p>
      {variant === "no-matches" && onReset ? (
        <Button variant="outline" size="sm" onClick={onReset} className="mt-2">
          {t("filters.reset")}
        </Button>
      ) : null}
    </div>
  )
}
