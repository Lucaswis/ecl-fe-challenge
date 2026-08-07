import { AssetsPageHeading } from "@/components/assets/AssetsPageHeading"
import { AssetTableSkeleton } from "@/components/assets/AssetTableSkeleton"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <AssetsPageHeading />
      <AssetTableSkeleton rows={10} />
    </div>
  )
}
