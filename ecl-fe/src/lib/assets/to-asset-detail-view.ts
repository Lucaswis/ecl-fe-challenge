import type { AssetDetailView, LocalAsset } from "./types"

export function toAssetDetailView(local: LocalAsset): AssetDetailView {
  return {
    asset: {
      id: local.id,
      name: local.name,
      description: local.description,
      createdAt: local.createdAt,
      lastScan: local.lastScan,
      components: local.components.map((component) => component.id),
    },
    components: local.components.map((component) => ({
      id: component.id,
      data: component,
      error: false,
    })),
    vulnerabilities: local.vulnerabilities,
  }
}
