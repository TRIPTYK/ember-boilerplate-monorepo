import { describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";
import { click, find, render } from "@ember/test-helpers";
import DummyFormComponent from "../../src/components/dummy-form.gts";

describe("Counter", () => {
  renderingTest("can interact", async () => {
    await render(<template><DummyFormComponent /></template>);

    expect(find("output")?.textContent).toBe("0");

    await click("button");

    expect(find("output")?.textContent).toBe("1");
  }, 50_000_000);
});
