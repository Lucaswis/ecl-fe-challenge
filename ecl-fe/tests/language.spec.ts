import { test, expect } from "@playwright/test"

test.describe("language toggle", () => {
  test("switches locale, updates html[lang], persists across reload, no flash", async ({ page }) => {
    await page.goto("/")

    const html = page.locator("html")
    await expect(html).toHaveAttribute("lang", "es")

    await page.getByRole("button", { name: "Cambiar a EN" }).click()
    await expect(html).toHaveAttribute("lang", "en")
    await expect(page.getByRole("button", { name: "Switch to ES" })).toBeVisible()

    await page.reload({ waitUntil: "domcontentloaded" })
    await expect(html).toHaveAttribute("lang", "en")
  })

  test("keeps unrelated client state after toggling (router.refresh, not a full reload)", async ({
    page,
  }) => {
    await page.goto("/")

    await page.getByLabel("Buscar").fill("server")
    await expect(page.getByTestId("asset-table-row")).toHaveCount(3)

    await page.getByRole("button", { name: "Cambiar a EN" }).click()
    await expect(page.locator("html")).toHaveAttribute("lang", "en")

    await expect(page.getByLabel("Buscar")).toHaveValue("server")
    await expect(page.getByTestId("asset-table-row")).toHaveCount(3)
  })
})
