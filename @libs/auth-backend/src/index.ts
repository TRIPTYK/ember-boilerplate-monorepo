import { RefreshTokenEntity } from "#src/entities/refresh-token.entity.js";
import { PasswordResetTokenEntity } from "#src/entities/password-reset-token.entity.js";

export * from "#src/entities/refresh-token.entity.js";
export * from "#src/entities/password-reset-token.entity.js";
export * from "#src/routes/login.route.js";
export * from "#src/routes/logout.route.js";
export * from "#src/routes/refresh.route.js";
export * from "#src/routes/forgot-password.route.js";
export * from "#src/routes/reset-password.route.js";
export * from "#src/utils/token.utils.js";
export * from "#src/utils/jwt.utils.js";
export * from "#src/utils/auth.utils.js";
export * from "#src/utils/token-cleanup.utils.js";
export * from "#src/init.js";
export * from "#src/middlewares/jwt-auth.middleware.ts";
export * from "#src/context.js";
export type { FastifyInstanceTypeForModule } from "#src/init.js";

export const entities = [RefreshTokenEntity, PasswordResetTokenEntity];
