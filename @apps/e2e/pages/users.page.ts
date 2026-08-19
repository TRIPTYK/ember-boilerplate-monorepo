import type { Locator, Page } from "@playwright/test";
import { ConfirmModal } from "./components/confirm-modal.ts";
import { DataTable } from "./components/data-table.ts";

/** `/users` — `@libs/users-front/src/components/user-table.gts`. */
export class UsersListPage {
  readonly table: DataTable;
  readonly deleteModal: ConfirmModal;
  readonly title: Locator;
  readonly addButton: Locator;

  constructor(private readonly page: Page) {
    this.table = new DataTable(page);
    this.deleteModal = new ConfirmModal(page);
    this.title = page.getByRole("heading", { name: "User List" });
    this.addButton = page.getByRole("button", { name: "Add User" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/users");
    await this.table.root.waitFor();
  }

  async startCreate(): Promise<void> {
    await this.addButton.click();
  }

  async edit(id: string): Promise<void> {
    await this.table.runRowAction(this.table.row(id), "Edit");
  }

  /** Opens the confirm modal but does not confirm — the test decides. */
  async startDelete(id: string): Promise<void> {
    await this.table.runRowAction(this.table.row(id), "Delete");
    await this.deleteModal.root.waitFor();
  }
}

export interface UserFormValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  /** Create only — the edit form has no password field. */
  password?: string;
}

/** `/users/create` and `/users/:id/edit` — `forms/user-form.gts`. */
export class UserFormPage {
  readonly form: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;
  readonly backLink: Locator;

  constructor(private readonly page: Page) {
    this.form = page.locator("[data-test-users-form]");
    this.firstName = this.form.locator('[data-test-tpk-prefab-input-container="firstName"] input');
    this.lastName = this.form.locator('[data-test-tpk-prefab-input-container="lastName"] input');
    this.email = this.form.locator('[data-test-tpk-prefab-email-container="email"] input');
    this.password = this.form.locator('[data-test-tpk-prefab-password-container="password"] input');
    this.submitButton = this.form.locator('button[type="submit"]');
    this.backLink = this.form.getByRole("link", { name: "Back to users" });
  }

  async gotoCreate(): Promise<void> {
    await this.page.goto("/users/create");
    await this.form.waitFor();
  }

  async gotoEdit(id: string): Promise<void> {
    await this.page.goto(`/users/${id}/edit`);
    await this.form.waitFor();
  }

  async fill(values: UserFormValues): Promise<void> {
    if (values.firstName !== undefined) await this.firstName.fill(values.firstName);
    if (values.lastName !== undefined) await this.lastName.fill(values.lastName);
    if (values.password !== undefined) await this.password.fill(values.password);
    if (values.email !== undefined) await this.email.fill(values.email);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /** Validation errors for one field, e.g. `errorsFor('lastName')`. */
  errorsFor(field: string): Locator {
    return this.form.locator(
      `[data-test-tpk-prefab-input-container="${field}"] [data-test-tpk-validation-errors], ` +
        `[data-test-tpk-prefab-email-container="${field}"] [data-test-tpk-validation-errors], ` +
        `[data-test-tpk-prefab-password-container="${field}"] [data-test-tpk-validation-errors]`,
    );
  }
}
