import { defineConfig, devices } from "@playwright/test";

/**
 * E2E test configuration
 * Runs Playwright tests against the real backend
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:4200",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Start both backend and frontend servers */
  webServer: [
    {
      command: "pnpm --filter @apps/backend start:e2e",
      url: "http://localhost:8000/api/v1/status",
      timeout: 240_000,
      reuseExistingServer: !process.env.CI,
      cwd: "../..",
    },
    {
      command:
        "pnpm vite build --mode e2e && pnpm vite preview --mode e2e --port 4200",
      url: "http://localhost:4200",
      timeout: 240_000,
      reuseExistingServer: !process.env.CI,
      cwd: "../front",
      env: {
        VITE_MOCK_API: "false",
        VITE_API_URL: "http://localhost:8000",
      },
    },
  ],
});
