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

test("DeleteRoute deletes a todo and returns 204", async () => {
  await module.createTodo({
    id: "todo-1",
    title: "Todo to delete",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "DELETE",
    url: "/todos/todo-1",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(204);
  expect(response.body).toBe("");
});

test("DeleteRoute returns JSON:API error when todo not found", async () => {
  const response = await module.fastifyInstance.inject({
    method: "DELETE",
    url: "/todos/nonexistent-id",
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
    detail: "Todo with id nonexistent-id not found",
  });
});

test("DeleteRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "DELETE",
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

test("DeleteRoute returns 404 when todo belongs to another user", async () => {
  await module.createTodo({
    id: "other-todo",
    title: "Other user todo",
    userId: "other-user-id",
  });

  const response = await module.fastifyInstance.inject({
    method: "DELETE",
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
