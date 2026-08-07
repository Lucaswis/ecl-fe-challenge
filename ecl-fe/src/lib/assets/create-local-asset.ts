import type { Component, CreateAssetFormState, LocalAsset, Vulnerability } from "./types"

export function createLocalAsset(
  form: CreateAssetFormState,
  now: Date = new Date(),
  newId: () => string = () => crypto.randomUUID()
): LocalAsset {
  const timestamp = now.toISOString()
  const assetId = `local-${newId()}`

  const components: Component[] = form.components.map((draft) => ({
    id: `local-${newId()}`,
    name: draft.name,
    version: draft.version,
    vendor: draft.vendor,
    type: draft.type,
    createdAt: timestamp,
    lastScan: timestamp,
    assetId,
  }))

  const vulnerabilities: Vulnerability[] = form.vulnerabilities.map((draft) => ({
    id: `local-${newId()}`,
    description: draft.description,
    severity: draft.severity,
  }))

  return {
    id: assetId,
    name: form.name,
    description: form.description,
    createdAt: timestamp,
    lastScan: timestamp,
    components,
    vulnerabilities,
  }
}
