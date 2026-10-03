/**
 * verify-content — content integrity for SEO/AEO, read from the real seed
 * (the same copy studio/seed/import.mts pushes to Sanity):
 * unique titles and descriptions, sane lengths, one FAQ answer per question,
 * related services that exist, and no leftover unsupported claims.
 */
import { services } from "../src/content/seed/services.ts";
import { aboutPage, homePage, pricingPage, processPage } from "../src/content/seed/pages.ts";
import { cookiesPage, privacyPage, termsPage } from "../src/content/seed/legal.ts";

let failures = 0;
function check(name: string, ok: boolean) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const slugs = new Set(services.map((s) => s.slug));
check("six services", services.length === 6);
check("service slugs are unique", slugs.size === services.length);
check("service orders are unique", new Set(services.map((s) => s.order)).size === services.length);
for (const slug of ["website-development", "web-application-development", "mobile-app-development", "custom-software-development", "ui-ux-design", "backend-api-development"]) {
  check(`service exists: ${slug}`, slugs.has(slug));
}

const titles = services.map((s) => s.seo.title ?? s.name);
const descriptions = services.map((s) => s.seo.description ?? s.summary);
check("SEO titles are unique", new Set(titles).size === titles.length);
check("SEO descriptions are unique", new Set(descriptions).size === descriptions.length);
check("H1 headlines are unique", new Set(services.map((s) => s.headline)).size === services.length);

for (const s of services) {
  const t = `${s.seo.title ?? s.name} | Skaylon`;
  check(`${s.slug}: title ≤ 65 chars (${t.length})`, t.length <= 65);
  const d = s.seo.description ?? "";
  check(`${s.slug}: description 70–160 chars (${d.length})`, d.length >= 70 && d.length <= 160);
  check(`${s.slug}: menu description ≤ 90 chars`, s.menuDescription.length > 0 && s.menuDescription.length <= 90);
  check(`${s.slug}: 3–8 capabilities`, s.capabilities.length >= 3 && s.capabilities.length <= 8);
  check(`${s.slug}: 2–6 use cases`, s.useCases.length >= 2 && s.useCases.length <= 6);
  check(`${s.slug}: 3–6 process steps`, s.process.length >= 3 && s.process.length <= 6);
  check(`${s.slug}: at least 3 FAQs`, s.faqs.length >= 3);
  check(`${s.slug}: FAQ questions unique`, new Set(s.faqs.map((f) => f.question)).size === s.faqs.length);
  check(`${s.slug}: related services exist and exclude itself`, s.related.length > 0 && s.related.every((r) => slugs.has(r) && r !== s.slug));
}

// Copy that must not come back without the owner's confirmation (see handover notes).
const banned = [/\$\s?\d/, /premier/i, /engineering teams/i, /SLA/, /on-site/i, /sub-second/i, /global markets/i, /glowing code/i, /3D/];
const allText = JSON.stringify([services, homePage, aboutPage, processPage, pricingPage, privacyPage, termsPage, cookiesPage]);
for (const re of banned) check(`no unsupported claim matching ${re}`, !re.test(allText));

check("home FAQs present", homePage.faqs.length >= 3);
check("process FAQs present", processPage.faqs.length >= 3);

// Pricing: the owner's starting prices, and every price quoted elsewhere matches them.
const priceOf = (name: string) => pricingPage.packages.find((p) => p.name === name)?.priceFrom;
check("business website starts from 7999", priceOf("Business website") === 7999);
check("e-commerce store starts from 15999", priceOf("E-commerce store") === 15999);
check("unpriced packages have a label", pricingPage.packages.every((p) => p.priceFrom != null || Boolean(p.priceLabel)));
check("pricing packages link to services that exist", pricingPage.packages.every((p) => !p.serviceSlug || slugs.has(p.serviceSlug)));
check("pricing FAQs present", pricingPage.faqs.length >= 3);
const quoted = new Set([...allText.matchAll(/₹([\d,]+)(?![\d,]*\s*lakh)/g)].map((m) => Number(m[1]!.replace(/,/g, ""))));
const offered = new Set(pricingPage.packages.flatMap((p) => (p.priceFrom != null ? [p.priceFrom] : [])));
check(`every ₹ price in the copy is a package price (${[...quoted].join(", ")})`, [...quoted].every((n) => offered.has(n)));
check("cookie policy exists", cookiesPage.sections.length > 0);

console.log(`
${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
