import { SEEDED_USERS } from "../../fixtures/seed.ts";
import { expect, test } from "../../fixtures/test.ts";

/**
 * The login flow, driven from a browser with no stored session.
 *
 * This is the one place where the real handshake is exercised end to end: form
 * submit -> POST /api/v1/auth/login -> token in localStorage -> profile fetched
 * -> redirect. The component tests in `@libs/users-front` mock the session
 * service, so they cannot catch a break in any of those links.
 */
test.describe("login", () => {
  test("sends an anonymous visitor from a protected route to the login page", async ({ page }) => {
    await page.goto("/users");

    await expect(page).toHaveURL("/login");
  });

  test("signs in with the seeded credentials and loads the profile", async ({
    page,
    loginPage,
    dashboard,
  }) => {
    await loginPage.goto();
    await loginPage.login(SEEDED_USERS.main.email, SEEDED_USERS.main.password);

    await expect(page).toHaveURL("/");
    // The name comes from GET /users/profile, so this also proves the token was
    // accepted on a second, authenticated request.
    await expect(dashboard.userName).toHaveText(SEEDED_USERS.main.fullName);
  });

  test("stores the session so the app stays authenticated", async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(SEEDED_USERS.main.email, SEEDED_USERS.main.password);
    await expect(page).toHaveURL("/");

    const keys = await page.evaluate(() => Object.keys(window.localStorage));

    expect(keys).toContain("ember_simple_auth-session");
  });

  test("refuses a wrong password and keeps the visitor on the login page", async ({
    page,
    loginPage,
  }) => {
    await loginPage.goto();
    // The form ships prefilled with the seeded credentials, so both fields have
    // to be overwritten to test a rejection.
    await loginPage.login(SEEDED_USERS.main.email, "not-the-password");

    await expect(page).toHaveURL("/login");
    await expect(loginPage.form).toBeVisible();
    // No assertion on an error message: the app currently shows none. See the
    // note in README.md.
  });

  test("leaves protected routes guarded after a failed attempt", async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(SEEDED_USERS.main.email, "not-the-password");
    await expect(page).toHaveURL("/login");

    await page.goto("/users");

    await expect(page).toHaveURL("/login");
  });
});
