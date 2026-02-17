import { describe, expect, test, vi, afterEach } from "vitest";
import { generateTokens, verifyAccessToken, verifyRefreshToken } from "#src/utils/jwt.utils.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "testAccessSecret";
const JWT_REFRESH_SECRET = "testRefreshSecret";

describe("jwt.utils", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("generateTokens", () => {
    test("returns both access and refresh tokens", () => {
      const payload = { userId: "user-123", email: "test@example.com" };

      const result = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    test("access token contains correct payload", () => {
      const payload = { userId: "user-123", email: "test@example.com" };

      const { accessToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);
      const decoded = jwt.verify(accessToken, JWT_SECRET) as { userId: string; email: string };

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    test("refresh token contains correct payload", () => {
      const payload = { userId: "user-123", email: "test@example.com" };

      const { refreshToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
        userId: string;
        email: string;
      };

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    test("access token has shorter expiry than refresh token", () => {
      const payload = { userId: "user-123", email: "test@example.com" };

      const { accessToken, refreshToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);
      const accessDecoded = jwt.decode(accessToken) as { exp: number };
      const refreshDecoded = jwt.decode(refreshToken) as { exp: number };

      expect(accessDecoded.exp).toBeLessThan(refreshDecoded.exp);
    });

    test("access and refresh tokens use different secrets", () => {
      const payload = { userId: "user-123", email: "test@example.com" };

      const { accessToken, refreshToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);

      expect(() => jwt.verify(accessToken, JWT_REFRESH_SECRET)).toThrow();
      expect(() => jwt.verify(refreshToken, JWT_SECRET)).toThrow();
    });
  });

  describe("verifyAccessToken", () => {
    test("returns payload for valid token", () => {
      const payload = { userId: "user-123", email: "test@example.com" };
      const { accessToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);

      const result = verifyAccessToken(accessToken, JWT_SECRET);

      expect(result).not.toBeNull();
      expect(result?.userId).toBe(payload.userId);
      expect(result?.email).toBe(payload.email);
    });

    test("returns null for invalid token", () => {
      const result = verifyAccessToken("invalid.token.here", JWT_SECRET);

      expect(result).toBeNull();
    });

    test("returns null for token signed with wrong secret", () => {
      const payload = { userId: "user-123", email: "test@example.com" };
      const { accessToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);

      const result = verifyAccessToken(accessToken, "wrongSecret");

      expect(result).toBeNull();
    });

    test("returns null for expired token", () => {
      const payload = { userId: "user-123", email: "test@example.com" };
      const expiredToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "-1s" });

      const result = verifyAccessToken(expiredToken, JWT_SECRET);

      expect(result).toBeNull();
    });

    test("returns null for refresh token used as access token", () => {
      const payload = { userId: "user-123", email: "test@example.com" };
      const { refreshToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);

      const result = verifyAccessToken(refreshToken, JWT_SECRET);

      expect(result).toBeNull();
    });
  });

  describe("verifyRefreshToken", () => {
    test("returns payload for valid token", () => {
      const payload = { userId: "user-123", email: "test@example.com" };
      const { refreshToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);

      const result = verifyRefreshToken(refreshToken, JWT_REFRESH_SECRET);

      expect(result).not.toBeNull();
      expect(result?.userId).toBe(payload.userId);
      expect(result?.email).toBe(payload.email);
    });

    test("returns null for invalid token", () => {
      const result = verifyRefreshToken("invalid.token.here", JWT_REFRESH_SECRET);

      expect(result).toBeNull();
    });

    test("returns null for token signed with wrong secret", () => {
      const payload = { userId: "user-123", email: "test@example.com" };
      const { refreshToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);

      const result = verifyRefreshToken(refreshToken, "wrongSecret");

      expect(result).toBeNull();
    });

    test("returns null for expired token", () => {
      const payload = { userId: "user-123", email: "test@example.com" };
      const expiredToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "-1s" });

      const result = verifyRefreshToken(expiredToken, JWT_REFRESH_SECRET);

      expect(result).toBeNull();
    });

    test("returns null for access token used as refresh token", () => {
      const payload = { userId: "user-123", email: "test@example.com" };
      const { accessToken } = generateTokens(payload, JWT_SECRET, JWT_REFRESH_SECRET);

      const result = verifyRefreshToken(accessToken, JWT_REFRESH_SECRET);

      expect(result).toBeNull();
    });
  });
});
