import { afterAll, aroundEach, beforeAll, expect as hardExpect } from "vitest";
import { test } from "vitest";
import { TestModule } from "#tests/utils/setup-module.js";

const expect = hardExpect.soft;

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

test("GetRoute returns todo in JSON:API format", async () => {
  await module.createTodo({
    id: "todo-1",
    title: "Test todo",
    description: "A description",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos/todo-1",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toMatchObject({
    type: "todos",
    id: "todo-1",
    attributes: {
      title: "Test todo",
      description: "A description",
      completed: false,
    },
  });
});

test("GetRoute returns JSON:API error when todo not found", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos/nonexistent-id",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(Array.isArray(body.errors)).toBe(true);
  expect(body.errors[0]).toMatchObject({
    status: "404",
    title: "Not Found",
    code: "TODO_NOT_FOUND",
    detail: "Todo with id nonexistent-id not found",
  });
});

test("GetRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos/todo-1",
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Unauthorized",
    code: "UNAUTHORIZED",
    detail: "Missing or invalid authorization header",
  });
});

test("GetRoute returns 404 when todo belongs to another user", async () => {
  await module.createTodo({
    id: "other-todo",
    title: "Other user todo",
    userId: "other-user-id",
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos/other-todo",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "404",
    title: "Not Found",
    code: "TODO_NOT_FOUND",
  });
});
