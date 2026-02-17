import { describe, expect, test } from "vitest";
import { hashPassword, verifyPassword } from "#src/utils/auth.utils.js";

describe("auth.utils", () => {
  describe("hashPassword", () => {
    test("returns a hash different from the original password", async () => {
      const password = "mySecretPassword123";
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    test("returns different hashes for the same password (due to salt)", async () => {
      const password = "mySecretPassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    test("returns argon2 formatted hash", async () => {
      const password = "testPassword";
      const hash = await hashPassword(password);

      expect(hash).toMatch(/^\$argon2/);
    });
  });

  describe("verifyPassword", () => {
    test("returns true for matching password and hash", async () => {
      const password = "mySecretPassword123";
      const hash = await hashPassword(password);

      const result = await verifyPassword(hash, password);

      expect(result).toBe(true);
    });

    test("returns false for non-matching password", async () => {
      const password = "mySecretPassword123";
      const hash = await hashPassword(password);

      const result = await verifyPassword(hash, "wrongPassword");

      expect(result).toBe(false);
    });

    test("returns false for invalid hash format", async () => {
      const result = await verifyPassword("invalidHash", "password");

      expect(result).toBe(false);
    });

    test("returns false for empty hash", async () => {
      const result = await verifyPassword("", "password");

      expect(result).toBe(false);
    });
  });
});
