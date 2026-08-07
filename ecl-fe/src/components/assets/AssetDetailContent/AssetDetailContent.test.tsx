import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { AssetDetailContent } from "."
import type { AssetDetailView } from "@/lib/assets/types"

const DETAIL: AssetDetailView = {
  asset: {
    id: "asset-1",
    name: "Production Server",
    description: "Main backend server",
    createdAt: "2025-04-01T00:00:00Z",
    lastScan: "2025-04-01T00:00:00Z",
    components: [],
  },
  components: [],
  vulnerabilities: [],
}

describe("AssetDetailContent", () => {
  it("renders the section headings in Spanish by default", () => {
    renderWithLocale(<AssetDetailContent detail={DETAIL} />)

    expect(screen.getByRole("heading", { name: "Componentes" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Vulnerabilidades" })).toBeInTheDocument()
  })

  it("renders the section headings in English when the locale is en", () => {
    renderWithLocale(<AssetDetailContent detail={DETAIL} />, "en")

    expect(screen.getByRole("heading", { name: "Components" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Vulnerabilities" })).toBeInTheDocument()
  })
})
