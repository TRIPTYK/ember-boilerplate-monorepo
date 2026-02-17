# JWT Authentication

Use JWT Bearer tokens for API authentication.

## Token Generation

```typescript
import { generateTokens } from "#src/utils/jwt.utils.js";

const { accessToken, refreshToken } = generateTokens(
  { userId: user.id, email: user.email },
  jwtSecret,
  jwtRefreshSecret
);
```

**Token expiry:**
- Access token: 15 minutes
- Refresh token: 7 days (stored as SHA-256 hash, supports rotation and theft detection)

**Payload structure:**
```typescript
interface JwtPayload {
  userId: string;
  email: string;
}
```

## Token Verification Middleware

```typescript
// Create middleware with dependencies
const jwtAuthMiddleware = createJwtAuthMiddleware(em, jwtSecret);

// Apply to protected routes via preValidation hook
f.addHook("preValidation", jwtAuthMiddleware);
```

The middleware:
1. Extracts Bearer token from `Authorization` header
2. Verifies token and decodes payload
3. Loads user from database
4. Attaches user to `request.user`

**Rules:**
- Always return both accessToken and refreshToken from login
- Store tokens client-side via ember-simple-auth session
- Re-login required when access token expires
- Use `JWT_SECRET` and `JWT_REFRESH_SECRET` env vars (must be different)
- Return 401 with `UNAUTHORIZED` code on auth failure

**Why:** Stateless authentication without server-side session storage.
