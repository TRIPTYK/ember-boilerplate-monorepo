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

test("GetRoute returns user in JSON:API format", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: `/users/${TestModule.TEST_USER_ID}`,
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toMatchObject({
    type: "users",
    id: TestModule.TEST_USER_ID,
    attributes: {
      email: "a@test.com",
      firstName: "Test",
      lastName: "User",
    },
  });
});

test("GetRoute returns JSON:API error when user not found", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/users/nonexistent-id",
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
    code: "USER_NOT_FOUND",
    detail: "User with id nonexistent-id not found",
  });
});

test("GetRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: `/users/${TestModule.TEST_USER_ID}`,
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

test("GetRoute returns JSON:API error on invalid token", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: `/users/${TestModule.TEST_USER_ID}`,
    headers: {
      authorization: "Bearer invalid-token",
    },
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Unauthorized",
    code: "UNAUTHORIZED",
    detail: "Invalid or expired token",
  });
});
