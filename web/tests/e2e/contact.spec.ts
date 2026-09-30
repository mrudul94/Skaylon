import { expect, test, type Page } from "@playwright/test";
import { SUPPRESS_POPUP } from "./routes";

// Runs against the test build (scripts/e2e.mjs): Turnstile test keys that
// always pass, and CONTACT_DRY_RUN so nothing is emailed.
test.describe.configure({ mode: "serial" });
test.skip(({ isMobile }) => isMobile, "form flow covered on desktop; layout covered by axe on both");
test.beforeEach(async ({ page }) => {
  await page.addInitScript(SUPPRESS_POPUP);
});

async function fill(page: Page, overrides: Partial<Record<string, string>> = {}) {
  const v = {
    name: "Asha Menon",
    email: "asha@example.in",
    message: "We need a faster marketing site with a booking flow for three clinics.",
    ...overrides,
  };
  await page.getByLabel(/^Name/).fill(v.name);
  await page.getByLabel(/^Email/).fill(v.email);
  await page.getByLabel(/^Project details/).fill(v.message);
  await page.getByLabel(/may use these details/).check();
}

test("a genuine enquiry is accepted and lands on the thank-you page", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: "Send a project enquiry" })).toBeVisible();
  await fill(page);
  await page.waitForTimeout(3500); // real people take longer than the 3s bot threshold
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page).toHaveURL(/\/contact\/thank-you$/, { timeout: 20_000 });
  await expect(page.locator("h1")).toContainText("Thank you");
  expect(await page.evaluate(() => localStorage.getItem("skaylon:enquiry-sent"))).toBe("1");
});

test("arriving from a service page pre-selects the project type", async ({ page }) => {
  await page.goto("/contact?service=backend-api-development");
  await expect(page.getByLabel(/^Project type/)).toHaveValue("Backend/API");
});

test("an instant (bot-speed) submission is refused with a retryable error", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeEnabled({ timeout: 15_000 });
  await fill(page);
  // Simulate a bot: the form claims it was opened a moment ago.
  await page.locator('input[name="startedAt"]').evaluate((el: HTMLInputElement) => (el.value = String(Date.now())));
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("#contact-status")).toContainText("Please try again", { timeout: 20_000 });
  // Values survive the failed attempt.
  await expect(page.getByLabel(/^Email/)).toHaveValue("asha@example.in");
});

test("a filled honeypot gets a silent fake success", async ({ page }) => {
  await page.goto("/contact");
  await fill(page);
  await page.locator("#contact-website").evaluate((el: HTMLInputElement) => (el.value = "http://spam.example"));
  await page.waitForTimeout(3500);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page).toHaveURL(/\/contact\/thank-you$/, { timeout: 20_000 });
});

test("server-side validation marks and focuses the first bad field", async ({ page }) => {
  await page.goto("/contact");
  await fill(page, { email: "not-an-email" });
  // Bypass the browser's own checks to prove the server enforces them.
  await page.locator("form").evaluate((f: HTMLFormElement) => (f.noValidate = true));
  await page.waitForTimeout(3500);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("#contact-status")).toContainText("check the highlighted fields", { timeout: 20_000 });
  const email = page.getByLabel(/^Email/);
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toBeFocused();
  await expect(page.locator("#contact-email-error")).toContainText("valid email");
});
