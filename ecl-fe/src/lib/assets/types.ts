export interface Asset {
  id: string
  name: string
  description: string
  createdAt: string
  lastScan: string
}

export type DateField = "createdAt" | "lastScan"

export interface AssetFilterCriteria {
  query: string
  dateField: DateField
  dateFrom: string | null
  dateTo: string | null
}
