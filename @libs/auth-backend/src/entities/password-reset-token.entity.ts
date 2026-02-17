import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const PasswordResetTokenEntity = defineEntity({
  name: "PasswordResetToken",
  tableName: "password_reset_tokens",
  properties: {
    id: p.string().primary(),
    tokenHash: p.string().index(),
    userId: p.string().index(),
    email: p.string(),
    expiresAt: p.datetime().index(),
    usedAt: p.datetime().nullable(),
    createdAt: p.datetime(),
  },
});

export type PasswordResetTokenEntityType = InferEntity<typeof PasswordResetTokenEntity>;
