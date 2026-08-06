import { test, expect } from "@playwright/test"

test.describe("asset detail view", () => {
  test("renders base info, components and vulnerabilities for asset-1", async ({ page }) => {
    await page.goto("/assets/asset-1")

    await expect(page.getByRole("heading", { name: "Production Server" })).toBeVisible()
    await expect(page.getByText("Main backend server")).toBeVisible()

    await expect(page.getByRole("button", { name: "nginx" })).toBeVisible()
    await expect(page.getByRole("button", { name: "PostgreSQL" })).toBeVisible()
    await expect(page.getByText("1.21.6")).toBeVisible()
    await expect(page.getByText("14.2")).toBeVisible()

    await expect(page.getByText("OpenSSL out-of-bounds read")).toBeVisible()
    await expect(page.getByText("Weak SSH configuration")).toBeVisible()
    await expect(page.getByText("HIGH", { exact: true })).toBeVisible()
    await expect(page.getByText("MEDIUM", { exact: true })).toBeVisible()
  })

  test("shows an empty-components state and a vulnerabilities-unavailable notice for asset-13, without crashing", async ({
    page,
  }) => {
    await page.goto("/assets/asset-13")

    await expect(page.getByRole("heading", { name: "Vulnerability Scanner Node" })).toBeVisible()
    await expect(page.getByText(/no tiene componentes/i)).toBeVisible()
    await expect(page.getByText(/no disponible/i)).toBeVisible()
  })

  test("shows the not-found page for an asset id that doesn't exist", async ({ page }) => {
    await page.goto("/assets/asset-999")

    await expect(page.getByText("No encontramos este asset")).toBeVisible()
    await expect(page.getByRole("link", { name: "Volver al listado" })).toBeVisible()
  })

  test("navigating from the listing lands on a fully rendered detail page", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("link", { name: "Production Server" }).click()

    await expect(page).toHaveURL(/\/assets\/asset-1$/)
    await expect(page.getByRole("heading", { name: "Production Server" })).toBeVisible()
    await expect(page.getByRole("button", { name: "nginx" })).toBeVisible()
  })
})
