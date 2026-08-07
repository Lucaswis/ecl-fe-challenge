"use client"

import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/hooks/use-translation"
import type { HighestSeverity, Severity } from "@/lib/assets/types"

interface SeverityBadgeProps {
  severity: HighestSeverity
  vulnerabilityCount?: number
}

const SEVERITY_CLASSNAME: Record<Severity, string> = {
  LOW: "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  MEDIUM: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  HIGH: "border-transparent bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  CRITICAL: "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
}

export function SeverityBadge({ severity, vulnerabilityCount }: SeverityBadgeProps) {
  const { t } = useTranslation()

  if (severity === null) {
    return (
      <Badge variant="outline" className="border-dashed" title={t("severity.unavailableTitle")}>
        {t("severity.unavailable")}
      </Badge>
    )
  }

  if (severity === "NONE") {
    return (
      <Badge className="border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        {t("severity.none")}
      </Badge>
    )
  }

  const vulnerabilityLabel =
    vulnerabilityCount === undefined
      ? undefined
      : t(
          vulnerabilityCount === 1
            ? "severity.vulnerabilityCount.singular"
            : "severity.vulnerabilityCount.plural",
          { count: String(vulnerabilityCount) }
        )

  return (
    <Badge className={SEVERITY_CLASSNAME[severity]}>
      {vulnerabilityLabel === undefined ? severity : `${severity} · ${vulnerabilityLabel}`}
    </Badge>
  )
}
