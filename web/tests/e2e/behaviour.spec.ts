import { expect, test } from "@playwright/test";
import { SUPPRESS_POPUP } from "./routes";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(SUPPRESS_POPUP);
});

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

test("logo links to the home page", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("banner").getByRole("link", { name: "Skaylon home" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("desktop nav marks the current page", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav hidden on mobile");
  await page.goto("/process");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Process" })).toHaveAttribute("aria-current", "page");
});

test("services menu opens on hover and lists every service with a description", async ({ page, isMobile }) => {
  test.skip(isMobile, "hover menu is desktop only");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  const trigger = nav.getByRole("button", { name: "Show services menu" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await nav.getByRole("link", { name: "Services", exact: true }).hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  for (const name of ["Websites", "Web Applications", "Mobile Apps", "Custom Software", "UI/UX Design", "Backend and API Systems"]) {
    await expect(nav.getByRole("link", { name: new RegExp(`^${name.replace("/", "\\/")}`) })).toBeVisible();
  }
  await nav.getByRole("link", { name: /^Mobile Apps/ }).click();
  await expect(page).toHaveURL(/\/services\/mobile-app-development$/);
  await expect(page.locator("h1")).toContainText("Mobile app development");
});

test("clicking Services in the nav opens the services page", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav");
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services", exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator("h1")).toContainText("Software development services");
});

test("services menu is fully keyboard operable and closes on Escape", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop menu");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  const trigger = nav.getByRole("button", { name: "Show services menu" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: /^Websites/ })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(nav.getByRole("link", { name: /^Web Applications/ })).toBeFocused();
  await page.keyboard.press("End");
  await expect(nav.getByRole("link", { name: /Not sure which you need/ })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();

  // Enter toggles it too, and tabbing away closes it.
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await nav.getByRole("link", { name: "Process" }).focus();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("mobile menu: modal dialog, services accordion, Escape closes, links navigate", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();

  const services = dialog.getByRole("button", { name: "Services" });
  await expect(services).toHaveAttribute("aria-expanded", "false");
  await expect(dialog.getByRole("link", { name: /^Mobile Apps/ })).toBeHidden();
  await services.click();
  await expect(services).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("link", { name: /^Mobile Apps/ })).toBeVisible();

  // Focus stays inside the modal.
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);

  // No horizontal overflow inside the open menu.
  expect(await dialog.evaluate((d) => d.scrollWidth - d.clientWidth)).toBeLessThanOrEqual(0);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await toggle.click();
  await dialog.getByRole("button", { name: "Services" }).click();
  await dialog.getByRole("link", { name: /^Backend and API Systems/ }).click();
  await expect(page).toHaveURL(/\/services\/backend-api-development$/);
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
});

test("sticky mobile CTA is present, and hidden on the contact page", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/services");
  const bar = page.getByRole("link", { name: "Call us" });
  await expect(bar).toBeVisible();
  await expect(bar).toHaveAttribute("href", /^tel:\+91/);
  await page.goto("/contact");
  await expect(page.getByRole("link", { name: "Call us" })).toHaveCount(0);
});

test("footer contact links use mailto: and tel:, and the year is current", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "skaylon.in@gmail.com" })).toHaveAttribute("href", "mailto:skaylon.in@gmail.com");
  await expect(footer.getByRole("link", { name: "+91 80759 15386" })).toHaveAttribute("href", "tel:+918075915386");
  await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
  for (const name of ["Privacy Policy", "Terms and Conditions", "Cookie Policy"]) {
    await expect(footer.getByRole("link", { name })).toBeVisible();
  }
});

test("reveal animations are skipped under reduced motion", async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(500);
  expect(await page.locator(".reveal-armed").count()).toBe(0);
  await page.close();
});

test("content is complete without JavaScript", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Websites, apps and custom software for growing businesses");
  await expect(page.locator("main").getByRole("link", { name: "Start a project" }).first()).toBeVisible();
  await expect(page.locator('main a[href="/services/backend-api-development"]').first()).toBeVisible();
  await expect(page.getByText("Who is Skaylon a good fit for?")).toBeVisible();
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
