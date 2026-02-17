import { writeFileSync } from "node:fs";
import { App } from "./app/app.js";
import { createApplicationContext } from "./app/application.context.js";
import { loadConfiguration } from "./configuration.js";

const app = await App.init(await createApplicationContext(loadConfiguration()));

await app["fastify"].ready();

const document = app["fastify"].swagger();

writeFileSync("./openapi.json", JSON.stringify(document, null, 2));

await app.stop();
