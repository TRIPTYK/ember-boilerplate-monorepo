import type { Locator, Page } from "@playwright/test";

/**
 * `TpkConfirmModalPrefab`, used by the users and todos tables before deleting.
 */
export class ConfirmModal {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator("[data-test-confirm-modal]");
  }

  get question(): Locator {
    return this.root.locator(".tpk-modal-title");
  }

  async confirm(): Promise<void> {
    await this.root.locator("[data-test-confirm-modal-confirm]").click();
  }

  async cancel(): Promise<void> {
    await this.root.locator("[data-test-confirm-modal-cancel]").click();
  }
}
