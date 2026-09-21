import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes } from "./routes";

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const route of [...routes, "/this-page-does-not-exist"]) {
  test(`${route}: renders, one h1, canonical, no axe violations`, async ({ page }) => {
    const res = await page.goto(route);
    const is404 = route === "/this-page-does-not-exist";
    expect(res?.status()).toBe(is404 ? 404 : 200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Skaylon/);
    if (!is404) {
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toMatch(new RegExp(`${route === "/" ? "/?" : route}$`));
    }

    // Let deferred motion load, then scroll through so every Reveal has fired
    // before axe inspects (hidden-then-shown content must end up visible).
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForTimeout(1500);

    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });
}

test("every Reveal ends fully visible after scrolling", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
  });
  await page.waitForTimeout(1500);
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main *")).filter((el) => {
      const s = getComputedStyle(el);
      return el.textContent?.trim() && (s.visibility === "hidden" || Number(s.opacity) < 0.99);
    }).length,
  );
  expect(hidden).toBe(0);
});
