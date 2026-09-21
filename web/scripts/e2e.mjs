/**
 * Builds a TEST bundle and runs Playwright against it.
 *
 * The test build uses Cloudflare's official always-pass Turnstile test keys
 * and CONTACT_DRY_RUN (enquiries are logged, not emailed). These values are
 * passed only to this build/server process, never written to .env files, so
 * they can't leak into a deploy (cf:build always rebuilds from .env.production).
 */
import { spawnSync } from "node:child_process";

export const E2E_ENV = {
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA", // always passes, invisible
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA", // always passes
  CONTACT_DRY_RUN: "1",
  SANITY_REVALIDATE_SECRET: "e2e-revalidate-secret-0123456789",
};

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true, env: { ...process.env, ...E2E_ENV } });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

if (!process.argv.includes("--no-build")) run("npx", ["next", "build"]);
run("npx", ["playwright", "test", ...process.argv.slice(2).filter((a) => a !== "--no-build")]);
