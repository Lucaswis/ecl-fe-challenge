import { AssetDetailContent } from "@/components/assets/AssetDetailContent"
import { LocalAssetDetailFallback } from "@/components/assets/LocalAssetDetailFallback"
import { getAssetDetail } from "@/lib/assets/get-asset-detail"

interface AssetDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { id } = await params
  const detail = await getAssetDetail(id)

  if (detail === null) {
    return <LocalAssetDetailFallback id={id} />
  }

  return <AssetDetailContent detail={detail} />
}
