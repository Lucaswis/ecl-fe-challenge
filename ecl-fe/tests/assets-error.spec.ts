import { test, expect } from "@playwright/test"

test.describe("asset dashboard — backend unreachable", () => {
  test("shows the error state with a clickable retry button", async ({ page }) => {
    await page.goto("/")

    await expect(
      page.getByRole("heading", { name: "No pudimos conectar con el backend" })
    ).toBeVisible()

    const retryButton = page.getByRole("button", { name: "Reintentar" })
    await expect(retryButton).toBeVisible()
    await expect(retryButton).toBeEnabled()

    await retryButton.click()
    await expect(
      page.getByRole("heading", { name: "No pudimos conectar con el backend" })
    ).toBeVisible()
  })
})
