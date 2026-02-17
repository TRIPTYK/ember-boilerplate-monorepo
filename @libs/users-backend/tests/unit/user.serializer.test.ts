import { describe, it, expect } from "vitest";
import {
  jsonApiSerializeUser,
  jsonApiSerializeManyUsers,
  jsonApiSerializeSingleUserDocument,
  jsonApiSerializeManyUsersDocument,
} from "#src/serializers/user.serializer.js";
import type { UserEntityType } from "#src/entities/user.entity.js";

describe("user.serializer", () => {
  const mockUser: UserEntityType = {
    id: "user-1",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "hashedpassword",
  };

  const mockUsers: UserEntityType[] = [
    mockUser,
    {
      id: "user-2",
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Smith",
      password: "hashedpassword2",
    },
  ];

  describe("jsonApiSerializeUser", () => {
    it("should serialize a user to JSON:API format", () => {
      const result = jsonApiSerializeUser(mockUser);

      expect(result).toEqual({
        id: "user-1",
        type: "users",
        attributes: {
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      });
    });

    it("should not include password in serialized output", () => {
      const result = jsonApiSerializeUser(mockUser);

      expect(result).not.toHaveProperty("password");
      expect(result.attributes).not.toHaveProperty("password");
    });
  });

  describe("jsonApiSerializeManyUsers", () => {
    it("should serialize multiple users to JSON:API format", () => {
      const result = jsonApiSerializeManyUsers(mockUsers);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: "user-1",
        type: "users",
      });
      expect(result[1]).toMatchObject({
        id: "user-2",
        type: "users",
      });
    });

    it("should return empty array for empty input", () => {
      const result = jsonApiSerializeManyUsers([]);

      expect(result).toEqual([]);
    });
  });

  describe("jsonApiSerializeSingleUserDocument", () => {
    it("should wrap serialized user in data property", () => {
      const result = jsonApiSerializeSingleUserDocument(mockUser);

      expect(result).toHaveProperty("data");
      expect(result.data).toMatchObject({
        id: "user-1",
        type: "users",
        attributes: {
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      });
    });
  });

  describe("jsonApiSerializeManyUsersDocument", () => {
    it("should wrap serialized users array in data property", () => {
      const result = jsonApiSerializeManyUsersDocument(mockUsers);

      expect(result).toHaveProperty("data");
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it("should return empty data array for empty input", () => {
      const result = jsonApiSerializeManyUsersDocument([]);

      expect(result).toEqual({ data: [] });
    });
  });
});
