import { App } from "./app/app.js";
import { createApplicationContext } from "./app/application.context.js";
import { loadConfiguration } from "./configuration.js";

// vite-node re-executes this module in the same process on every HMR full
// reload. Vite does not await `vite:beforeFullReload` handlers, so the previous
// instance hands its shutdown over here and we wait for the port to be released
// before listening again.
const hmrState = globalThis as typeof globalThis & {
  __backendShutdown?: Promise<void>;
};

await hmrState.__backendShutdown;

const configuration = loadConfiguration();

const app = await App.init(await createApplicationContext(configuration));

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    console.log("Stopping server before full reload...");
    hmrState.__backendShutdown = app.stop().catch((error: unknown) => {
      console.error("Failed to stop server before full reload:", error);
    });
  });
}

await app.start();
