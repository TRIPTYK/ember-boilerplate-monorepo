import { describe, it, expect, vi, beforeEach } from "vitest";
import { cleanupExpiredTokens } from "#src/utils/token-cleanup.utils.js";
import type { EntityManager, EntityRepository } from "@mikro-orm/core";
import type { RefreshTokenEntityType } from "#src/entities/refresh-token.entity.js";

describe("cleanupExpiredTokens", () => {
  let mockEm: EntityManager;
  let mockRefreshTokenRepo: EntityRepository<RefreshTokenEntityType>;
  let mockNativeDelete: ReturnType<typeof vi.fn>;
  let mockGetRepository: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockNativeDelete = vi.fn();
    mockRefreshTokenRepo = {
      nativeDelete: mockNativeDelete,
    } as unknown as EntityRepository<RefreshTokenEntityType>;

    mockGetRepository = vi.fn().mockReturnValue(mockRefreshTokenRepo);
    mockEm = {
      getRepository: mockGetRepository,
    } as unknown as EntityManager;
  });

  it("should delete expired tokens and return count", async () => {
    mockNativeDelete.mockResolvedValue(5);

    const result = await cleanupExpiredTokens(mockEm);

    expect(result).toBe(5);
    expect(mockGetRepository).toHaveBeenCalled();
    expect(mockNativeDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.arrayContaining([
          expect.objectContaining({ expiresAt: expect.any(Object) }),
          expect.objectContaining({ revokedAt: expect.any(Object) }),
        ]),
      }),
    );
  });

  it("should return 0 when no tokens to delete", async () => {
    mockNativeDelete.mockResolvedValue(0);

    const result = await cleanupExpiredTokens(mockEm);

    expect(result).toBe(0);
  });
});
