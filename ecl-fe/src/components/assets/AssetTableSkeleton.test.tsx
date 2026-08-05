import { render, screen } from "@testing-library/react"
import { AssetTableSkeleton } from "./AssetTableSkeleton"

describe("AssetTableSkeleton", () => {
  it("renders 10 placeholder rows by default", () => {
    render(<AssetTableSkeleton />)

    expect(screen.getAllByTestId("asset-table-skeleton-row")).toHaveLength(10)
  })

  it("renders the given number of placeholder rows", () => {
    render(<AssetTableSkeleton rows={3} />)

    expect(screen.getAllByTestId("asset-table-skeleton-row")).toHaveLength(3)
  })
})
