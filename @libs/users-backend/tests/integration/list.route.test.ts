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

test("ListRoute returns users in JSON:API format with meta", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/users",
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
    type: "users",
    id: TestModule.TEST_USER_ID,
    attributes: {
      email: "a@test.com",
      firstName: "Test",
      lastName: "User",
    },
  });
});

test("ListRoute filters users by search query", async () => {
  await module.createUser({
    id: "alice-id",
    email: "alice@test.com",
    firstName: "Alice",
    lastName: "Smith",
    password: "testpassword",
  });

  await module.createUser({
    id: "bob-id",
    email: "bob@test.com",
    firstName: "Bob",
    lastName: "Jones",
    password: "testpassword",
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/users?filter[search]=Alice",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.meta.total).toBe(1);
  expect(body.data[0].attributes.firstName).toBe("Alice");
});

test("ListRoute sorts users ascending", async () => {
  await module.createUser({
    id: "alice-id",
    email: "alice@test.com",
    firstName: "Alice",
    lastName: "Smith",
    password: "testpassword",
  });

  await module.createUser({
    id: "zoe-id",
    email: "zoe@test.com",
    firstName: "Zoe",
    lastName: "Adams",
    password: "testpassword",
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/users?sort=firstName",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.data[0].attributes.firstName).toBe("Alice");
  expect(body.data[body.data.length - 1].attributes.firstName).toBe("Zoe");
});

test("ListRoute sorts users descending", async () => {
  await module.createUser({
    id: "alice-id",
    email: "alice@test.com",
    firstName: "Alice",
    lastName: "Smith",
    password: "testpassword",
  });

  await module.createUser({
    id: "zoe-id",
    email: "zoe@test.com",
    firstName: "Zoe",
    lastName: "Adams",
    password: "testpassword",
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/users?sort=-firstName",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.data[0].attributes.firstName).toBe("Zoe");
  expect(body.data[body.data.length - 1].attributes.firstName).toBe("Alice");
});

test("ListRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/users",
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
  await module.createUser({
    id: "alice-id",
    email: "alice@test.com",
    firstName: "Alice",
    lastName: "Smith",
    password: "testpassword",
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/users?sort=invalidField",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data.length).toBeGreaterThan(0);
});
