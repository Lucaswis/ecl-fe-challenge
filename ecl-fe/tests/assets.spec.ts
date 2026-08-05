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
})
