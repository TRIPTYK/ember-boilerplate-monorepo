import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteRoute } from "#src/routes/delete.route.js";
import type { EntityRepository, EntityManager } from "@mikro-orm/core";
import type { UserEntityType } from "#src/entities/user.entity.js";

describe("DeleteRoute", () => {
  let deleteRoute: DeleteRoute;
  let mockUserRepository: EntityRepository<UserEntityType>;
  let mockEm: EntityManager;
  let mockFindOne: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockEm = {
      remove: vi.fn().mockReturnThis(),
      flush: vi.fn(),
    } as unknown as EntityManager;

    mockFindOne = vi.fn();
    mockUserRepository = {
      findOne: mockFindOne,
      getEntityManager: vi.fn().mockReturnValue(mockEm),
    } as unknown as EntityRepository<UserEntityType>;

    deleteRoute = new DeleteRoute(mockUserRepository);
  });

  describe("404 when user not found (defensive check)", () => {
    it("should return 404 when user passes auth but is not found in database", async () => {
      // User exists for auth middleware but findOne returns null (deleted between auth and handler)
      mockFindOne.mockResolvedValue(null);

      const mockRequest = {
        params: { id: "target-user-id" },
        user: { id: "current-user-id" }, // Different ID - current user trying to delete another user
      };

      const mockReply = {
        code: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
      };

      const mockFastify = {
        delete: vi.fn(async (path, options, handler) => {
          await handler(mockRequest, mockReply);
        }),
      };

      // eslint-disable-next-line @typescript-eslint/await-thenable
      await deleteRoute.routeDefinition(mockFastify as any);

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
