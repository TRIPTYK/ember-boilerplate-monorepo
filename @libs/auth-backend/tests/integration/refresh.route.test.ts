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

test("RefreshRoute returns new tokens on valid refresh token", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);
  await module.storeRefreshToken(TestModule.TEST_USER_ID, refreshToken);

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: {
      refreshToken,
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toHaveProperty("accessToken");
  expect(body.data).toHaveProperty("refreshToken");
  expect(typeof body.data.accessToken).toBe("string");
  expect(typeof body.data.refreshToken).toBe("string");
});

test("RefreshRoute returns JSON:API error on invalid token signature", async () => {
  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/refresh",
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

test("RefreshRoute returns JSON:API error when token not found in database", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/refresh",
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

test("RefreshRoute returns JSON:API error when token is revoked", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);
  await module.storeRefreshToken(TestModule.TEST_USER_ID, refreshToken, { revoked: true });

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: {
      refreshToken,
    },
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Token Revoked",
    code: "TOKEN_REVOKED",
    detail: "Token has been revoked",
  });
});

test("RefreshRoute returns JSON:API error when token is expired in database", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);
  await module.storeRefreshToken(TestModule.TEST_USER_ID, refreshToken, { expired: true });

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: {
      refreshToken,
    },
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Token Expired",
    code: "TOKEN_EXPIRED",
    detail: "Refresh token has expired",
  });
});

test("RefreshRoute returns JSON:API error when user not found", async () => {
  const refreshToken = module.generateRefreshToken("nonexistent-user-id");
  await module.storeRefreshToken("nonexistent-user-id", refreshToken);

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: {
      refreshToken,
    },
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "User Not Found",
    code: "USER_NOT_FOUND",
    detail: "User not found",
  });
});

test("RefreshRoute works without user-agent header", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);
  await module.storeRefreshToken(TestModule.TEST_USER_ID, refreshToken);

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/refresh",
    headers: {
      "user-agent": undefined,
    },
    payload: {
      refreshToken,
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toHaveProperty("accessToken");
  expect(body.data).toHaveProperty("refreshToken");
});

test("RefreshRoute revokes old token and creates new one", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);
  await module.storeRefreshToken(TestModule.TEST_USER_ID, refreshToken);

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: {
      refreshToken,
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  const newRefreshToken = body.data.refreshToken;

  const refreshTokenRepo = module.em.getRepository(
    (await import("#src/entities/refresh-token.entity.js")).RefreshTokenEntity,
  );
  const { hashToken } = await import("#src/utils/token.utils.js");
  const oldTokenHash = hashToken(refreshToken);
  const newTokenHash = hashToken(newRefreshToken);

  const oldToken = await refreshTokenRepo.findOne({ tokenHash: oldTokenHash });
  const newToken = await refreshTokenRepo.findOne({ tokenHash: newTokenHash });

  expect(oldToken?.revokedAt).not.toBeNull();
  expect(newToken).not.toBeNull();
  expect(newToken?.revokedAt).toBeNull();
});

test("RefreshRoute maintains familyId across token refresh", async () => {
  const refreshToken = module.generateRefreshToken(TestModule.TEST_USER_ID);
  await module.storeRefreshToken(TestModule.TEST_USER_ID, refreshToken);

  const refreshTokenRepo = module.em.getRepository(
    (await import("#src/entities/refresh-token.entity.js")).RefreshTokenEntity,
  );
  const { hashToken } = await import("#src/utils/token.utils.js");
  const oldTokenHash = hashToken(refreshToken);
  const oldToken = await refreshTokenRepo.findOne({ tokenHash: oldTokenHash });
  const originalFamilyId = oldToken?.familyId;

  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/auth/refresh",
    payload: {
      refreshToken,
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  const newRefreshToken = body.data.refreshToken;
  const newTokenHash = hashToken(newRefreshToken);
  const newToken = await refreshTokenRepo.findOne({ tokenHash: newTokenHash });

  expect(newToken?.familyId).toBe(originalFamilyId);
});
