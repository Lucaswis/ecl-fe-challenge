import { AssetDetailHeader } from "@/components/assets/AssetDetailHeader"
import { AssetDetailSection } from "@/components/assets/AssetDetailSection"
import { BackToListingLink } from "@/components/assets/BackToListingLink"
import { ComponentAccordion } from "@/components/assets/ComponentAccordion"
import { VulnerabilityList } from "@/components/assets/VulnerabilityList"
import type { AssetDetailView } from "@/lib/assets/types"

interface AssetDetailContentProps {
  detail: AssetDetailView
}

export function AssetDetailContent({ detail }: AssetDetailContentProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <BackToListingLink />
      <AssetDetailHeader asset={detail.asset} />

      <AssetDetailSection titleKey="assetDetail.componentsHeading">
        <ComponentAccordion results={detail.components} />
      </AssetDetailSection>

      <AssetDetailSection titleKey="assetDetail.vulnerabilitiesHeading">
        <VulnerabilityList vulnerabilities={detail.vulnerabilities} />
      </AssetDetailSection>
    </div>
  )
}
