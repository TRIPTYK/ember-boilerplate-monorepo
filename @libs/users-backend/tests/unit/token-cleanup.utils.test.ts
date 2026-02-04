import { describe, it, expect, vi, beforeEach } from "vitest";
import { cleanupExpiredTokens } from "#src/utils/token-cleanup.utils.js";
import type { EntityManager, EntityRepository } from "@mikro-orm/core";
import type { RefreshTokenEntityType } from "#src/index.js";

describe("cleanupExpiredTokens", () => {
  let mockEm: EntityManager;
  let mockRefreshTokenRepo: EntityRepository<RefreshTokenEntityType>;

  beforeEach(() => {
    mockRefreshTokenRepo = {
      nativeDelete: vi.fn(),
    } as unknown as EntityRepository<RefreshTokenEntityType>;

    mockEm = {
      getRepository: vi.fn().mockReturnValue(mockRefreshTokenRepo),
    } as unknown as EntityManager;
  });

  it("should delete expired tokens and return count", async () => {
    vi.mocked(mockRefreshTokenRepo.nativeDelete).mockResolvedValue(5);

    const result = await cleanupExpiredTokens(mockEm);

    expect(result).toBe(5);
    expect(mockEm.getRepository).toHaveBeenCalled();
    expect(mockRefreshTokenRepo.nativeDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.arrayContaining([
          expect.objectContaining({ expiresAt: expect.any(Object) }),
          expect.objectContaining({ revokedAt: expect.any(Object) }),
        ]),
      }),
    );
  });

  it("should return 0 when no tokens to delete", async () => {
    vi.mocked(mockRefreshTokenRepo.nativeDelete).mockResolvedValue(0);

    const result = await cleanupExpiredTokens(mockEm);

    expect(result).toBe(0);
  });
});
