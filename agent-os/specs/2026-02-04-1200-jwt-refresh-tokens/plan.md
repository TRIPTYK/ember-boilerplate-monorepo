# JWT Refresh Token Implementation Plan

## Summary

Implement server-side JWT refresh token storage with token rotation, logout invalidation, and multi-device support for the `@libs/users-backend` module.

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-02-04-1200-jwt-refresh-tokens/` with:

- **plan.md** — This full plan
- **shape.md** — Shaping notes (scope, decisions, context)
- **standards.md** — Relevant backend standards
- **references.md** — Pointers to reference implementations

---

## Task 2: Create Token Utilities

**File:** `@libs/users-backend/src/utils/token.utils.ts` (new)

Create utility functions for token hashing:

```typescript
import { createHash, randomBytes } from "crypto";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateFamilyId(): string {
  return randomBytes(16).toString("hex");
}
```

**Why SHA-256 instead of Argon2:** Refresh tokens are already high-entropy random values. SHA-256 is fast enough for validation on every request.

---

## Task 3: Implement RefreshTokenEntity

**File:** `@libs/users-backend/src/entities/refresh-token.entity.ts` (exists, empty)

```typescript
import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const RefreshTokenEntity = defineEntity({
  name: "RefreshToken",
  tableName: "refresh_tokens",
  properties: {
    id: p.string().primary(),
    tokenHash: p.string().index(),        // SHA-256 hash of token
    userId: p.string().index(),           // Foreign key to User
    deviceInfo: p.string().nullable(),    // Optional device name
    ipAddress: p.string().nullable(),     // Client IP
    userAgent: p.string().nullable(),     // Browser/client info
    issuedAt: p.date(),
    expiresAt: p.date().index(),
    revokedAt: p.date().nullable(),
    familyId: p.string().index(),         // Token rotation chain ID
  },
});

export type RefreshTokenEntityType = InferEntity<typeof RefreshTokenEntity>;
```

---

## Task 4: Update Login Route

**File:** `@libs/users-backend/src/routes/login.route.ts`

Changes:
1. Add `EntityManager` as constructor dependency
2. Add optional `deviceInfo` field in request body
3. Store refresh token hash in database after generating tokens
4. Generate new `familyId` for each login

Key additions:
```typescript
// After generating tokens, store refresh token
const tokenHash = hashToken(tokens.refreshToken);
refreshTokenRepo.create({
  id: randomUUID(),
  tokenHash,
  userId: user.id,
  deviceInfo: deviceInfo ?? null,
  ipAddress: request.ip,
  userAgent: request.headers["user-agent"] ?? null,
  issuedAt: new Date(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  revokedAt: null,
  familyId: generateFamilyId(),
});
```

---

## Task 5: Create Refresh Route

**File:** `@libs/users-backend/src/routes/refresh.route.ts` (new)

**Endpoint:** `POST /auth/refresh`

**Request:**
```json
{ "refreshToken": "eyJhbGc..." }
```

**Response:**
```json
{ "data": { "accessToken": "...", "refreshToken": "..." } }
```

**Logic:**
1. Verify JWT signature
2. Look up token in DB by hash
3. If token revoked → invalidate entire family (security)
4. Verify user still exists
5. Revoke old token, issue new token pair (rotation)
6. Store new refresh token with same `familyId`

---

## Task 6: Create Logout Route

**File:** `@libs/users-backend/src/routes/logout.route.ts` (new)

**Endpoint:** `POST /auth/logout`

**Request:**
```json
{ "refreshToken": "...", "allDevices": false }
```

**Response:**
```json
{ "data": { "success": true, "message": "Logged out successfully" } }
```

**Logic:**
- `allDevices: false` → Revoke only provided token
- `allDevices: true` → Revoke all tokens for user

---

## Task 7: Update Module Setup

**File:** `@libs/users-backend/src/init.ts`

1. Import new routes and entity
2. Add `RefreshRoute` and `LogoutRoute` to `authRoutes` array
3. Update `LoginRoute` constructor to include `this.context.em`

---

## Task 8: Update Exports

**File:** `@libs/users-backend/src/index.ts`

Add exports:
```typescript
export * from "#src/entities/refresh-token.entity.js";
export * from "#src/routes/refresh.route.js";
export * from "#src/routes/logout.route.js";
export * from "#src/utils/token.utils.js";
```

---

## Task 9: Create Token Cleanup Utility

**File:** `@libs/users-backend/src/utils/token-cleanup.utils.ts` (new)

Utility for cleaning expired tokens (call from scheduled job):

```typescript
export async function cleanupExpiredTokens(em: EntityManager): Promise<number> {
  // Delete expired tokens and tokens revoked > 30 days ago
}
```

---

## Task 10: Database Migration

Run MikroORM migration to create `refresh_tokens` table:

```bash
cd @apps/backend && pnpm mikro-orm migration:create --name add-refresh-tokens
```

---

## Critical Files

| File | Action |
|------|--------|
| `@libs/users-backend/src/entities/refresh-token.entity.ts` | Implement (empty) |
| `@libs/users-backend/src/routes/login.route.ts` | Modify |
| `@libs/users-backend/src/routes/refresh.route.ts` | Create |
| `@libs/users-backend/src/routes/logout.route.ts` | Create |
| `@libs/users-backend/src/utils/token.utils.ts` | Create |
| `@libs/users-backend/src/init.ts` | Modify |
| `@libs/users-backend/src/index.ts` | Modify |

---

## Reusable Patterns

- **Entity definition:** Follow `user.entity.ts` pattern with `defineEntity()` and `p.*` properties
- **Route class:** Follow `login.route.ts` pattern with Zod schemas
- **Module wiring:** Follow `init.ts` pattern for registering routes under `/auth` prefix
- **JWT utilities:** Reuse existing `generateTokens`, `verifyRefreshToken` from `jwt.utils.ts`
- **Password hashing:** Reuse `verifyPassword` from `auth.utils.ts`

---

## Security Features

1. **Token hashing:** Store SHA-256 hash, not raw token
2. **Token rotation:** New refresh token on each refresh, old one revoked
3. **Family invalidation:** If revoked token reused, entire family revoked (detects theft)
4. **Multi-device:** Each login creates new token family

---

## Verification

1. **Run backend:** `pnpm dev` in `@apps/backend`
2. **Test login:** `POST /auth/login` returns both tokens
3. **Test refresh:** `POST /auth/refresh` returns new token pair
4. **Test rotation:** Old refresh token should fail after refresh
5. **Test logout:** `POST /auth/logout` should invalidate token
6. **Test all-devices logout:** Verify all sessions invalidated
7. **Run tests:** `pnpm test` in `@libs/users-backend`
