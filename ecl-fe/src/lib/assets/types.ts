export interface Asset {
  id: string
  name: string
  description: string
  createdAt: string
  lastScan: string
}

export type DateField = "createdAt" | "lastScan"

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export type HighestSeverity = Severity | "NONE" | null

export interface Vulnerability {
  id: string
  description: string
  severity: Severity
}

export type AssetWithSeverity = Asset & {
  highestSeverity: HighestSeverity
  vulnerabilityCount: number
}

export type SeverityFilterValue = Severity | "ALL"

export interface AssetFilterCriteria {
  query: string
  dateField: DateField
  dateFrom: string | null
  dateTo: string | null
  severity: SeverityFilterValue
}
