import { test, expect } from "@playwright/test"

test.describe("theme toggle", () => {
  test("toggles dark mode and persists it across a reload with no flash", async ({ page }) => {
    await page.goto("/")

    const html = page.locator("html")
    await expect(html).not.toHaveClass(/dark/)

    await page.getByRole("button", { name: "Cambiar tema" }).click()
    await expect(html).toHaveClass(/dark/)

    await page.reload({ waitUntil: "domcontentloaded" })
    await expect(html).toHaveClass(/dark/)
  })
})
