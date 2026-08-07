import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { ComponentAccordion } from "./ComponentAccordion"
import type { ComponentResult } from "@/lib/assets/types"

const RESULTS: ComponentResult[] = [
  {
    id: "component-1",
    error: false,
    data: {
      id: "component-1",
      name: "nginx",
      version: "1.25.3",
      vendor: "F5",
      type: "web-server",
      createdAt: "2025-01-10T12:00:00Z",
      lastScan: "2025-02-01T10:00:00Z",
      assetId: "asset-1",
    },
  },
  {
    id: "component-2",
    error: false,
    data: {
      id: "component-2",
      name: "PostgreSQL",
      version: "16.1",
      vendor: "PostgreSQL Global Development Group",
      type: "database",
      createdAt: "2025-01-10T12:00:00Z",
      lastScan: "2025-02-01T10:00:00Z",
      assetId: "asset-1",
    },
  },
]

describe("ComponentAccordion", () => {
  it("renders one trigger per component, all expanded by default", () => {
    renderWithLocale(<ComponentAccordion results={RESULTS} />)

    const triggers = screen.getAllByRole("button")
    expect(triggers).toHaveLength(2)
    expect(triggers.map((trigger) => trigger.textContent)).toEqual(["nginx", "PostgreSQL"])
    expect(screen.getByText("1.25.3")).toBeInTheDocument()
    expect(screen.getByText("16.1")).toBeInTheDocument()
  })

  it("shows an empty-state message and no accordion when there are no components", () => {
    renderWithLocale(<ComponentAccordion results={[]} />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    expect(screen.getByText("Este asset no tiene componentes registrados.")).toBeInTheDocument()
  })

  it("translates the empty-state message when locale is en", () => {
    renderWithLocale(<ComponentAccordion results={[]} />, "en")

    expect(screen.getByText("This asset has no registered components.")).toBeInTheDocument()
  })
})
