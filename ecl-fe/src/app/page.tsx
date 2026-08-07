import { AssetsPageHeading } from "@/components/assets/AssetsPageHeading"
import { AssetTable } from "@/components/assets/AssetTable"
import { getAssetsWithSeverity } from "@/lib/assets/get-assets-with-severity"

export default async function Home() {
  const assets = await getAssetsWithSeverity()

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <AssetsPageHeading />
      <AssetTable assets={assets} />
    </div>
  )
}
