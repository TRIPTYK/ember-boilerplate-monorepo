import { defineConfig, devices } from "@playwright/test";
import { API_URL } from "./fixtures/api.ts";
import { STORAGE_STATE } from "./fixtures/storage-state.ts";

const APP_URL = "http://localhost:4200";

/**
 * E2E configuration — runs the real frontend against the real backend and a
 * real PostgreSQL database. Nothing is mocked here: the frontend has no mock
 * layer at all, it always talks to the API through the vite proxy.
 *
 * Tests are split in two projects:
 *  - `anonymous`     starts with an empty browser, and owns the login flow.
 *  - `authenticated` reuses the session saved by the `setup` project.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: APP_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "anonymous",
      testDir: "./tests/anonymous",
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: "authenticated",
      testDir: "./tests/authenticated",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE,
      },
    },
  ],

  /* Start both backend and frontend servers */
  webServer: [
    {
      command: "pnpm --filter @apps/backend start:e2e",
      url: `${API_URL}/api/v1/status`,
      timeout: 240_000,
      reuseExistingServer: !process.env.CI,
      cwd: "../..",
    },
    {
      command:
        "pnpm vite build --mode e2e && pnpm vite preview --mode e2e --port 4200",
      url: APP_URL,
      timeout: 240_000,
      reuseExistingServer: !process.env.CI,
      cwd: "../front",
      env: {
        VITE_API_URL: API_URL,
      },
    },
  ],
});
