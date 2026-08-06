import { render, screen } from "@testing-library/react"
import { SeverityBadge } from "./SeverityBadge"

describe("SeverityBadge", () => {
  it("renders a real severity with its vulnerability count, pluralized", () => {
    render(<SeverityBadge severity="HIGH" vulnerabilityCount={2} />)

    expect(screen.getByText("HIGH · 2 vulnerabilidades")).toBeInTheDocument()
  })

  it("uses the singular form when the count is exactly 1", () => {
    render(<SeverityBadge severity="CRITICAL" vulnerabilityCount={1} />)

    expect(screen.getByText("CRITICAL · 1 vulnerabilidad")).toBeInTheDocument()
  })

  it("renders MEDIUM and LOW the same way", () => {
    render(<SeverityBadge severity="MEDIUM" vulnerabilityCount={3} />)
    expect(screen.getByText("MEDIUM · 3 vulnerabilidades")).toBeInTheDocument()

    render(<SeverityBadge severity="LOW" vulnerabilityCount={1} />)
    expect(screen.getByText("LOW · 1 vulnerabilidad")).toBeInTheDocument()
  })

  it("shows the plain 'Sin vulnerabilidades' state for NONE, with no count suffix", () => {
    render(<SeverityBadge severity="NONE" vulnerabilityCount={0} />)

    expect(screen.getByText("Sin vulnerabilidades")).toBeInTheDocument()
    expect(screen.queryByText(/vulnerabilidad(es)?$/)).toHaveTextContent("Sin vulnerabilidades")
  })

  it("shows N/D with no count suffix when severity is null", () => {
    render(<SeverityBadge severity={null} vulnerabilityCount={0} />)

    expect(screen.getByText("N/D")).toBeInTheDocument()
    expect(screen.queryByText(/vulnerabilidad/i)).not.toBeInTheDocument()
  })

  it("always renders a visible text label (WCAG 1.4.1 — never color-only)", () => {
    const { container } = render(<SeverityBadge severity="CRITICAL" vulnerabilityCount={1} />)

    expect(container.textContent).not.toBe("")
  })

  it("renders the bare severity with no count suffix when vulnerabilityCount is omitted", () => {
    render(<SeverityBadge severity="HIGH" />)

    expect(screen.getByText("HIGH")).toBeInTheDocument()
    expect(screen.queryByText(/vulnerabilidad/i)).not.toBeInTheDocument()
  })
})
