import type { Severity, Vulnerability } from "./types"

export const SEVERITY_RANK: Record<Severity, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
}

export function highestSeverityOf(vulnerabilities: Vulnerability[]): Severity | "NONE" {
  if (vulnerabilities.length === 0) return "NONE"

  return vulnerabilities.reduce<Severity>(
    (highest, vuln) => (SEVERITY_RANK[vuln.severity] > SEVERITY_RANK[highest] ? vuln.severity : highest),
    vulnerabilities[0].severity
  )
}
