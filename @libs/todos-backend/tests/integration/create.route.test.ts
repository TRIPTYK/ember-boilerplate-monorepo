import { afterAll, aroundEach, beforeAll, expect, test } from "vitest";
import { TestModule } from "#tests/utils/setup-module.js";

let module: TestModule;

beforeAll(async () => {
  module = await TestModule.init();
});

afterAll(async () => {
  await module.close();
});

aroundEach(async (runTest) => {
  await module.em.begin();
  await runTest();
  await module.em.rollback();
});

test("CreateRoute creates a todo and returns JSON:API format", async () => {
  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/todos",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
    payload: {
      data: {
        type: "todos",
        attributes: {
          title: "My new todo",
          description: "A description",
        },
      },
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toMatchObject({
    type: "todos",
    id: expect.any(String),
    attributes: {
      title: "My new todo",
      description: "A description",
      completed: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});

test("CreateRoute returns JSON:API error on validation failure", async () => {
  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/todos",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
    payload: {
      data: {
        type: "todos",
        attributes: {},
      },
    },
  });

  expect(response.statusCode).toBe(400);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(Array.isArray(body.errors)).toBe(true);
  expect(body.errors.length).toBeGreaterThan(0);
  expect(body.errors[0]).toMatchObject({
    status: "400",
    title: "Validation Error",
    detail: expect.any(String),
    source: {
      pointer: expect.any(String),
    },
  });
});

test("CreateRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/todos",
    payload: {
      data: {
        type: "todos",
        attributes: {
          title: "My new todo",
        },
      },
    },
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Unauthorized",
    code: "UNAUTHORIZED",
  });
});
