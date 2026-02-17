import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const RefreshTokenEntity = defineEntity({
  name: "RefreshToken",
  tableName: "refresh_tokens",
  properties: {
    id: p.string().primary(),
    tokenHash: p.string().index(),
    userId: p.string().index(),
    deviceInfo: p.string().nullable(),
    ipAddress: p.string().nullable(),
    userAgent: p.string().nullable(),
    issuedAt: p.datetime(),
    expiresAt: p.datetime().index(),
    revokedAt: p.datetime().nullable(),
    familyId: p.string().index(),
  },
});

export type RefreshTokenEntityType = InferEntity<typeof RefreshTokenEntity>;
