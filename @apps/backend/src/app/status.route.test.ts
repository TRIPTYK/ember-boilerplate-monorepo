import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { statusRoute } from "./status.route.js";
import { fastifyTestInstance } from "#tests/utils/fastify-instance.js";
import type { FastifyInstanceType } from "#src/app/app.js";

describe("statusRoute", () => {
  let fastifyInstance: FastifyInstanceType;

  beforeAll(() => {
    fastifyInstance = fastifyTestInstance();
    statusRoute(fastifyInstance);
  });

  afterAll(async () => {
    await fastifyInstance.close();
  });

  it("should return status ok", async () => {
    const response = await fastifyInstance.inject({
      method: "GET",
      url: "/status",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });
});
