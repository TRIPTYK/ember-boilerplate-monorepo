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

test("UpdateRoute updates user and returns JSON:API format", async () => {
  const response = await module.fastifyInstance.inject({
    method: "PATCH",
    url: `/users/${TestModule.TEST_USER_ID}`,
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
    payload: {
      data: {
        id: TestModule.TEST_USER_ID,
        type: "users",
        attributes: {
          email: "updated@test.com",
          firstName: "Updated",
          lastName: "Name",
        },
      },
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toMatchObject({
    type: "users",
    id: TestModule.TEST_USER_ID,
    attributes: {
      email: "updated@test.com",
      firstName: "Updated",
      lastName: "Name",
    },
  });
});

test("UpdateRoute returns JSON:API error when user not found", async () => {
  const response = await module.fastifyInstance.inject({
    method: "PATCH",
    url: "/users/nonexistent-id",
    headers: {
      authorization: module.generateBearerToken("nonexistent-id"),
    },
    payload: {
      data: {
        id: "nonexistent-id",
        type: "users",
        attributes: {
          email: "test@test.com",
          firstName: "Test",
          lastName: "User",
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
    detail: "User not found",
  });
});

test("UpdateRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "PATCH",
    url: `/users/${TestModule.TEST_USER_ID}`,
    payload: {
      data: {
        id: TestModule.TEST_USER_ID,
        type: "users",
        attributes: {
          email: "updated@test.com",
          firstName: "Updated",
          lastName: "User",
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
