import { test as base } from "@playwright/test";
import { FlashMessages } from "../pages/components/flash-messages.ts";
import { DashboardPage } from "../pages/dashboard.page.ts";
import { LoginPage } from "../pages/login.page.ts";
import { TodoFormPage, TodosListPage } from "../pages/todos.page.ts";
import { UserFormPage, UsersListPage } from "../pages/users.page.ts";
import { ApiClient } from "./api.ts";
import { SEEDED_USERS } from "./seed.ts";

interface Fixtures {
  loginPage: LoginPage;
  dashboard: DashboardPage;
  flash: FlashMessages;
  usersPage: UsersListPage;
  userForm: UserFormPage;
  todosPage: TodosListPage;
  todoForm: TodoFormPage;
  /** JSON:API client for arranging state; cleans up after itself. */
  api: ApiClient;
}

/**
 * Use this `test` instead of `@playwright/test`'s, so a spec asks for the page
 * objects it needs instead of building them.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboard: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  flash: async ({ page }, use) => {
    await use(new FlashMessages(page));
  },
  usersPage: async ({ page }, use) => {
    await use(new UsersListPage(page));
  },
  userForm: async ({ page }, use) => {
    await use(new UserFormPage(page));
  },
  todosPage: async ({ page }, use) => {
    await use(new TodosListPage(page));
  },
  todoForm: async ({ page }, use) => {
    await use(new TodoFormPage(page));
  },
  api: async ({}, use) => {
    const api = await ApiClient.login(SEEDED_USERS.main.email, SEEDED_USERS.main.password);
    await use(api);
    await api.cleanup();
    await api.dispose();
  },
});

export { expect } from "@playwright/test";
