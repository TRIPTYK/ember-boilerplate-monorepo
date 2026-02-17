# Plan: Phase 1A Authentication System with Formal Specification

## Context

Building the complete authentication system for Registr (Phase 1A) with formal shape-spec documentation. This plan follows the shape-spec pattern: create specification documentation first, then implement.

**Product Context:**
- **Mission**: Registr helps organizations maintain GDPR-compliant records with privacy-first, offline architecture
- **Roadmap Phase 1A**: Authentication system (registration + password recovery) is immediate priority, decoupled from treatment management
- **Tech Stack**: Ember.js + Fastify + PostgreSQL (auth) + SQLite WASM (future treatment data)

**Existing Infrastructure:**
- ✅ JWT authentication (login, logout, refresh) with 15min access tokens, 7-day refresh tokens
- ✅ User and RefreshToken entities with Argon2 password hashing
- ✅ ember-simple-auth on frontend with session management
- ✅ Protected routes with JWT middleware
- ✅ Email configuration ready (SMTP, nodemailer, mailgen)
- ✅ Form validation with Zod and @triptyk/ember-input-validation
- ✅ Internationalization (FR/EN) with ember-intl
- ✅ Module-based architecture (@libs/users-backend, @libs/users-front)

**What We're Building:**
1. **Specification Documentation**: Formal shape-spec docs in `agent-os/specs/`
2. **User Registration**: Backend endpoint + Ember.js form
3. **Password Recovery**: Forgot password + reset password flow with email tokens

**Architecture Decision:**
- Authentication logic separated into `@libs/auth-backend` and `@libs/auth-front`
- User management remains in `@libs/users-backend` and `@libs/users-frontend`
- Authentication data in PostgreSQL (centralized for security)
- Future treatment/compliance data will use SQLite WASM (client-side, offline)
- Email verification deferred to Phase 2 to focus on core functionality

**Key Design Decisions:**
- Password reset token expiration: 1 hour (security vs UX balance)
- Token storage: SHA-256 hash (never plaintext)
- Email enumeration prevention: Always return success response
- Auto-login after registration: No (explicit login reinforces credentials)
- Session invalidation: Revoke all refresh tokens on password reset

---

## Implementation Plan

### Task 1: Create Formal Specification Documentation

**Purpose:** Create discoverable shape-spec documentation before implementation. Future developers (and AI agents) can reference this to understand decisions and patterns.

**Create directory:** `agent-os/specs/2026-02-16-1500-phase-1a-authentication/`

**Files to create:**

#### 1.1 shape.md
Document scope, decisions, context, and standards applied. Include:
- Scope: Registration + password recovery
- Key decisions with rationale (token expiration, email enumeration, etc.)
- References to existing code patterns
- Product alignment notes
- Applied standards list

#### 1.2 standards.md
Include full content of relevant standards:
- Backend: entity-definitions, route-structure, jwt-authentication, password-hashing, json-api-serialization, app-wiring, module-system, error-format
- Frontend: form-pattern, route-template, http-mocks, translations, schema-changeset
- Global: feature-libraries, import-alias, post-implementation-checks

#### 1.3 references.md
Document reference implementations studied:
- Backend: login.route.ts, user.entity.ts, jwt-auth.middleware.ts, auth.utils.ts, token.utils.ts, init.ts
- Frontend: login-form.gts, login-validation.ts, login.gts, forgot-password.gts, session.ts, auth.ts (handler), router config, MSW mocks, translations

#### 1.4 plan.md
Copy of this implementation plan (Tasks 2-20)

#### 1.5 visuals/ (if provided)
Directory for mockups/wireframes provided by user

**Verification:**
- [ ] Spec directory created at `agent-os/specs/2026-02-16-1500-phase-1a-authentication/`
- [ ] All spec files present and complete
- [ ] Standards content copied correctly
- [ ] References documented with file paths

---

### Task 2: Backend - Password Reset Token Entity

**Create:** `@libs/auth-backend/src/entities/password-reset-token.entity.ts`

**Purpose:** Store password reset tokens securely for the forgot password flow.

**Schema:**
```typescript
{
  id: string (primary key)
  tokenHash: string (SHA-256 hash, indexed)
  userId: string (indexed)
  email: string (for auditing)
  expiresAt: date (indexed, 1 hour TTL)
  usedAt: date (nullable, prevents reuse)
  createdAt: date
  ipAddress: string (nullable, for security monitoring)
}
```

**Key Points:**
- Store SHA-256 hash of token, never plaintext
- 1-hour expiration balances security and UX
- Track usage to prevent token replay attacks

---

### Task 3: Backend - Email Service

**Create:** `@libs/backend-shared/src/services/email.service.ts`

**Purpose:** Centralized email sending using nodemailer + mailgen for transactional emails.

**Methods:**
```typescript
class EmailService {
  sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<void>
  sendWelcomeEmail(email: string, firstName: string): Promise<void>  // Future use
}
```

**Configuration:**
- Use existing SMTP environment variables
- Mailgen for branded HTML email templates
- Reset URL: `${APP_URL}/reset-password?token=${token}`

**Template:**
- Password reset button with 1-hour expiration notice
- Security note: "If you didn't request this, ignore this email"

---

### Task 4: Backend - User Registration Route

**Create:** `@libs/auth-backend/src/routes/register.route.ts`

**Endpoint:** `POST /api/v1/auth/register`

**Request Schema (Zod):**
```typescript
{
  email: email (validated, must be unique)
  password: string (min 8 chars)
  firstName: string (min 2 chars)
  lastName: string (min 2 chars)
}
```

**Flow:**
1. Validate input with Zod schema
2. Check email uniqueness in database
3. Hash password with Argon2
4. Create User entity
5. Return success (no auto-login - user must explicitly login)

**Security:**
- Return generic success even if email exists (prevent email enumeration)
- Recommendation: Add rate limiting (5 registrations per IP per hour) in Phase 9

**Response (JSON:API format):**
```json
{
  "data": { "success": true }
}
```

---

### Task 5: Backend - Forgot Password Route

**Create:** `@libs/auth-backend/src/routes/forgot-password.route.ts`

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Request Schema:**
```typescript
{
  email: email
}
```

**Flow:**
1. Accept email address
2. Lookup user by email
3. Generate secure random token: `randomBytes(32).toString('hex')`
4. Hash token (SHA-256) and store in PasswordResetToken table with 1-hour expiration
5. Send email with reset link using EmailService
6. **Always return success** (even if email not found - security)

**Security:**
- Always return 200 OK to prevent email enumeration
- Token: 64-character hex string (256 bits of entropy)
- Store only hash in database
- Rate limit recommendation: 3 requests per email per hour

**Response:**
```json
{
  "data": { "success": true }
}
```

---

### Task 6: Backend - Reset Password Route

**Create:** `@libs/auth-backend/src/routes/reset-password.route.ts`

**Endpoint:** `POST /api/v1/auth/reset-password`

**Request Schema:**
```typescript
{
  token: string (64-char hex from email link)
  password: string (min 8 chars)
}
```

**Flow:**
1. Hash received token (SHA-256)
2. Lookup token in PasswordResetToken table
3. Validate: token exists, not expired, not used (`usedAt === null`)
4. Update user password with new Argon2 hash
5. Mark token as used (`usedAt = now`)
6. **Revoke all user refresh tokens** (force re-login on all devices)
7. Return success

**Security:**
- Token validation prevents replay attacks
- Session invalidation ensures password change is effective immediately
- Clear error messages: "Invalid or expired token" if validation fails

**Response:**
```json
{
  "data": { "success": true }
}
```

---

### Task 7: Backend - Wire Up New Routes

**Modify:** `@libs/auth-backend/src/init.ts`

**Changes:**
1. Import new route classes
2. Add to `authRoutes` array:
   - `new RegisterRoute(...)`
   - `new ForgotPasswordRoute(...)`
   - `new ResetPasswordRoute(...)`
3. Pass EmailService to routes via context

**Update Context:**
- Modify `AuthLibraryContext` interface to include `emailService: EmailService`
- Initialize EmailService in `createContext()` function

---

### Task 8: Backend - Database Migration

**Command:** `pnpm mikro-orm schema:update --run`

**Purpose:** Create `password_reset_tokens` table with indexes on `tokenHash`, `userId`, `expiresAt`

**Verify:** Check database has new table with correct schema

---

### Task 9: Frontend - Registration Form Component

**Create:** `@libs/auth-front/src/components/forms/register-form.gts`

**Pattern:** Follow existing `login-form.gts` structure using `TpkLoginForm`

**Fields:**
- Email (TpkEmailPrefab)
- Password (TpkPasswordPrefab)
- First Name (TpkInputPrefab)
- Last Name (TpkInputPrefab)

**Validation:**
- Use Zod schema from `register-validation.ts`
- Password requirements: min 8 chars, 1 uppercase, 1 number

**On Submit:**
```typescript
POST /api/v1/auth/register
→ Success: Flash message + redirect to /login
→ Error: Display error message
```

---

### Task 9: Frontend - Registration Validation Schema

**Create:** `@libs/auth-front/src/components/forms/register-validation.ts`

**Schema:**
```typescript
object({
  email: email(intl.t('validation.invalidEmail')),
  password: string()
    .min(8, intl.t('validation.passwordTooShort'))
    .regex(/[A-Z]/, intl.t('validation.passwordUppercase'))
    .regex(/[0-9]/, intl.t('validation.passwordNumber')),
  firstName: string().min(2, intl.t('validation.firstNameRequired')),
  lastName: string().min(2, intl.t('validation.lastNameRequired')),
})
```

---

### Task 10: Frontend - Registration Route

**Create:**
- `@libs/auth-front/src/routes/register.gts` (route class)
- `@libs/auth-front/src/routes/register-template.gts` (template)

**Route Configuration:**
- Path: `/register`
- Guard: `prohibitAuthentication()` (redirect logged-in users to dashboard)
- Layout: Use `AuthLayout` component (same as login)

**Template:**
- Render `RegisterForm` component
- Link to login: "Already have an account? Login"

---

### Task 11: Frontend - Implement Forgot Password Submit Logic

**Modify:** `@libs/auth-front/src/components/forms/forgot-password-form.gts`

**Current State:** Template exists but `onSubmit` is empty

**Implementation:**
```typescript
onSubmit = async (data: { email: string }) => {
  try {
    await fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    this.flashMessages.success(
      this.intl.t('users.forgotPassword.checkEmail')
    );
    this.router.transitionTo('login');
  } catch (error) {
    this.flashMessages.error(
      this.intl.t('users.forgotPassword.error')
    );
  }
};
```

**Note:** Always show success message for security (don't reveal if email exists)

---

### Task 12: Frontend - Reset Password Form Component

**Create:** `@libs/auth-front/src/components/forms/reset-password-form.gts`

**Props:**
- `@token` (string from URL query param)

**Fields:**
- Password (TpkPasswordPrefab)
- Confirm Password (TpkPasswordPrefab)

**Validation:**
- Password min 8 chars, 1 uppercase, 1 number
- Passwords must match (Zod refine)

**On Submit:**
```typescript
POST /api/v1/auth/reset-password { token, password }
→ Success: Flash message + redirect to /login
→ Error: Display "Invalid or expired token"
```

---

### Task 13: Frontend - Reset Password Validation Schema

**Create:** `@libs/auth-front/src/components/forms/reset-password-validation.ts`

**Schema:**
```typescript
object({
  password: string().min(8, intl.t('validation.passwordTooShort')),
  confirmPassword: string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: intl.t('validation.passwordsDontMatch'),
    path: ['confirmPassword'],
  }
)
```

---

### Task 14: Frontend - Reset Password Route

**Create:**
- `@libs/auth-front/src/routes/reset-password.gts` (route class)
- `@libs/auth-front/src/routes/reset-password-template.gts` (template)

**Route Configuration:**
- Path: `/reset-password`
- Guard: `prohibitAuthentication()`
- Extract token from query params: `queryParams.token`

**Template:**
- Render `ResetPasswordForm` with `@token={{this.queryParams.token}}`
- If no token in URL: show error message

---

### Task 15: Frontend - Update Router Configuration

**Modify:** `@libs/auth-front/src/index.ts`

**Add to `authRoutes` function:**
```typescript
export function authRoutes(this: DSL) {
  this.route('login');
  this.route('register');           // NEW
  this.route('forgot-password');    // Already exists, ensure it's here
  this.route('reset-password');     // NEW
  this.route('logout');
}
```

---

### Task 16: Frontend - Add MSW Mocks for Development

**Modify:** `@libs/auth-front/src/http-mocks/auth.ts`

**Add Mock Handlers:**
```typescript
export default [
  http.post('/api/v1/auth/login', ...existing),

  // NEW MOCKS
  http.post('/api/v1/auth/register', () => {
    return HttpResponse.json({ data: { success: true } });
  }),

  http.post('/api/v1/auth/forgot-password', () => {
    return HttpResponse.json({ data: { success: true } });
  }),

  http.post('/api/v1/auth/reset-password', () => {
    return HttpResponse.json({ data: { success: true } });
  }),
];
```

**Purpose:** Allow frontend development/testing without backend

---

### Task 17: Frontend - Add Translations (English)

**Modify:** `@apps/front/translations/users/en-us.yaml`

**Add:**
```yaml
forms:
  register:
    title: 'Create Account'
    labels:
      email: 'Email Address'
      password: 'Password'
      firstName: 'First Name'
      lastName: 'Last Name'
    actions:
      submit: 'Register'
      haveAccount: 'Already have an account?'
      login: 'Login'
    validation:
      invalidEmail: 'Please enter a valid email address'
      passwordTooShort: 'Password must be at least 8 characters'
      passwordUppercase: 'Password must contain an uppercase letter'
      passwordNumber: 'Password must contain a number'
      firstNameRequired: 'First name is required (min 2 characters)'
      lastNameRequired: 'Last name is required (min 2 characters)'
    messages:
      success: 'Registration successful! Please login.'
      error: 'Registration failed. Please try again.'

  forgotPassword:
    title: 'Forgot Password'
    labels:
      email: 'Email Address'
    actions:
      submit: 'Send Reset Link'
      backToLogin: 'Back to Login'
    messages:
      checkEmail: 'If an account exists with that email, you will receive a password reset link.'
      error: 'Something went wrong. Please try again.'

  resetPassword:
    title: 'Reset Password'
    labels:
      password: 'New Password'
      confirmPassword: 'Confirm Password'
    actions:
      submit: 'Reset Password'
    validation:
      passwordTooShort: 'Password must be at least 8 characters'
      passwordsDontMatch: 'Passwords do not match'
    messages:
      success: 'Password reset successfully! Please login with your new password.'
      invalidToken: 'Invalid or expired reset link. Please request a new one.'
      error: 'Password reset failed. Please try again.'
```

---

### Task 18: Frontend - Add Translations (French)

**Modify:** `@apps/front/translations/users/fr-fr.yaml`

**Add:** French translations mirroring the English structure above

**Key Translations:**
- "Create Account" → "Créer un compte"
- "Forgot Password" → "Mot de passe oublié"
- "Reset Password" → "Réinitialiser le mot de passe"
- "Send Reset Link" → "Envoyer le lien de réinitialisation"
- etc.

---

### Task 19: Frontend - Update Login Page with Register Link

**Modify:** `@libs/users-front/src/routes/login-template.gts`

**Add Below Login Form:**
```handlebars
<div class="text-center mt-4">
  <p>
    {{t "users.forms.login.noAccount"}}
    <LinkTo @route="register" class="text-blue-500 hover:underline">
      {{t "users.forms.login.register"}}
    </LinkTo>
  </p>
</div>
```

**Add to Translations:**
```yaml
forms:
  login:
    noAccount: "Don't have an account?"
    register: "Register"
```

---

## Verification Plan

After implementation, test the complete flows:

### 1. Registration Flow
- [ ] Navigate to `/register`
- [ ] Fill form with valid data
- [ ] Submit → redirected to login with success message
- [ ] Login with new credentials → success
- [ ] Try registering with same email → error (backend prevents duplicate)

### 2. Password Recovery Flow
- [ ] Navigate to `/forgot-password`
- [ ] Enter valid email → success message shown
- [ ] Check email inbox for reset link
- [ ] Click reset link → redirected to `/reset-password?token=...`
- [ ] Enter new password → success, redirected to login
- [ ] Login with new password → success
- [ ] Try using same token again → error (token marked as used)

### 3. Security Validation
- [ ] Forgot password with non-existent email → same success message (no enumeration)
- [ ] Reset password with expired token → error message
- [ ] Reset password with invalid token → error message
- [ ] After password reset, old refresh tokens are invalid (forced re-login)

### 4. Frontend Validation
- [ ] Registration form validates email format
- [ ] Password requirements enforced (8 chars, uppercase, number)
- [ ] Confirm password must match on reset form
- [ ] Flash messages appear correctly
- [ ] Translations work in both FR and EN

### 5. Development Mocks
- [ ] MSW mocks work when `VITE_MOCK_API=true`
- [ ] Can test entire frontend flow without backend running

---

## Critical Files Reference

**Backend:**
- `@libs/auth-backend/src/entities/password-reset-token.entity.ts`
- `@libs/backend-shared/src/services/email.service.ts`
- `@libs/auth-backend/src/routes/register.route.ts`
- `@libs/auth-backend/src/routes/forgot-password.route.ts`
- `@libs/auth-backend/src/routes/reset-password.route.ts`
- `@libs/auth-backend/src/init.ts`

**Frontend:**
- `@libs/auth-front/src/components/forms/register-form.gts`
- `@libs/auth-front/src/components/forms/register-validation.ts`
- `@libs/auth-front/src/components/forms/forgot-password-form.gts`
- `@libs/auth-front/src/components/forms/reset-password-form.gts`
- `@libs/auth-front/src/components/forms/reset-password-validation.ts`
- `@libs/auth-front/src/routes/register.gts`
- `@libs/auth-front/src/routes/reset-password.gts`
- `@libs/auth-front/src/index.ts` (router config)
- `@libs/auth-front/src/http-mocks/auth.ts`
- `@apps/front/translations/auth/en-us.yaml` (to be created)
- `@apps/front/translations/auth/fr-fr.yaml` (to be created)

---

## Implementation Order

**Phase 0: Specification Documentation (Task 1)**
Create formal shape-spec documentation before implementation.

**Phase 1: Backend Foundation (Tasks 2-8)**
Build backend API first to enable frontend integration testing.

**Phase 2: Frontend Forms (Tasks 9-15)**
Build registration and password reset UI.

**Phase 3: Integration (Tasks 16-19)**
Wire up routing, mocks, and translations.

**Phase 4: Polish (Task 20 + Verification)**
Add navigation links and test complete flows.

---

## Security Best Practices Summary

1. ✅ Token hashing (SHA-256) before database storage
2. ✅ Email enumeration prevention (same response for all emails)
3. ✅ Short token expiration (1 hour)
4. ✅ Token reuse prevention (usedAt tracking)
5. ✅ Session invalidation on password change
6. ✅ Argon2 password hashing
7. ✅ Input validation (Zod on frontend and backend)
8. 🔄 Rate limiting (recommended for Phase 9)
9. 🔄 Audit logging (recommended for Phase 9)

---

## Future Enhancements (Deferred)

- **Email Verification:** Require users to verify email before full access
- **Rate Limiting:** Prevent brute force attacks
- **Audit Logging:** Track auth events for security monitoring
- **Password Complexity:** Additional requirements (symbols, length)
- **2FA/MFA:** Two-factor authentication support
- **Device Management:** View and revoke active sessions
- **OAuth/Social Login:** Google, GitHub, etc.

---

## Estimated Effort

- Specification documentation: ~2 hours
- Backend: ~8 hours (entities, routes, email service, testing)
- Frontend: ~8 hours (forms, routes, translations, testing)
- Integration & Testing: ~3 hours
- **Total: ~21 hours** for Phase 1A with formal specification

This represents a solid, well-documented foundation for Registr's authentication layer, with security best practices, discoverable specifications, and room for future enhancements.
