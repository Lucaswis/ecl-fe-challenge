import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { AssetDetailSection } from "./AssetDetailSection"

describe("AssetDetailSection", () => {
  it("renders a translated heading with the children below it", () => {
    renderWithLocale(
      <AssetDetailSection titleKey="assetDetail.componentsHeading">
        <p>content</p>
      </AssetDetailSection>
    )

    expect(screen.getByRole("heading", { name: "Componentes" })).toBeInTheDocument()
    expect(screen.getByText("content")).toBeInTheDocument()
  })

  it("translates the heading when locale is en", () => {
    renderWithLocale(
      <AssetDetailSection titleKey="assetDetail.vulnerabilitiesHeading">
        <p>content</p>
      </AssetDetailSection>,
      "en"
    )

    expect(screen.getByRole("heading", { name: "Vulnerabilities" })).toBeInTheDocument()
  })
})
