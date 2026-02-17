import { describe, expect, test } from "vitest";
import { hashToken, generateFamilyId } from "#src/utils/token.utils.js";

describe("token.utils", () => {
  describe("hashToken", () => {
    test("returns a SHA256 hex string", () => {
      const token = "someRefreshToken123";
      const hash = hashToken(token);

      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    test("returns consistent hash for same input", () => {
      const token = "someRefreshToken123";
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);

      expect(hash1).toBe(hash2);
    });

    test("returns different hashes for different inputs", () => {
      const hash1 = hashToken("token1");
      const hash2 = hashToken("token2");

      expect(hash1).not.toBe(hash2);
    });

    test("handles empty string", () => {
      const hash = hashToken("");

      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    test("handles special characters", () => {
      const token = "token!@#$%^&*()_+-=[]{}|;':\",./<>?";
      const hash = hashToken(token);

      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe("generateFamilyId", () => {
    test("returns a 32-character hex string", () => {
      const familyId = generateFamilyId();

      expect(familyId).toMatch(/^[a-f0-9]{32}$/);
    });

    test("generates unique IDs on each call", () => {
      const ids = new Set<string>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        ids.add(generateFamilyId());
      }

      expect(ids.size).toBe(iterations);
    });

    test("returns string type", () => {
      const familyId = generateFamilyId();

      expect(typeof familyId).toBe("string");
    });
  });
});
