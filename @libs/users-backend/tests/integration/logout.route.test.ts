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

test("LogoutRoute successfully logs out with valid refresh token", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);
  await module.storeRefreshToken(TestModule.TEST_USER_ID, refreshToken);

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/logout",
    payload: {
      refreshToken,
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toMatchObject({
    success: true,
    message: "Logged out successfully",
  });
});

test("LogoutRoute logs out from all devices when allDevices is true", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);
  await module.storeRefreshToken(TestModule.TEST_USER_ID, refreshToken);

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/logout",
    payload: {
      refreshToken,
      allDevices: true,
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toMatchObject({
    success: true,
    message: "Logged out from all devices",
  });
});

test("LogoutRoute returns JSON:API error on invalid token signature", async () => {
  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/logout",
    payload: {
      refreshToken: "invalid-token",
    },
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(Array.isArray(body.errors)).toBe(true);
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Invalid Token",
    code: "INVALID_TOKEN",
    detail: "Invalid or expired refresh token",
  });
});

test("LogoutRoute returns JSON:API error when token not found in database", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);
  // Not storing the token in database

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/logout",
    payload: {
      refreshToken,
    },
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Token Not Found",
    code: "TOKEN_NOT_FOUND",
    detail: "Refresh token not found",
  });
});
