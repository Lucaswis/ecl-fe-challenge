import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { ComponentCard } from "."
import type { ComponentResult } from "@/lib/assets/types"

const COMPONENT: ComponentResult = {
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
}

describe("ComponentCard", () => {
  it("shows an unavailable notice with the component id when the fetch failed", () => {
    const result: ComponentResult = { id: "component-2", data: null, error: true }

    renderWithLocale(<ComponentCard result={result} />)

    expect(screen.getByText("component-2")).toBeInTheDocument()
    expect(screen.getByText("Componente no disponible")).toBeInTheDocument()
  })

  it("translates the unavailable notice when locale is en", () => {
    const result: ComponentResult = { id: "component-2", data: null, error: true }

    renderWithLocale(<ComponentCard result={result} />, "en")

    expect(screen.getByText("Component unavailable")).toBeInTheDocument()
  })

  it("renders name, version and vendor when the fetch succeeded", () => {
    renderWithLocale(<ComponentCard result={COMPONENT} />)

    expect(screen.getByText("Nombre")).toBeInTheDocument()
    expect(screen.getByText("nginx")).toBeInTheDocument()
    expect(screen.getByText("Versión")).toBeInTheDocument()
    expect(screen.getByText("1.25.3")).toBeInTheDocument()
    expect(screen.getByText("Proveedor")).toBeInTheDocument()
    expect(screen.getByText("F5")).toBeInTheDocument()
  })

  it("translates the field labels when locale is en", () => {
    renderWithLocale(<ComponentCard result={COMPONENT} />, "en")

    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Version")).toBeInTheDocument()
    expect(screen.getByText("Vendor")).toBeInTheDocument()
  })
})
