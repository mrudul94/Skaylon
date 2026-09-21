import { createHmac } from "node:crypto";
import { expect, test } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "server responses are device-independent");

test("sitemap lists every public page on the production origin", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/", "/services", "/services/ui-ux-design", "/work", "/process", "/about", "/contact", "/privacy", "/terms"]) {
    expect(xml).toContain(`<loc>https://skaylon.com${path === "/" ? "/" : path}</loc>`);
  }
  expect(xml).not.toContain("localhost");
});

test("robots.txt allows the site, blocks the API and points to the sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toContain("Disallow: /api/");
  expect(txt).toContain("Sitemap: https://skaylon.com/sitemap.xml");
});

test("service page carries valid Service, FAQPage and BreadcrumbList JSON-LD", async ({ page }) => {
  await page.goto("/services/website-development");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.flatMap((b) => {
    const parsed = JSON.parse(b);
    return (Array.isArray(parsed) ? parsed : [parsed]).map((x: { "@type": string }) => x["@type"]);
  });
  expect(types).toEqual(expect.arrayContaining(["ProfessionalService", "WebSite", "Service", "FAQPage", "BreadcrumbList"]));
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
