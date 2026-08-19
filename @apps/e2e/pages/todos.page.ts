import type { Locator, Page } from "@playwright/test";
import { ConfirmModal } from "./components/confirm-modal.ts";
import { DataTable } from "./components/data-table.ts";

/** `/todos` — `@libs/todos-front/src/components/todo-table.gts`. */
export class TodosListPage {
  readonly table: DataTable;
  readonly deleteModal: ConfirmModal;
  readonly title: Locator;
  readonly addButton: Locator;

  constructor(private readonly page: Page) {
    this.table = new DataTable(page);
    this.deleteModal = new ConfirmModal(page);
    this.title = page.getByRole("heading", { name: "Todo List" });
    this.addButton = page.getByRole("button", { name: "Add Todo" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/todos");
    await this.table.root.waitFor();
  }

  async startCreate(): Promise<void> {
    await this.addButton.click();
  }

  /** The read-only checkbox in the `Completed` column. */
  completedCheckbox(id: string): Locator {
    return this.table.row(id).locator("[data-test-tpk-checkbox-input]");
  }

  async edit(id: string): Promise<void> {
    await this.table.runRowAction(this.table.row(id), "Edit");
  }

  async toggleCompleted(id: string): Promise<void> {
    await this.table.runRowAction(this.table.row(id), "Change the status of the todo");
  }

  /** Opens the confirm modal but does not confirm — the test decides. */
  async startDelete(id: string): Promise<void> {
    await this.table.runRowAction(this.table.row(id), "Delete");
    await this.deleteModal.root.waitFor();
  }
}

export interface TodoFormValues {
  title?: string;
  description?: string;
}

/** `/todos/create` and `/todos/:id/edit` — `forms/todo-form.gts`. */
export class TodoFormPage {
  readonly form: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly completed: Locator;
  readonly submitButton: Locator;
  readonly backLink: Locator;

  constructor(private readonly page: Page) {
    this.form = page.locator("[data-test-todos-form]");
    this.title = this.form.locator('[data-test-tpk-prefab-input-container="title"] input');
    this.description = this.form.locator(
      '[data-test-tpk-prefab-textarea-container="description"] textarea',
    );
    this.completed = this.form.locator(
      '[data-test-tpk-prefab-checkbox-container="completed"] input',
    );
    this.submitButton = this.form.locator('button[type="submit"]');
    this.backLink = this.form.getByRole("link", { name: "Back to todos" });
  }

  async gotoCreate(): Promise<void> {
    await this.page.goto("/todos/create");
    await this.form.waitFor();
  }

  async gotoEdit(id: string): Promise<void> {
    await this.page.goto(`/todos/${id}/edit`);
    await this.form.waitFor();
  }

  async fill(values: TodoFormValues): Promise<void> {
    if (values.title !== undefined) await this.title.fill(values.title);
    if (values.description !== undefined) await this.description.fill(values.description);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  errorsFor(field: string): Locator {
    return this.form.locator(
      `[data-test-tpk-prefab-input-container="${field}"] [data-test-tpk-validation-errors], ` +
        `[data-test-tpk-prefab-textarea-container="${field}"] [data-test-tpk-validation-errors]`,
    );
  }
}
