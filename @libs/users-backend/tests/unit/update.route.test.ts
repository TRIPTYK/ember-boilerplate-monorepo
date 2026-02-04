import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateRoute } from "#src/routes/update.route.js";
import type { EntityRepository, EntityManager } from "@mikro-orm/core";
import type { UserEntityType } from "#src/entities/user.entity.js";

describe("UpdateRoute", () => {
  let updateRoute: UpdateRoute;
  let mockUserRepository: EntityRepository<UserEntityType>;
  let mockEm: EntityManager;

  beforeEach(() => {
    mockEm = {
      flush: vi.fn(),
    } as unknown as EntityManager;

    mockUserRepository = {
      findOne: vi.fn(),
      getEntityManager: vi.fn().mockReturnValue(mockEm),
    } as unknown as EntityRepository<UserEntityType>;

    updateRoute = new UpdateRoute(mockUserRepository);
  });

  describe("404 when user not found (defensive check)", () => {
    it("should return 404 when user passes auth but is not found in database", async () => {
      // User exists for auth middleware but findOne returns null (deleted between auth and handler)
      vi.mocked(mockUserRepository.findOne).mockResolvedValue(null);

      const mockRequest = {
        params: { id: "user-id" },
        user: { id: "user-id" }, // User passes auth (same ID)
        body: {
          data: {
            id: "user-id",
            type: "users",
            attributes: {
              email: "test@test.com",
              firstName: "Test",
              lastName: "User",
            },
          },
        },
      };

      const mockReply = {
        code: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
      };

      const mockFastify = {
        patch: vi.fn((path, options, handler) => {
          return handler(mockRequest, mockReply);
        }),
      };

      await updateRoute.routeDefinition(mockFastify as any);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({
              status: "404",
              code: "USER_NOT_FOUND",
            }),
          ]),
        }),
      );
    });
  });
});
