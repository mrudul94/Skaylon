import { expect, test } from "@playwright/test";

test("skip link is the first tab stop and moves focus to main", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow checked on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("desktop nav marks the current page", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav hidden on mobile");
  await page.goto("/services/ui-ux-design");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("mobile menu opens as a modal, traps focus, closes on Escape and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  // Focus stays inside the modal.
  for (let i = 0; i < 10; i++) await page.keyboard.press("Tab");
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await toggle.click();
  await dialog.getByRole("link", { name: "Process" }).click();
  await expect(page).toHaveURL(/\/process$/);
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
});

test("smooth scrolling is on by default and off under reduced motion", async ({ browser }) => {
  const normal = await browser.newPage({ reducedMotion: "no-preference" });
  await normal.goto("/");
  await expect(normal.locator("html")).toHaveClass(/\blenis\b/, { timeout: 10_000 });
  await normal.close();

  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto("/");
  await reduced.waitForTimeout(2000);
  await expect(reduced.locator("html")).not.toHaveClass(/\blenis\b/);
  await reduced.close();
});

test("content is complete without JavaScript", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Digital flagships, engineered.");
  await expect(page.locator('[data-chapter="capabilities"] li[data-wedge]')).toHaveCount(5);
  for (const key of ["hero", "understanding", "capabilities", "proof", "process", "commitment"]) {
    await expect(page.locator(`[data-chapter="${key}"]`)).toHaveCount(1);
  }
  await ctx.close();
});

for (const [from, to] of [
  ["/proof/example", "/work/example"],
  ["/privacy-policy", "/privacy"],
  ["/terms-and-conditions", "/terms"],
]) {
  test(`legacy ${from} permanently redirects to ${to}`, async ({ request }) => {
    const res = await request.get(from!, { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(new RegExp(`${to}$`));
  });
}
