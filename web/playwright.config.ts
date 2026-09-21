import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // Uses the locally installed Chrome (no Playwright browser download needed).
    channel: "chrome",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    // Runs the test build made by scripts/e2e.mjs (`npm run test:e2e`).
    command: `npx next start -p ${PORT} -H 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
      CONTACT_DRY_RUN: "1",
      SANITY_REVALIDATE_SECRET: "e2e-revalidate-secret-0123456789",
    },
  },
});
