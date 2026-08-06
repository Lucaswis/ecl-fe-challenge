import { getAsset } from "./get-asset"
import { getComponent } from "./get-component"
import { getAssetVulnerabilities } from "./get-asset-vulnerabilities"
import type { AssetDetailView, Component, ComponentResult, Vulnerability } from "./types"

export async function getAssetDetail(id: string): Promise<AssetDetailView | null> {
  const asset = await getAsset(id)

  if (asset === null) {
    return null
  }

  const settled = await Promise.allSettled([
    ...asset.components.map((componentId) => getComponent(id, componentId)),
    getAssetVulnerabilities(id),
  ])

  const componentSettled = settled.slice(0, asset.components.length) as PromiseSettledResult<Component>[]
  const vulnerabilitiesSettled = settled[settled.length - 1] as PromiseSettledResult<Vulnerability[]>

  const components: ComponentResult[] = asset.components.map((componentId, index) => {
    const result = componentSettled[index]

    if (result.status === "rejected") {
      return { id: componentId, data: null, error: true }
    }

    return { id: componentId, data: result.value, error: false }
  })

  const vulnerabilities =
    vulnerabilitiesSettled.status === "rejected" ? null : vulnerabilitiesSettled.value

  return { asset, components, vulnerabilities }
}
