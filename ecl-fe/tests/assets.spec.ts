import { test, expect } from "@playwright/test"

test.describe("asset dashboard — listing, filtering and pagination", () => {
  test("lists the first page and navigates to the second", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByTestId("asset-table-row")).toHaveCount(10)
    await expect(page.getByText("Página 1 de 2")).toBeVisible()

    await page.getByRole("button", { name: "Siguiente" }).click()

    await expect(page.getByTestId("asset-table-row")).toHaveCount(3)
    await expect(page.getByText("Página 2 de 2")).toBeVisible()
  })

  test("narrows results with the text filter", async ({ page }) => {
    await page.goto("/")

    await page.getByLabel("Buscar").fill("server")

    await expect(page.getByTestId("asset-table-row")).toHaveCount(3)
    await expect(page.getByText("Production Server")).toBeVisible()
    await expect(page.getByText("Staging Server")).toBeVisible()
    await expect(page.getByText("Analytics Pipeline")).toBeVisible()
  })

  test("narrows results with a date range", async ({ page }) => {
    await page.goto("/")

    await page.getByLabel("Desde").fill("2025-01-01")
    await page.getByLabel("Hasta").fill("2025-01-31")

    await expect(page.getByTestId("asset-table-row")).toHaveCount(5)
  })

  test("shows the no-matches empty state and Limpiar filtros restores the list", async ({
    page,
  }) => {
    await page.goto("/")

    await page.getByLabel("Buscar").fill("this-does-not-exist")

    await expect(page.getByText("Ningún asset coincide con los filtros")).toBeVisible()

    await page
      .getByTestId("asset-empty-state")
      .getByRole("button", { name: "Limpiar filtros" })
      .click()

    await expect(page.getByTestId("asset-table-row")).toHaveCount(10)
  })

  test("narrows results with the severity filter", async ({ page }) => {
    await page.goto("/")

    await page.getByLabel("Severidad").selectOption("CRITICAL")

    await expect(page.getByTestId("asset-table-row")).toHaveCount(3)
  })

  test("severity dropdown only offers real severity values, never Sin vulnerabilidades or N/D", async ({
    page,
  }) => {
    await page.goto("/")

    const options = await page.getByLabel("Severidad").locator("option").allTextContents()

    expect(options).toEqual(["Todas", "Crítica", "Alta", "Media", "Baja"])
  })

  test("an asset whose vulnerabilities fetch fails shows N/D and is never reachable via the severity filter", async ({
    page,
  }) => {
    await page.goto("/")

    await page.getByLabel("Buscar").fill("Scanner Node")

    await expect(page.getByTestId("asset-table-row")).toHaveCount(1)
    await expect(page.getByText("N/D")).toBeVisible()

    for (const value of ["CRITICAL", "HIGH", "MEDIUM", "LOW"]) {
      await page.getByLabel("Severidad").selectOption(value)
      await expect(page.getByTestId("asset-table-row")).toHaveCount(0)
    }
  })

  test("the listing badge shows the vulnerability count alongside the severity", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByText("HIGH · 2 vulnerabilidades")).toBeVisible()
  })
})
