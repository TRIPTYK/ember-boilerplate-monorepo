import type { Locator, Page } from "@playwright/test";

/**
 * `/login` — rendered by `@libs/users-front/src/components/forms/login-form.gts`.
 *
 * Note: the form ships prefilled with the seeded credentials, so a test that
 * needs *wrong* credentials has to overwrite both fields.
 */
export class LoginPage {
  readonly form: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(private readonly page: Page) {
    this.form = page.locator("[data-test-login-form]");
    this.email = this.form.locator('[data-test-tpk-prefab-email-container="email"] input');
    this.password = this.form.locator('[data-test-tpk-prefab-password-container="password"] input');
    this.submitButton = this.form.locator('button[type="submit"]');
    this.forgotPasswordLink = this.form.locator(".forgot-password-link");
  }

  async goto(): Promise<void> {
    await this.page.goto("/login");
    await this.form.waitFor();
  }

  async fill(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(email, password);
    await this.submit();
  }
}
