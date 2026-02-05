import { App } from "./app/app.js";
import { createApplicationContext } from "./app/application.context.js";
import { loadConfiguration } from "./configuration.js";

const configuration = loadConfiguration();

const app = await App.init(await createApplicationContext(configuration));

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", async () => {
    await app.stop();
  });
}

await app.start();
