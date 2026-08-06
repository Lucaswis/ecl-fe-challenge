import { render, screen } from "@testing-library/react"
import { ComponentCard } from "./ComponentCard"
import type { ComponentResult } from "@/lib/assets/types"

describe("ComponentCard", () => {
  it("shows an unavailable notice with the component id when the fetch failed", () => {
    const result: ComponentResult = { id: "component-2", data: null, error: true }

    render(<ComponentCard result={result} />)

    expect(screen.getByText("component-2")).toBeInTheDocument()
    expect(screen.getByText(/no disponible/i)).toBeInTheDocument()
  })

  it("renders name, version and vendor when the fetch succeeded", () => {
    const result: ComponentResult = {
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

    render(<ComponentCard result={result} />)

    expect(screen.getByText("nginx")).toBeInTheDocument()
    expect(screen.getByText("1.25.3")).toBeInTheDocument()
    expect(screen.getByText("F5")).toBeInTheDocument()
  })
})
