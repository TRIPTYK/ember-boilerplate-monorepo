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

test("ListRoute returns todos in JSON:API format with meta", async () => {
  await module.createTodo({
    title: "Test todo",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body).toHaveProperty("meta");
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.meta).toMatchObject({
    total: 1,
  });
  expect(body.data[0]).toMatchObject({
    type: "todos",
    attributes: {
      title: "Test todo",
    },
  });
});

test("ListRoute only returns todos for the current user", async () => {
  await module.createTodo({
    title: "My todo",
    userId: TestModule.TEST_USER_ID,
  });

  await module.createTodo({
    title: "Other user todo",
    userId: "other-user-id",
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.meta.total).toBe(1);
  expect(body.data[0].attributes.title).toBe("My todo");
});

test("ListRoute filters todos by search query", async () => {
  await module.createTodo({
    title: "Buy groceries",
    userId: TestModule.TEST_USER_ID,
  });

  await module.createTodo({
    title: "Write code",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos?filter[search]=Buy",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.meta.total).toBe(1);
  expect(body.data[0].attributes.title).toBe("Buy groceries");
});

test("ListRoute sorts todos ascending", async () => {
  await module.createTodo({
    title: "Alpha",
    userId: TestModule.TEST_USER_ID,
  });

  await module.createTodo({
    title: "Zulu",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos?sort=title",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.data[0].attributes.title).toBe("Alpha");
  expect(body.data[body.data.length - 1].attributes.title).toBe("Zulu");
});

test("ListRoute sorts todos descending", async () => {
  await module.createTodo({
    title: "Alpha",
    userId: TestModule.TEST_USER_ID,
  });

  await module.createTodo({
    title: "Zulu",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos?sort=-title",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.data[0].attributes.title).toBe("Zulu");
  expect(body.data[body.data.length - 1].attributes.title).toBe("Alpha");
});

test("ListRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos",
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

test("ListRoute ignores invalid sort field", async () => {
  await module.createTodo({
    title: "Test todo",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos?sort=invalidField",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data.length).toBeGreaterThan(0);
});
