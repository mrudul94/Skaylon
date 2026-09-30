import { expect, test, type Page } from "@playwright/test";

// The "before you go" pop-up. Runs against the test build (Turnstile test keys
// that always pass, CONTACT_DRY_RUN). The page clock is controlled so the
// engagement delays don't make the suite slow.
test.describe.configure({ mode: "serial" });

async function engageAndExit(page: Page) {
  // Listeners attach after hydration: engagement before that isn't seen.
  // (Not "networkidle": Turnstile keeps a connection busy on some pages.)
  await page.waitForLoadState("load");
  await page.waitForTimeout(750);
  await page.mouse.move(600, 400);
  await page.mouse.wheel(0, 600); // scroll = engagement
  await page.clock.fastForward(16_000); // past the 15 s minimum
  await page.mouse.move(600, 200);
  await page.mouse.move(600, 0); // toward the tab bar…
  await page.mouse.move(600, -10); // …and out of the window
}

const dialog = (page: Page) => page.getByRole("dialog", { name: /Before you go/ });

test.describe("desktop exit intent", () => {
  test.skip(({ isMobile }) => isMobile, "exit intent is desktop only");

  test("does not appear immediately, even on exit", async ({ page }) => {
    await page.clock.install();
    await page.goto("/services");
    await page.mouse.move(600, 400);
    await page.mouse.move(600, -10);
    await page.waitForTimeout(300);
    await expect(dialog(page)).toHaveCount(0);
  });

  test("appears on exit after engagement; Escape closes it and it stays closed", async ({ page }) => {
    await page.clock.install();
    await page.goto("/services");
    await engageAndExit(page);
    await expect(dialog(page)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Before you go — what are you looking to build?" })).toBeVisible();
    for (const label of ["Project type", "Budget", "Timeline", "Name", "Email", "Project details"]) {
      await expect(dialog(page).getByLabel(new RegExp(`^${label}`))).toBeVisible();
    }
    await expect(dialog(page).getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();

    // Dismissal is remembered: a fresh visit doesn't show it again.
    await page.goto("/about");
    await engageAndExit(page);
    await page.waitForTimeout(300);
    await expect(dialog(page)).toHaveCount(0);
  });

  test("close button works and focus stays in the dialog while open", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await engageAndExit(page);
    await expect(dialog(page)).toBeVisible();
    for (let i = 0; i < 15; i++) await page.keyboard.press("Tab");
    expect(await dialog(page).evaluate((d) => d.contains(document.activeElement))).toBe(true);
    await dialog(page).getByRole("button", { name: "Close" }).first().click();
    await expect(dialog(page)).toBeHidden();
  });

  test("never appears on the contact page", async ({ page }) => {
    await page.clock.install();
    await page.goto("/contact");
    await engageAndExit(page);
    await page.waitForTimeout(300);
    await expect(dialog(page)).toHaveCount(0);
  });

  test("submits through the secure enquiry flow and shows a thank-you", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/services/mobile-app-development");
    await page.waitForLoadState("load");
    await page.waitForTimeout(750);
    // Real clock here: the server measures fill time against real time.
    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, 600);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 15_500)));
    await page.mouse.move(600, 0);
    await page.mouse.move(600, -10);
    const d = dialog(page);
    await expect(d).toBeVisible();

    // Validation: name and email are required.
    await expect(d.getByRole("button", { name: "Send enquiry" })).toBeEnabled({ timeout: 15_000 });
    await d.getByRole("button", { name: "Send enquiry" }).click();
    expect(await d.getByLabel(/^Name/).evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
    await expect(d).toBeVisible();

    await d.getByLabel(/^Project type/).selectOption("Mobile App");
    await d.getByLabel(/^Timeline/).selectOption("Within 1–3 months");
    await d.getByLabel(/^Name/).fill("Asha Menon");
    await d.getByLabel(/^Email/).fill("asha@example.in");
    await d.getByLabel(/may use these details/).check();
    await d.getByRole("button", { name: "Send enquiry" }).click();
    await expect(d.getByRole("status")).toContainText("Thank you", { timeout: 20_000 });

    // A sent enquiry suppresses the pop-up for good.
    expect(await page.evaluate(() => localStorage.getItem("skaylon:enquiry-sent"))).toBe("1");
  });

  test("is suppressed after a contact-form enquiry", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("skaylon:enquiry-sent", "1"));
    await page.goto("/services");
    await engageAndExit(page);
    await page.waitForTimeout(300);
    await expect(dialog(page)).toHaveCount(0);
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile behaviour");

  test("no fake exit intent; appears only after reading most of a page", async ({ page }) => {
    await page.clock.install();
    await page.goto("/services/web-application-development");
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(200);
    await expect(dialog(page)).toHaveCount(0);

    await page.clock.fastForward(31_000);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.7));
    await expect(dialog(page)).toBeVisible();
    // No horizontal overflow from the dialog on a phone.
    expect(await dialog(page).evaluate((d) => d.getBoundingClientRect().right <= window.innerWidth)).toBe(true);
    await dialog(page).getByRole("button", { name: "No thanks" }).click();
    await expect(dialog(page)).toBeHidden();
  });
});
