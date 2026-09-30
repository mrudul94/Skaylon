import { createHmac } from "node:crypto";
import { expect, test } from "@playwright/test";
import { routes } from "./routes";

test.skip(({ isMobile }) => isMobile, "server responses are device-independent");

test("sitemap lists every public page on the production origin", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/", "/services", "/services/ui-ux-design", "/services/backend-api-development", "/work", "/process", "/about", "/contact", "/privacy", "/terms", "/cookies"]) {
    expect(xml).toContain(`<loc>https://skaylon.com${path === "/" ? "/" : path}</loc>`);
  }
  expect(xml).not.toContain("localhost");
  expect(xml).not.toContain("thank-you");
});

test("robots.txt allows the site, blocks the API and points to the sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toContain("Disallow: /api/");
  expect(txt).toContain("Disallow: /contact/thank-you");
  expect(txt).toContain("Sitemap: https://skaylon.com/sitemap.xml");
});

test("service page carries valid Service, FAQPage and BreadcrumbList JSON-LD", async ({ page }) => {
  await page.goto("/services/website-development");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.flatMap((b) => {
    const parsed = JSON.parse(b);
    return (Array.isArray(parsed) ? parsed : [parsed]).map((x: { "@type": string }) => x["@type"]);
  });
  expect(types).toEqual(expect.arrayContaining(["ProfessionalService", "WebSite", "WebPage", "Service", "FAQPage", "BreadcrumbList"]));
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-default\.jpg$/);
});

test("/api/event accepts known events and rejects the rest", async ({ request }) => {
  expect((await request.post("/api/event", { data: { name: "cta_click", label: "hero" } })).status()).toBe(204);
  expect((await request.post("/api/event", { data: { name: "drop_tables" } })).status()).toBe(400);
  expect((await request.post("/api/event", { data: "not json", headers: { "content-type": "application/json" } })).status()).toBe(400);
  expect(
    (await request.post("/api/event", { data: { name: "cta_click" }, headers: { origin: "https://evil.example" } })).status(),
  ).toBe(403);
});

test("/api/revalidate rejects unsigned calls and accepts a valid Sanity signature", async ({ request }) => {
  const body = JSON.stringify({ _type: "service", _id: "service-ui-ux-design" });
  expect((await request.post("/api/revalidate", { data: body })).status()).toBe(401);

  const t = Date.now();
  const sig = createHmac("sha256", "e2e-revalidate-secret-0123456789")
    .update(`${t}.${body}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const ok = await request.post("/api/revalidate", {
    data: body,
    headers: { "content-type": "application/json", "sanity-webhook-signature": `t=${t},v1=${sig}` },
  });
  expect(ok.status()).toBe(200);
  expect(await ok.json()).toMatchObject({ revalidated: true, type: "service" });
});

const ldTypes = async (page: import("@playwright/test").Page) =>
  (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap((b) => {
    const parsed = JSON.parse(b);
    return (Array.isArray(parsed) ? parsed : [parsed]).map((x: { "@type": string }) => x["@type"]);
  });

test("structured data per page type", async ({ page }) => {
  const expected: [string, string[]][] = [
    ["/", ["WebPage", "FAQPage"]],
    ["/services", ["CollectionPage", "ItemList", "FAQPage"]],
    ["/contact", ["ContactPage"]],
    ["/about", ["AboutPage"]],
    ["/process", ["WebPage", "FAQPage"]],
  ];
  for (const [path, types] of expected) {
    await page.goto(path);
    expect(await ldTypes(page), path).toEqual(expect.arrayContaining(types));
  }
});

test("FAQPage schema only lists questions that are visible on the page", async ({ page }) => {
  for (const path of ["/", "/services/custom-software-development", "/process"]) {
    await page.goto(path);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faq = blocks
      .flatMap((b) => [JSON.parse(b)].flat())
      .find((x: { "@type": string }) => x["@type"] === "FAQPage") as { mainEntity: { name: string }[] };
    for (const q of faq.mainEntity) await expect(page.locator("summary", { hasText: q.name })).toHaveCount(1);
  }
});

test("titles and descriptions are unique across pages", async ({ page }) => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const route of routes) {
    await page.goto(route);
    const t = await page.title();
    const d = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    expect(titles.get(t), `${route} duplicates the title of ${titles.get(t)}`).toBeUndefined();
    expect(descriptions.get(d), `${route} duplicates the description of ${descriptions.get(d)}`).toBeUndefined();
    titles.set(t, route);
    descriptions.set(d, route);
  }
});

test("brand assets, manifest and llms.txt are served", async ({ request }) => {
  for (const path of ["/og-default.jpg", "/icon.svg", "/apple-icon.png", "/icon-192.png", "/icon-512.png", "/icon-512-maskable.png", "/manifest.webmanifest", "/llms.txt"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  expect(await (await request.get("/llms.txt")).text()).toContain("Backend and API Systems");
});

test("popup and phone analytics events are accepted", async ({ request }) => {
  for (const name of ["enquiry_popup_shown", "enquiry_popup_dismissed", "enquiry_popup_submitted", "phone_click"]) {
    expect((await request.post("/api/event", { data: { name } })).status(), name).toBe(204);
  }
});
