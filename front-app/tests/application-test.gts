import { describe, expect } from "vitest";
import { applicationTest } from "ember-vitest";
import { visit } from "@ember/test-helpers";
import App from "#app/app.ts";

describe("Home", () => {
  applicationTest.scoped({ app: ({}, use) => use(App) });

  applicationTest("can visit the home screen", async ({ element }) => {
    await visit("/");
    expect(element.textContent.trim()).toBe("Welcome to Ember");
  });
});
