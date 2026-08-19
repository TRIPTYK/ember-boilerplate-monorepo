import { testEnv } from "#tests/utils/test-app.js";
import { RequestContext } from "@mikro-orm/core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { App, type FastifyInstanceType } from "../../src/app/app.js";

describe("App Integration Tests", () => {
  let app: App;
  let fastifyInstance: FastifyInstanceType;
  let seenRequestContext: unknown;

  beforeAll(async () => {
    app = await testEnv().then((t) => t.app);
    fastifyInstance = app["fastify"];

    // Must stay in `beforeAll`: `App.init` does not call `ready()`, but Fastify
    // refuses `addHook` once the first `inject()` has started the instance.
    fastifyInstance.addHook("preHandler", async () => {
      seenRequestContext = RequestContext.currentRequestContext();
    });
  });

  afterAll(async () => {
    await app.stop();
  });

  it("should return 200 for status route", async () => {
    const response = await fastifyInstance.inject({
      method: "GET",
      url: "/api/v1/status",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });

  it("opens a MikroORM RequestContext for every request", () => {
    expect(seenRequestContext).toBeDefined();
  });
});
