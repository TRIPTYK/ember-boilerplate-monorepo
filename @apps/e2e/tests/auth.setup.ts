import { expect, test as setup } from "@playwright/test";
import { SEEDED_USERS } from "../fixtures/seed.ts";
import { STORAGE_STATE } from "../fixtures/storage-state.ts";
import { DashboardPage } from "../pages/dashboard.page.ts";
import { LoginPage } from "../pages/login.page.ts";

/**
 * Signs in once and saves the browser state, so the `authenticated` project
 * starts every test already logged in instead of replaying the login form.
 *
 * The login flow itself is covered by `tests/anonymous/login.spec.ts` — this is
 * setup, not a test of authentication.
 */
setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login(SEEDED_USERS.main.email, SEEDED_USERS.main.password);

  await expect(page).toHaveURL("/");
  await expect(dashboard.userName).toHaveText(SEEDED_USERS.main.fullName);

  await page.context().storageState({ path: STORAGE_STATE });
});
