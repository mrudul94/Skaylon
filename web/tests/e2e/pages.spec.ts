import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes, SUPPRESS_POPUP } from "./routes";

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(SUPPRESS_POPUP);
});

for (const route of [...routes, "/this-page-does-not-exist"]) {
  test(`${route}: renders, one h1, canonical, no axe violations`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !/challenges\.cloudflare\.com|cloudflareinsights/.test(m.text())) errors.push(m.text());
    });

    const res = await page.goto(route);
    const is404 = route === "/this-page-does-not-exist";
    // The 404 page's own document response is logged as a failed resource.
    if (is404) errors.splice(0, errors.length, ...errors.filter((e) => !/status of 404/.test(e)));
    expect(res?.status()).toBe(is404 ? 404 : 200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Skaylon/);
    if (!is404) {
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toMatch(new RegExp(`${route === "/" ? "/?" : route}$`));
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(50);
    }

    // Scroll through so every Reveal has fired before axe inspects.
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
    });
    await page.waitForTimeout(800);

    // No horizontal scrolling at any viewport.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("headings never skip a level", async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]! - levels[i - 1]!, `${route}: h${levels[i - 1]} → h${levels[i]}`).toBeLessThanOrEqual(1);
    }
  }
});

test("every internal link resolves", async ({ page, request, isMobile }) => {
  test.skip(isMobile, "links are identical on mobile");
  const seen = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    for (const href of hrefs) seen.add(href.split("#")[0]!.split("?")[0]! || "/");
  }
  for (const href of seen) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test("every Reveal ends fully visible after scrolling", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
  });
  // Poll rather than sleep: the last staggered items can still be mid-fade
  // (up to 420ms delay + 700ms transition) right after the final scroll step.
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          Array.from(document.querySelectorAll("main *")).filter((el) => {
            const s = getComputedStyle(el);
            return el.textContent?.trim() && (s.visibility === "hidden" || Number(s.opacity) < 0.99);
          }).length,
        ),
      { timeout: 10_000 },
    )
    .toBe(0);
});

test("key pages show a call to action above the fold", async ({ page }) => {
  // The hero CTA on home and service pages; elsewhere the header (desktop)
  // or the sticky bar (mobile) provides it.
  for (const route of ["/", "/services/web-application-development", "/services/backend-api-development"]) {
    await page.goto(route);
    const cta = page.locator("main").getByRole("link", { name: /start|discuss|plan|talk/i }).first();
    await expect(cta, route).toBeInViewport();
  }
  for (const route of ["/about", "/process", "/services"]) {
    await page.goto(route);
    const visible = await page.getByRole("link", { name: "Start a project" }).evaluateAll((els) =>
      els.some((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.top >= 0 && r.bottom <= window.innerHeight;
      }),
    );
    expect(visible, route).toBe(true);
  }
});
