import { App } from "./app/app.js";
import { createApplicationContext } from "./app/application.context.js";
import { loadConfiguration } from "./configuration.js";

const configuration = loadConfiguration();

const app = await App.init(await createApplicationContext(configuration));

await app.start();
