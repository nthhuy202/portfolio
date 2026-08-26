import { test, expect, type Page } from "@playwright/test";

const SECTION_IDS = ["about", "projects", "experience", "contact"];
const MOBILE_NAV_BREAKPOINT_PX = 768;

async function openMobileNavIfNeeded(page: Page) {
  const viewport = page.viewportSize();
  const isMobileNav = viewport !== null && viewport.width < MOBILE_NAV_BREAKPOINT_PX;

  if (isMobileNav) {
    await page.getByRole("button", { name: /toggle menu/i }).click();
  }
}

test("homepage renders every section", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("header")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  for (const sectionId of SECTION_IDS) {
    await expect(page.locator(`#${sectionId}`)).toBeAttached();
  }

  await expect(page.locator("footer")).toBeVisible();
});

test("primary nav scrolls to each section", async ({ page }) => {
  await page.goto("/");
  await openMobileNavIfNeeded(page);

  const nav = page.getByRole("navigation", { name: /primary/i });

  for (const sectionId of SECTION_IDS) {
    await nav.getByRole("link", { name: new RegExp(sectionId, "i") }).click();
    await expect(page.locator(`#${sectionId}`)).toBeInViewport();
    await openMobileNavIfNeeded(page);
  }
});

test("theme toggle switches the color scheme", async ({ page }) => {
  await page.goto("/");

  const html = page.locator("html");
  const initialTheme = await html.getAttribute("data-theme");

  await page.getByRole("button", { name: /toggle dark mode/i }).click();

  await expect(html).not.toHaveAttribute("data-theme", initialTheme ?? "");
});

test("loads without console errors", async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(consoleErrors).toEqual([]);
});
