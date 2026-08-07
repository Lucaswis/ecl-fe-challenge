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

export interface Component {
  id: string
  name: string
  version: string
  vendor: string
  type: string
  createdAt: string
  lastScan: string
  assetId: string
}

export type AssetDetail = Asset & { components: string[] }

export interface ComponentResult {
  id: string
  data: Component | null
  error: boolean
}

export interface AssetDetailView {
  asset: AssetDetail
  components: ComponentResult[]
  vulnerabilities: Vulnerability[] | null
}

export interface LocalAsset extends Asset {
  components: Component[]
  vulnerabilities: Vulnerability[]
}

export type SeverityFilterValue = Severity | "ALL"

export interface AssetFilterCriteria {
  query: string
  dateField: DateField
  dateFrom: string | null
  dateTo: string | null
  severity: SeverityFilterValue
}
