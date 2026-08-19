import { SEEDED_USERS } from "../../fixtures/seed.ts";
import { expect, test } from "../../fixtures/test.ts";

/**
 * What happens to a session between page loads — only observable in a real
 * browser, so none of it can be covered by the vitest suites.
 */
test.describe("session", () => {
  test("survives a full page reload on a protected route", async ({ page, dashboard }) => {
    await page.goto("/users");
    await expect(page).toHaveURL("/users");

    await page.reload();

    await expect(page).toHaveURL("/users");
    await expect(dashboard.userName).toHaveText(SEEDED_USERS.main.fullName);
  });

  test("sends the access token as a bearer header on API requests", async ({ page }) => {
    const authorizations: (string | undefined)[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/v1/users")) {
        authorizations.push(request.headers()["authorization"]);
      }
    });

    await page.goto("/users");
    await expect(page.locator("[data-test-table-generic-prefab]")).toBeVisible();

    expect(authorizations.length).toBeGreaterThan(0);
    expect(authorizations.every((header) => header?.startsWith("Bearer "))).toBe(true);
  });

  test("logging out clears the session and re-guards protected routes", async ({
    page,
    dashboard,
  }) => {
    await dashboard.goto();
    await expect(dashboard.userName).toHaveText(SEEDED_USERS.main.fullName);

    await dashboard.logout();

    await expect(page).toHaveURL("/login");

    await page.goto("/users");
    await expect(page).toHaveURL("/login");
  });
});

test.describe("dashboard shell", () => {
  test("navigates between the sections from the sidebar", async ({ page, dashboard }) => {
    await dashboard.goto();

    await dashboard.navigateTo("Users");
    await expect(page).toHaveURL("/users");

    await dashboard.navigateTo("Todos");
    await expect(page).toHaveURL("/todos");

    await dashboard.navigateTo("Dashboard");
    await expect(page).toHaveURL("/");
  });
});
