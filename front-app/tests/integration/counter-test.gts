import { describe, expect } from "vitest";
import { renderingTest } from "ember-vitest";
import { find, click, render } from "@ember/test-helpers";
import CounterComponent from "front-app/components/counter.gts";

describe("Counter", () => {
  renderingTest("can interact", async () => {
    await render(<template><CounterComponent /></template>);
    expect(find("output")?.textContent).toBe("0");
    await click("button");
    expect(find("output")?.textContent).toBe("1");
  });
});
