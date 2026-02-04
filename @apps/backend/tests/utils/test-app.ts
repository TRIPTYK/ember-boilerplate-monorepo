import { App } from "#src/app/app.js";
import { getTestContext } from "./test-context.js";

export interface TestEnv {
  app: App;
}

export async function testEnv(): Promise<TestEnv> {
  const context = await getTestContext();
  return {
    app: await App.init(context.context),
  };
}
