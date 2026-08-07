import { screen } from "@testing-library/react"

import { renderWithLocale } from "@/test-utils/render-with-locale"
import { SeverityBadge } from "./SeverityBadge"

describe("SeverityBadge", () => {
  it("renders a real severity with its vulnerability count, pluralized", () => {
    renderWithLocale(<SeverityBadge severity="HIGH" vulnerabilityCount={2} />)

    expect(screen.getByText("HIGH · 2 vulnerabilidades")).toBeInTheDocument()
  })

  it("uses the singular form when the count is exactly 1", () => {
    renderWithLocale(<SeverityBadge severity="CRITICAL" vulnerabilityCount={1} />)

    expect(screen.getByText("CRITICAL · 1 vulnerabilidad")).toBeInTheDocument()
  })

  it("renders MEDIUM and LOW the same way", () => {
    renderWithLocale(<SeverityBadge severity="MEDIUM" vulnerabilityCount={3} />)
    expect(screen.getByText("MEDIUM · 3 vulnerabilidades")).toBeInTheDocument()

    renderWithLocale(<SeverityBadge severity="LOW" vulnerabilityCount={1} />)
    expect(screen.getByText("LOW · 1 vulnerabilidad")).toBeInTheDocument()
  })

  it("shows the plain 'Sin vulnerabilidades' state for NONE, with no count suffix", () => {
    renderWithLocale(<SeverityBadge severity="NONE" vulnerabilityCount={0} />)

    expect(screen.getByText("Sin vulnerabilidades")).toBeInTheDocument()
    expect(screen.queryByText(/vulnerabilidad(es)?$/)).toHaveTextContent("Sin vulnerabilidades")
  })

  it("shows N/D with no count suffix when severity is null", () => {
    renderWithLocale(<SeverityBadge severity={null} vulnerabilityCount={0} />)

    expect(screen.getByText("N/D")).toBeInTheDocument()
    expect(screen.queryByText(/vulnerabilidad/i)).not.toBeInTheDocument()
  })

  it("always renders a visible text label (WCAG 1.4.1 — never color-only)", () => {
    const { container } = renderWithLocale(<SeverityBadge severity="CRITICAL" vulnerabilityCount={1} />)

    expect(container.textContent).not.toBe("")
  })

  it("renders the bare severity with no count suffix when vulnerabilityCount is omitted", () => {
    renderWithLocale(<SeverityBadge severity="HIGH" />)

    expect(screen.getByText("HIGH")).toBeInTheDocument()
    expect(screen.queryByText(/vulnerabilidad/i)).not.toBeInTheDocument()
  })

  it("renders translated copy in English", () => {
    renderWithLocale(<SeverityBadge severity="HIGH" vulnerabilityCount={2} />, "en")
    expect(screen.getByText("HIGH · 2 vulnerabilities")).toBeInTheDocument()

    renderWithLocale(<SeverityBadge severity="NONE" vulnerabilityCount={0} />, "en")
    expect(screen.getByText("No vulnerabilities")).toBeInTheDocument()

    renderWithLocale(<SeverityBadge severity={null} vulnerabilityCount={0} />, "en")
    expect(screen.getByText("N/A")).toBeInTheDocument()
  })
})
