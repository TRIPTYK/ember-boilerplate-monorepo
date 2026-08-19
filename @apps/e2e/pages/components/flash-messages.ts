import type { Locator, Page } from "@playwright/test";

/**
 * The `ember-cli-flash` queue rendered by `@apps/front/app/templates/application.gts`.
 */
export class FlashMessages {
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator(".alerts");
  }

  get all(): Locator {
    return this.root.locator(".flash-message");
  }

  get success(): Locator {
    return this.root.locator(".flash-message.alert-success");
  }

  get error(): Locator {
    return this.root.locator(".flash-message.alert-danger");
  }

  withText(text: string): Locator {
    return this.all.filter({ hasText: text });
  }
}
