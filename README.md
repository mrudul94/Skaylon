# Skaylon

Website for Skaylon, a software studio in Kasaragod, Kerala: a fast, accessible B2B site on Next.js 15 and Cloudflare Workers, with Sanity for content.

| | |
|---|---|
| Site (preview) | https://skaylon-web.mrudulp2002.workers.dev |
| Studio (CMS) | https://skaylon-studio.sanity.studio (project `94bjvovm`, dataset `production`) |
| Production domain | https://skaylon.com (not connected yet; see *Going live*) |

```
web/      Next.js app (App Router, TypeScript strict, Tailwind v4; no animation or 3D libraries)
studio/   Sanity Studio (schema, desk structure, seed script)
```

## Everyday commands (in `web/`)

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server (uses `.env.development`) |
| `npm run verify` | 5 suites: headers/CSP, WCAG contrast of the design tokens, content integrity (unique titles/descriptions, lengths, related services, no unsupported claims), webhook signatures, enquiry form (validation, bot checks, email safety) |
| `npm run build && npm run verify:bundle` | Production build + per-route JS budget (≤130 KB gz) |
| `npm run test:e2e` | Builds a test bundle from the seed content, then Playwright on desktop + Pixel 7: axe on every page, one h1, heading order, no horizontal overflow, console errors, internal link check, Services menu (hover, keyboard, Escape), mobile menu accordion, sticky CTA, enquiry pop-up (exit intent, suppression, submit), contact flow + thank-you page, structured data, unique titles, APIs |
| `npm run cf:deploy` | Build for Workers, fill the KV page cache, deploy |
| `npm run verify:routes -- <url>` | Every route 200 + production canonical, against a deployment |
| `node scripts/verify-headers.mts <url>` / `node scripts/csp-audit.mjs <url>` | Live header contract / CSP crawl |
| `node scripts/lighthouse.mjs <url>` | Lighthouse mobile budget gate |
| `npm run brand-assets` | Re-render the PNG icons and the default OG image (`scripts/render-brand-assets.mjs`) |
| `node --experimental-strip-types scripts/verify-cms.mts` | After seeding: live Sanity content equals the seed |

## How it fits together

- **Content**: pages call `src/content/index.ts`. With `NEXT_PUBLIC_SANITY_PROJECT_ID` set it reads Sanity (tagged ISR fetches); otherwise the local seed. Publishing in Sanity calls `/api/revalidate` (HMAC-signed webhook), and pages refresh in seconds (measured 6.6 s). An hourly revalidation is the fallback.
- **ISR on Workers**: KV page cache (`NEXT_INC_CACHE_KV`) + D1 tag cache (`NEXT_TAG_CACHE_D1`), see `web/open-next.config.ts`.
- **Design system**: tokens in `src/app/globals.css` (warm paper, near-black ink, one brand orange; Geist + Geist Mono). Contrast pairs are asserted by `verify-contrast`. Motion is CSS only: a small IntersectionObserver reveal (`src/scroll/Reveal.tsx`), off under reduced motion and invisible to no-JS visitors and crawlers.
- **Navigation**: `Header.tsx` with the Services mega-menu (`ServicesMenu.tsx`, disclosure pattern: hover, click, arrow keys, Escape) and a native `<dialog>` mobile menu with a Services accordion. A sticky call/enquiry bar shows on small screens.
- **Service pages**: one template (`app/services/[slug]`) fed by the service documents: summary, capabilities, use cases, approach, process, FAQ (visible + FAQPage schema), related services, CTA to `/contact?service=…` (pre-selects the project type).
- **SEO/AEO/GEO**: `lib/seo.ts` (unique title, description, canonical, OG/Twitter per page), `lib/jsonld.ts` (Organization, WebSite, WebPage/ContactPage/AboutPage/CollectionPage, Service, ItemList, BreadcrumbList, FAQPage), sitemap, robots, `public/llms.txt`, an "In short" summary near the top of key pages.
- **Enquiry pop-up**: `components/enquiry/`. `EnquiryPrompt` (always loaded, tiny) decides when: desktop exit intent after 15 s + interaction; on phones only after 30 s and 60% scroll on home/services; never on /contact; 30 days after a dismissal; never after an enquiry. `EnquiryPopup` (loaded on demand) is a native modal dialog posting to the same server action as the contact form (`source=popup`).
- **Contact**: one Server Action for both forms, with zod validation, honeypot, fill-time check, per-IP rate limit (Workers binding), Cloudflare Turnstile (submit waits for the token), and Resend. Nothing is stored; success leads to `/contact/thank-you` (noindex).
- **Security**: enforced CSP and security headers from `src/lib/security-headers.ts`; `*.workers.dev` is `noindex`.

## Secrets & configuration

Public build-time values live in `web/.env.production`. Secrets are Worker secrets (`npx wrangler secret put NAME`), never files:

| Name | Status |
|---|---|
| `SANITY_REVALIDATE_SECRET` | ✅ set (matches the Sanity webhook "Revalidate website") |
| `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (in `.env.production`) | ⏳ needed: the contact form stays hidden (direct email/phone/WhatsApp shown) until set |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | ⏳ needed for the form to send |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` (in `.env.production`) | ⏳ Cloudflare Web Analytics token |

Never put values in `web/.env.local`: Next loads it for production builds too (it once shipped `localhost` canonicals).

## Going live on skaylon.com

1. Cloudflare → Workers → `skaylon-web` → Domains → add `skaylon.com` (and `www`).
2. Resend: add `skaylon.com`, create the SPF/DKIM DNS records, then set the Resend secrets above.
3. Turnstile: add a widget for `skaylon.com`; site key into `.env.production`, secret via `wrangler secret put`.
4. Enable **Analytics Engine** once (Cloudflare dashboard → Workers → Analytics Engine), then uncomment `analytics_engine_datasets` in `web/wrangler.jsonc`. Add the Web Analytics beacon token.
5. Point the Sanity webhook at `https://skaylon.com/api/revalidate` (sanity.io/manage → API → Webhooks).
6. `npm run cf:deploy`, then `npm run verify:routes -- https://skaylon.com` and `node scripts/csp-audit.mjs https://skaylon.com`.

## Before launch (content)

- Push the new copy to Sanity: `cd studio && SANITY_STUDIO_PROJECT_ID=94bjvovm SANITY_WRITE_TOKEN=… npm run seed` (replaces the service, page and legal documents with the seed; check the Studio for edits you want to keep first), then `node --experimental-strip-types web/scripts/verify-cms.mts`. Deploy after seeding: the Backend and API service only exists in production once it is in Sanity.
- Add real case studies in the Studio (Projects). The Work page shows a clean "in preparation" state until then.
- Have a lawyer review the Privacy Policy, Terms and Conditions and Cookie Policy (drafts reflect the real processors: Cloudflare, Turnstile, Resend, Sanity).
- Review the Process page durations, timelines and the About page principles.
