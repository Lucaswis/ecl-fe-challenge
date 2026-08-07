import { test, expect, type Page } from "@playwright/test"

const SEVERITY_LABELS: Record<string, string> = {
  CRITICAL: "Crítica",
  HIGH: "Alta",
  MEDIUM: "Media",
  LOW: "Baja",
}

async function selectSeverity(page: Page, value: keyof typeof SEVERITY_LABELS) {
  await page.getByLabel("Severidad").click()
  await page.getByRole("option", { name: SEVERITY_LABELS[value] }).click()
}

async function selectDate(page: Page, label: string, year: number, month: number, day: number) {
  await page.getByLabel(label).click()

  const grid = page.getByRole("grid")

  await page.getByRole("combobox", { name: "Elegir el mes" }).selectOption(String(month - 1))
  await page.getByRole("combobox", { name: "Elegir el año" }).selectOption(String(year))

  await grid
    .locator("td:not([data-outside]) button")
    .filter({ hasText: new RegExp(`^${day}$`) })
    .click()
}

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

    await page.getByLabel("Buscar").pressSequentially("server")

    await expect(page.getByTestId("asset-table-row")).toHaveCount(3)
    await expect(page.getByText("Production Server")).toBeVisible()
    await expect(page.getByText("Staging Server")).toBeVisible()
    await expect(page.getByText("Analytics Pipeline")).toBeVisible()
  })

  test("narrows results with a date range", async ({ page }) => {
    await page.goto("/")

    await selectDate(page, "Desde", 2025, 1, 1)
    await selectDate(page, "Hasta", 2025, 1, 31)

    await expect(page.getByTestId("asset-table-row")).toHaveCount(5)
  })

  test("shows the no-matches empty state and Limpiar filtros restores the list", async ({
    page,
  }) => {
    await page.goto("/")

    await page.getByLabel("Buscar").pressSequentially("this-does-not-exist")

    await expect(page.getByText("Ningún asset coincide con los filtros")).toBeVisible()

    await page
      .getByTestId("asset-empty-state")
      .getByRole("button", { name: "Limpiar filtros" })
      .click()

    await expect(page.getByTestId("asset-table-row")).toHaveCount(10)
  })

  test("narrows results with the severity filter", async ({ page }) => {
    await page.goto("/")

    await selectSeverity(page, "CRITICAL")

    await expect(page.getByTestId("asset-table-row")).toHaveCount(3)
  })

  test("severity dropdown only offers real severity values, never Sin vulnerabilidades or N/D", async ({
    page,
  }) => {
    await page.goto("/")

    await page.getByLabel("Severidad").click()
    const options = await page.getByRole("option").allTextContents()

    expect(options).toEqual(["Todas", "Crítica", "Alta", "Media", "Baja"])
  })

  test("an asset whose vulnerabilities fetch fails shows N/D and is never reachable via the severity filter", async ({
    page,
  }) => {
    await page.goto("/")

    await page.getByLabel("Buscar").pressSequentially("Scanner Node")

    await expect(page.getByTestId("asset-table-row")).toHaveCount(1)
    await expect(page.getByText("N/D")).toBeVisible()

    for (const value of ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const) {
      await selectSeverity(page, value)
      await expect(page.getByTestId("asset-table-row")).toHaveCount(0)
    }
  })

  test("the listing badge shows the vulnerability count alongside the severity", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByText("HIGH · 2 vulnerabilidades")).toBeVisible()
  })

  test("clicking an asset name navigates to its detail route", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("link", { name: "Production Server" }).click()

    await expect(page).toHaveURL(/\/assets\/asset-1$/)
  })

  test("deletes a row after confirming, with no page reload and no next page", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByTestId("asset-table-row")).toHaveCount(10)

    await page.getByRole("button", { name: "Eliminar Production Server" }).click()
    await expect(page.getByText("¿Eliminar asset?")).toBeVisible()

    await page.getByRole("button", { name: "Eliminar", exact: true }).click()

    await expect(page.getByRole("link", { name: "Production Server" })).not.toBeVisible()
    await expect(page.getByTestId("asset-table-row")).toHaveCount(10)
    await expect(page.getByText("Página 1 de 2")).toBeVisible()
  })

  test("canceling the delete confirmation leaves the row in place", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("button", { name: "Eliminar Production Server" }).click()
    await page.getByRole("button", { name: "Cancelar" }).click()

    await expect(page.getByRole("dialog")).not.toBeVisible()
    await expect(page.getByRole("link", { name: "Production Server" })).toBeVisible()
    await expect(page.getByTestId("asset-table-row")).toHaveCount(10)
  })

  test("opening Hasta while Desde's calendar is still open never leaves two grids mounted", async ({
    page,
  }) => {
    await page.goto("/")

    await page.getByLabel("Desde").click()
    await page.getByRole("button", { name: "Ir al mes anterior" }).click()

    // Jump straight to Hasta without picking a day in Desde first.
    await page.getByLabel("Hasta").click()

    const currentMonthCaption = new Date()
      .toLocaleString("es", { month: "long", year: "numeric" })
      .replace(" de ", " ")

    await expect(page.getByRole("grid")).toHaveCount(1)
    await expect(page.getByRole("grid")).toHaveAttribute("aria-label", currentMonthCaption)
  })
})
