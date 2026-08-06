import { highestSeverityOf } from "./severity"
import type { Vulnerability } from "./types"

function vuln(severity: Vulnerability["severity"]): Vulnerability {
  return { id: `vuln-${severity}`, description: "test", severity }
}

describe("highestSeverityOf", () => {
  it("returns NONE for an empty list", () => {
    expect(highestSeverityOf([])).toBe("NONE")
  })

  it("returns the only severity when there is a single vulnerability", () => {
    expect(highestSeverityOf([vuln("MEDIUM")])).toBe("MEDIUM")
  })

  it("picks the highest severity regardless of order", () => {
    expect(highestSeverityOf([vuln("LOW"), vuln("CRITICAL"), vuln("MEDIUM")])).toBe("CRITICAL")
    expect(highestSeverityOf([vuln("HIGH"), vuln("LOW")])).toBe("HIGH")
  })

  it("handles duplicate severities", () => {
    expect(highestSeverityOf([vuln("LOW"), vuln("LOW")])).toBe("LOW")
  })

  it("ranks all four levels correctly", () => {
    expect(highestSeverityOf([vuln("LOW"), vuln("MEDIUM"), vuln("HIGH"), vuln("CRITICAL")])).toBe(
      "CRITICAL"
    )
    expect(highestSeverityOf([vuln("LOW"), vuln("MEDIUM"), vuln("HIGH")])).toBe("HIGH")
    expect(highestSeverityOf([vuln("LOW"), vuln("MEDIUM")])).toBe("MEDIUM")
    expect(highestSeverityOf([vuln("LOW")])).toBe("LOW")
  })
})
