# Skaylon

Studio website for Skaylon (Kasaragod, Kerala): Next.js 15 on Cloudflare Workers, a persistent React Three Fiber world, and Sanity for content.

| | |
|---|---|
| Site (preview) | https://skaylon-web.mrudulp2002.workers.dev |
| Studio (CMS) | https://skaylon-studio.sanity.studio (project `94bjvovm`, dataset `production`) |
| Production domain | https://skaylon.com (not connected yet; see *Going live*) |

```
web/      Next.js app (App Router, TypeScript strict, Tailwind v4, R3F 9, GSAP + Lenis)
studio/   Sanity Studio (schema, desk structure, seed script)
```

## Everyday commands (in `web/`)

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server (uses `.env.development`) |
| `npm run verify` | 9 numeric suites: headers/CSP, contrast, chip formations, camera & poses (incl. labels on screen), scroll anchors, quality tiers, baked environment, webhook signatures, contact form |
| `npm run build && npm run verify:bundle` | Production build + per-route JS budget (≤130 KB gz) |
| `npm run test:e2e` | Builds a test bundle, then 52 Playwright tests (axe on every page, keyboard, mobile menu, reduced motion, no-JS, contact form, SEO, APIs) |
| `npm run cf:deploy` | Build for Workers, fill the KV page cache, deploy |
| `npm run verify:routes -- <url>` | Every route 200 + production canonical, against a deployment |
| `node scripts/verify-headers.mts <url>` / `node scripts/csp-audit.mjs <url>` | Live header contract / CSP crawl |
| `node scripts/lighthouse.mjs <url>` | Lighthouse mobile budget gate |
| `node scripts/longtasks.mjs <url> [cpuSlowdown]` | Main-thread long tasks during 3D start-up |
| `npm run bake:env` | Re-bake the studio lighting after editing `src/world/environment.ts` |
| `npm run posters` | Re-render the poster fallback + OG image from a running server |

## How it fits together

- **Content**: pages call `src/content/index.ts`. With `NEXT_PUBLIC_SANITY_PROJECT_ID` set it reads Sanity (tagged ISR fetches); otherwise the local seed. Publishing in Sanity calls `/api/revalidate` (HMAC-signed webhook), and pages refresh in seconds (measured 6.6 s). An hourly revalidation is the fallback.
- **ISR on Workers**: KV page cache (`NEXT_INC_CACHE_KV`) + D1 tag cache (`NEXT_TAG_CACHE_D1`), see `web/open-next.config.ts`.
- **3D world ("code to product")**: `src/world/`. Thousands of chips in one instanced draw call morph between formations: the finished product (hero), lines of code (understanding), five service icons (capabilities), a gallery wall (proof), four process stages (process), and the delivered product (commitment). Labels with leader lines type in beside each group (captions on phones), using service and phase names from the CMS. Formations are pure data in `formations.ts` and poses in `journey.ts`, both tested, including a check that every label lands on screen. `WorldMount` loads the canvas after the page is interactive (phones wait until the visitor pauses). Shaders compile in parallel before the first frame, and lighting is pre-baked. Tier 0, no WebGL, or context loss shows a poster.
- **Contact**: Server Action with zod validation, honeypot, fill-time check, per-IP rate limit (Workers binding), Cloudflare Turnstile, and Resend. Nothing is stored.
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

- Add real case studies in the Studio (Projects). The Work page shows a clean "in preparation" state until then.
- Have a lawyer review Privacy and Terms (drafts reflect the real processors: Cloudflare, Turnstile, Resend, Sanity).
- Review the Process page durations and the About page principles.
