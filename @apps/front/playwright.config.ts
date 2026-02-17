import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for running e2e tests with MSW mocks.
 * For tests against the real backend, use @apps/e2e package instead.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm vite preview --mode development --port 4200',
    url: 'http://localhost:4200',
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
  },
});
