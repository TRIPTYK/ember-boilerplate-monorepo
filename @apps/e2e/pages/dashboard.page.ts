import type { Locator, Page } from "@playwright/test";
import { FlashMessages } from "./components/flash-messages.ts";

/**
 * The authenticated shell — `TpkDashBoard` from
 * `@apps/front/app/templates/dashboard.gts`: sidebar, navbar, user menu.
 */
export class DashboardPage {
  readonly flash: FlashMessages;
  readonly sidebar: Locator;
  readonly userName: Locator;
  private readonly userMenuToggle: Locator;
  private readonly userMenu: Locator;

  constructor(private readonly page: Page) {
    this.flash = new FlashMessages(page);
    this.sidebar = page.locator(".tpk-sidebar-menu");
    this.userMenuToggle = page.locator(".tpk-navbar-user-menu-toggle");
    this.userName = page.locator(".tpk-navbar-user-name");
    this.userMenu = page.locator("#popover-user");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  /** A sidebar entry by its visible label: `Dashboard`, `Users`, `Todos`. */
  navLink(label: string): Locator {
    return this.sidebar.getByRole("link", { name: label });
  }

  async navigateTo(label: string): Promise<void> {
    await this.navLink(label).click();
  }

  async logout(): Promise<void> {
    await this.userMenuToggle.click();
    await this.userMenu.getByRole("button", { name: "Logout" }).click();
  }
}
