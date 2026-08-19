import { createDatabaseConnection } from "#src/app/database.connection.js";
import { registerRequestContext } from "@libs/backend-shared";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import { fastify } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("registerRequestContext", () => {
  let orm: MikroORM;

  beforeAll(async () => {
    orm = await createDatabaseConnection({ DATABASE_URI: process.env.TEST_DATABASE_URL ?? "" });
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("rejects a forked EntityManager", () => {
    expect(() => registerRequestContext(fastify(), orm.em.fork())).toThrow(/root `orm.em`/);
  });

  it("gives every request its own forked EntityManager", async () => {
    const instance = fastify();
    registerRequestContext(instance, orm.em);

    instance.get("/context", () => ({
      contextId: RequestContext.currentRequestContext()?.id ?? null,
      isFork: orm.em.getContext() !== orm.em,
      contextIsGlobal: orm.em.getContext().global,
    }));

    const first = await instance.inject({ method: "GET", url: "/context" }).then((r) => r.json());
    const second = await instance.inject({ method: "GET", url: "/context" }).then((r) => r.json());

    expect(first.contextId).not.toBeNull();
    expect(second.contextId).not.toBeNull();
    expect(first.contextId).not.toBe(second.contextId);

    expect(first.isFork).toBe(true);
    expect(first.contextIsGlobal).toBe(false);

    await instance.close();
  });
});
