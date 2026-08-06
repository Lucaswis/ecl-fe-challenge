import { notFound } from "next/navigation"

import { AssetDetailHeader } from "@/components/assets/AssetDetailHeader"
import { BackToListingLink } from "@/components/assets/BackToListingLink"
import { ComponentAccordion } from "@/components/assets/ComponentAccordion"
import { VulnerabilityList } from "@/components/assets/VulnerabilityList"
import { getAssetDetail } from "@/lib/assets/get-asset-detail"

interface AssetDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { id } = await params
  const detail = await getAssetDetail(id)

  if (detail === null) {
    notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <BackToListingLink />
      <AssetDetailHeader asset={detail.asset} />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Componentes</h2>
        <ComponentAccordion results={detail.components} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Vulnerabilidades</h2>
        <VulnerabilityList vulnerabilities={detail.vulnerabilities} />
      </section>
    </div>
  )
}
