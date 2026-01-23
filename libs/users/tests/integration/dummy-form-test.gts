import { describe } from "vitest";
import { renderingTest } from "ember-vitest";
import { render } from "@ember/test-helpers";
import DummyFormComponent from "../../src/components/dummy-form.gts";

describe("Counter", () => {
  // Optional: only needed if your component needs access to application state
  // renderingTest.scoped({ app: ({}, use) => use(App) });

  renderingTest("can interact", async () => {
    await render(<template><DummyFormComponent /></template>);
  });
});
