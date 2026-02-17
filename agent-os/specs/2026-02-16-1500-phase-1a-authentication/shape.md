# Phase 1A Authentication System — Shaping Notes

## Scope

Complete the authentication system for Registr by adding:
- **User Registration**: Backend endpoint (POST /api/v1/auth/register) + Ember.js form
- **Password Recovery**: Forgot password + reset password flow with email-based tokens

The existing JWT authentication infrastructure (login, logout, refresh) remains unchanged.

## Decisions

### Email Verification: Deferred to Phase 2
**Rationale**: Focus on core functionality first. Users can register and login immediately.
**Impact**: Simpler initial implementation, verification can be added later without breaking changes.

### Password Reset Token Expiration: 1 hour
**Rationale**: Balances security (short attack window) with UX (enough time to check email and act).
**Implementation**: Store SHA-256 hash, not plaintext. Use `hashToken()` utility from `token.utils.ts`.

### Auto-Login After Registration: No
**Rationale**: Clearer separation of concerns, explicit login reinforces credential creation.
**UX**: User registers → redirected to login with success message → explicit login.

### Token Storage: SHA-256 hashed in database
**Security**: Prevents token theft if database is compromised.
**Implementation**: Use `hashToken()` utility, never store plaintext tokens.

### Session Invalidation: Revoke all refresh tokens on password reset
**Security**: Force re-login on all devices after password change ensures immediate effect.
**Implementation**: Set `revokedAt` on all user's RefreshToken records.

### Email Enumeration Prevention: Always return success
**Security**: Prevent attackers from discovering valid email addresses in the system.
**Implementation**: Forgot password always returns 200 OK with same message, even if email doesn't exist.

## Context

### Visuals

Screenshots provided from existing React application:

1. **Login Page** (`visuals/login.png`):
   - Logo Registr
   - Title "Connexion"
   - Fields: Adresse email, Mot de passe
   - Link "Mot de passe oublié ?"
   - Blue button "CONNEXION"
   - Language switcher EN/FR

2. **Forgot Password Page** (`visuals/forgot-password.png`):
   - Logo Registr
   - Title "Réinitialiser le mot de passe"
   - Explanatory text
   - Field: Adresse email
   - Buttons: "ANNULER" (secondary) and "ENVOYER LE LIEN" (primary blue)
   - Language switcher EN/FR

**Design Notes**:
- Dark navy blue background (#0A1929 or similar)
- Primary action button: Light blue (#37BCF8 based on tech stack)
- Clean, professional, minimal design
- Forms centered on left side with hero image on right

### References

**Backend patterns to follow:**
- Login route: `@libs/users-backend/src/routes/login.route.ts`
- User entity: `@libs/users-backend/src/entities/user.entity.ts`
- JWT middleware: `@libs/users-backend/src/middlewares/jwt-auth.middleware.ts`
- Auth utilities: `@libs/users-backend/src/utils/auth.utils.ts`
- Token utilities: `@libs/users-backend/src/utils/token.utils.ts`
- Module init: `@libs/users-backend/src/init.ts`

**Frontend patterns to follow:**
- Login form: `@libs/users-front/src/components/forms/login-form.gts`
- Login validation: `@libs/users-front/src/components/forms/login-validation.ts`
- Login route: `@libs/users-front/src/routes/login.gts`
- Forgot password form (exists, needs onSubmit): `@libs/users-front/src/components/forms/forgot-password.gts`
- Session service: `@libs/users-front/src/services/session.ts`
- Auth handler: `@libs/users-front/src/handlers/auth.ts`
- Router configuration: `@libs/users-front/src/index.ts`
- MSW mocks: `@libs/users-front/src/http-mocks/login.ts`
- Translations: `@apps/front/translations/users/en-us.yaml` and `fr-fr.yaml`

### Product Alignment

**Mission**: Registr helps organizations maintain GDPR-compliant records with privacy-first, offline architecture.

**Roadmap Phase 1A**: Authentication system (registration + password recovery) is immediate priority, intentionally decoupled from treatment management for independent development and future scalability.

**Tech Stack**:
- **Frontend**: Ember.js with Vite, WarpDrive, ember-simple-auth
- **Backend**: Fastify with MikroORM, PostgreSQL
- **Two-tier database**: PostgreSQL for auth (centralized), SQLite WASM for treatment data (client-side, offline)
- **PWA**: Works offline after authentication
- **i18n**: FR/EN support required

## Standards Applied

### Backend Standards

- **entity-definitions** — PasswordResetToken uses MikroORM `defineEntity` functional API
- **route-structure** — Class-based routes with `Route<FastifyInstanceType>` interface and dependency injection
- **jwt-authentication** — Existing JWT patterns extended for new routes (access token 15min, refresh token 7 days)
- **password-hashing** — Argon2 for all passwords via `hashPassword()` and `verifyPassword()` utilities
- **json-api-serialization** — Manual serializers with Zod schemas for type-safe JSON:API responses
- **app-wiring** — Register new routes in AuthModule's `setupRoutes()` method
- **module-system** — Class-based module with static `init()` and `setupRoutes()`
- **error-format** — JSON:API error responses via `makeJsonApiError` and `handleJsonApiErrors`

### Frontend Standards

- **form-pattern** — Zod validation + ImmerChangeset + TpkForm component pattern
- **route-template** — Separate route handler (`.gts`) and template (`-template.gts`) files
- **http-mocks** — MSW mock handlers with `createOpenApiHttp<paths>()` for type safety
- **translations** — i18n keys in `@apps/front/translations/users/{locale}.yaml` with pattern `{entities}.{context}.{subcontext}.{key}`
- **schema-changeset** — WarpDrive schemas and ImmerChangeset for form state management

### Global Standards

- **feature-libraries** — Paired `users-backend` / `users-front` libraries
- **import-alias** — Use `#src/` instead of relative paths
- **post-implementation-checks** — Run `pnpm lint` globally and tests on modified packages after completion

## Architecture

### Two-Tier Database Architecture

```
PostgreSQL (Server)          SQLite WASM (Client)
├─ users                     ├─ treatments (future)
├─ refresh_tokens            ├─ finalités (future)
└─ password_reset_tokens     └─ données personnelles (future)
   (NEW)
```

**Rationale**:
- Authentication centralized for security and account management
- Treatment/compliance data stays on device for privacy and offline access
- Clear separation enables independent scaling and development

### Email Flow for Password Reset

```
1. User requests password reset
   ↓
2. Generate secure token (32 bytes hex = 64 chars)
   ↓
3. Hash with SHA-256, store in PasswordResetToken table
   ↓
4. Send email with link: ${APP_URL}/reset-password?token=${token}
   ↓
5. User clicks link
   ↓
6. Frontend extracts token from URL query params
   ↓
7. User submits new password
   ↓
8. Backend: Hash incoming token, lookup in DB
   ↓
9. Verify: exists, not expired (1 hour), not used (usedAt === null)
   ↓
10. Update password, mark token used, revoke all refresh tokens
```

### Security Layers

1. **Token hashing**: SHA-256 before database storage (never plaintext)
2. **Email enumeration prevention**: Same response for all emails (always 200 OK)
3. **Token expiration**: 1 hour window
4. **Token reuse prevention**: `usedAt` tracking
5. **Session invalidation**: Revoke all refresh tokens on password change
6. **Rate limiting** (future): 5 registrations/hour per IP, 3 forgot password/hour per email

### Error Handling

- Registration: Generic success even if email exists (prevent enumeration)
- Forgot password: Always success response (don't reveal if email found)
- Reset password: Clear error "Invalid or expired token" if validation fails
- All errors use JSON:API format with `message` and `code` fields

## Technical Specifications

### New Database Entity: PasswordResetToken

```typescript
{
  id: string (primary key)
  tokenHash: string (SHA-256 hash, indexed for fast lookup)
  userId: string (indexed for cleanup queries)
  email: string (for auditing and logging)
  expiresAt: date (indexed, 1 hour from creation)
  usedAt: date (nullable, marks token as consumed)
  createdAt: date (audit trail)
  ipAddress: string (nullable, security monitoring)
}
```

### API Endpoints

**Registration**:
- POST /api/v1/auth/register
- Body: `{ email, password, firstName, lastName }`
- Response: `{ data: { success: true } }`

**Forgot Password**:
- POST /api/v1/auth/forgot-password
- Body: `{ email }`
- Response: `{ data: { success: true } }` (always)

**Reset Password**:
- POST /api/v1/auth/reset-password
- Body: `{ token, password }`
- Response: `{ data: { success: true } }` or error

### Frontend Routes

- `/register` — User registration form
- `/forgot-password` — Email input for password reset (exists, needs implementation)
- `/reset-password?token=...` — New password form with token validation

## Implementation Notes

### Phase Approach

**Phase 0**: Create specification documentation (this document)
**Phase 1**: Backend foundation (entities, routes, email service, migration)
**Phase 2**: Frontend forms (registration, reset password, validation)
**Phase 3**: Integration (routing, mocks, translations)
**Phase 4**: Polish (navigation links, end-to-end testing)

### Estimated Effort

- Specification documentation: ~2 hours ✅
- Backend: ~8 hours
- Frontend: ~8 hours
- Integration & Testing: ~3 hours
- **Total: ~21 hours**

### Future Enhancements (Not in Scope)

- Email verification after registration
- Rate limiting on auth endpoints
- Audit logging for auth events
- Password complexity requirements (symbols, etc.)
- 2FA/MFA support
- Device management
- OAuth/Social login

---

*This specification serves as the source of truth for Phase 1A implementation. All decisions, patterns, and constraints are documented here for future reference by developers and AI agents.*
