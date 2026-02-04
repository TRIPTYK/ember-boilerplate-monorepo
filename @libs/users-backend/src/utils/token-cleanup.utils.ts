import type { EntityManager } from "@mikro-orm/core";
import { RefreshTokenEntity } from "#src/entities/refresh-token.entity.js";

export async function cleanupExpiredTokens(em: EntityManager): Promise<number> {
  const refreshTokenRepo = em.getRepository(RefreshTokenEntity);
  const now = new Date().toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Delete expired tokens and tokens revoked more than 30 days ago
  const result = await refreshTokenRepo.nativeDelete({
    $or: [{ expiresAt: { $lt: now } }, { revokedAt: { $lt: thirtyDaysAgo } }],
  } as Parameters<typeof refreshTokenRepo.nativeDelete>[0]);

  return result;
}
