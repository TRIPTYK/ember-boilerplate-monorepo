import { testEnv } from "@tests/utils/test-app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { App, type FastifyInstanceType } from "../../src/app/app.js";

describe("App Integration Tests", () => {
  let app: App;
  let fastifyInstance: FastifyInstanceType;

  beforeAll(async () => {
    app = await testEnv().then((t) => t.app);
    fastifyInstance = app["fastify"];
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
});
