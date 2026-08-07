import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { AssetTableSkeleton } from "./AssetTableSkeleton"

describe("AssetTableSkeleton", () => {
  it("renders 10 placeholder rows by default", () => {
    renderWithLocale(<AssetTableSkeleton />)

    expect(screen.getAllByTestId("asset-table-skeleton-row")).toHaveLength(10)
  })

  it("renders the given number of placeholder rows", () => {
    renderWithLocale(<AssetTableSkeleton rows={3} />)

    expect(screen.getAllByTestId("asset-table-skeleton-row")).toHaveLength(3)
  })

  it("has a translated accessible label", () => {
    renderWithLocale(<AssetTableSkeleton />)
    expect(screen.getByLabelText("Cargando assets")).toBeInTheDocument()

    renderWithLocale(<AssetTableSkeleton />, "en")
    expect(screen.getByLabelText("Loading assets")).toBeInTheDocument()
  })

  it("spans all six table columns per placeholder row", () => {
    renderWithLocale(<AssetTableSkeleton rows={1} />)

    expect(screen.getByTestId("asset-table-skeleton-row").querySelector("td")).toHaveAttribute(
      "colSpan",
      "6"
    )
  })
})
