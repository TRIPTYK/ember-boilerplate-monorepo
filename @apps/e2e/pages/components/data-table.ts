import type { Locator, Page } from "@playwright/test";

/**
 * `TableGenericPrefab` — the table shared by the users and todos lists.
 *
 * Rows are addressed by the entity id exposed as `data-test-row`, which is the
 * only stable handle: sort order, page size and column content all change.
 */
export class DataTable {
  readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator("[data-test-table-generic-prefab]");
  }

  get rows(): Locator {
    return this.root.locator("[data-test-table] tbody tr[data-test-row]");
  }

  /** The row for a known entity id. */
  row(id: string): Locator {
    return this.root.locator(`[data-test-table] tbody tr[data-test-row="${id}"]`);
  }

  /** The row(s) whose cells contain `text` — use for data a test just created. */
  rowsWith(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  /** The id of the single row containing `text`. Fails if there is not exactly one. */
  async idOfRowWith(text: string): Promise<string> {
    const row = this.rowsWith(text);
    await row.waitFor();
    const id = await row.getAttribute("data-test-row");
    if (!id) {
      throw new Error(`Row containing "${text}" has no data-test-row id`);
    }
    return id;
  }

  get emptyMessage(): Locator {
    return this.root.locator("[data-test-table] tbody").getByText("No results");
  }

  get searchInput(): Locator {
    return this.root.locator('input[type="search"]');
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.root.locator("[data-test-search-submit]").click();
  }

  /**
   * Open a row's action menu and run one entry by its visible label
   * (`Edit`, `Delete`, `Change the status of the todo`, …).
   */
  async runRowAction(row: Locator, label: string): Promise<void> {
    await row.locator("[data-test-actions-open-action]").click();
    await row.locator("[data-test-actions-list] button").filter({ hasText: label }).click();
  }

  /** Sort by clicking a column header. Clicking twice reverses the direction. */
  async sortBy(headerName: string): Promise<void> {
    await this.root.locator("[data-test-table] thead th").filter({ hasText: headerName }).click();
  }

  get paginationSummary(): Locator {
    return this.root.locator("[data-test-pagination-result]");
  }

  async setPageSize(size: number): Promise<void> {
    await this.root.locator("[data-test-pagination-select]").selectOption(String(size));
  }
}
