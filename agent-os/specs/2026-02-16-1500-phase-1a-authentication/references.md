# References for Phase 1A Authentication System

These are the existing implementations in the codebase that serve as patterns and references for building the authentication system.

---

## Backend Implementations

### Login Route
**Location:** `@libs/users-backend/src/routes/login.route.ts`

**Relevance:** Primary template for registration route structure

**Key Patterns:**
- Class-based route implementing `Route<FastifyInstanceType>` interface
- Constructor receives `EntityManager` and `configuration` via dependency injection
- Zod schema for body validation with email and password fields
- Argon2 password verification using `verifyPassword()` utility
- JWT token generation with `generateTokens()` utility
- Refresh token storage with family ID for rotation detection
- JSON:API response format
- Error handling for invalid credentials

**Code Structure:**
```typescript
export class LoginRoute implements Route<FastifyInstanceType> {
  constructor(private em: EntityManager, private configuration: Configuration) {}

  routeDefinition(f: FastifyInstanceType) {
    return f.post("/", { schema: { ... } }, async (request, reply) => {
      // 1. Validate email/password from body
      // 2. Look up user by email
      // 3. Verify password with Argon2
      // 4. Generate JWT tokens
      // 5. Store refresh token hash in database
      // 6. Return tokens in JSON:API format
    });
  }
}
```

---

### User Entity
**Location:** `@libs/users-backend/src/entities/user.entity.ts`

**Relevance:** Existing user model that registration will create instances of

**Key Patterns:**
- MikroORM `defineEntity` functional API (not decorators)
- Properties: `id`, `email`, `firstName`, `lastName`, `password`
- Uses `p.string().primary()` for ID
- Email indexed for fast lookups
- Password stored as hashed string (never plaintext)
- Inferred type export: `UserEntityType`
- `tableName` set to `"users"`

**Schema:**
```typescript
export const UserEntity = defineEntity({
  name: "User",
  tableName: "users",
  properties: {
    id: p.string().primary(),
    email: p.string().index(),
    firstName: p.string(),
    lastName: p.string(),
    password: p.string(),
  },
});

export type UserEntityType = InferEntity<typeof UserEntity>;
```

---

### RefreshToken Entity
**Location:** `@libs/users-backend/src/entities/refresh-token.entity.ts`

**Relevance:** Pattern for PasswordResetToken entity structure

**Key Patterns:**
- Stores token as SHA-256 hash (never plaintext)
- Indexed fields for fast queries: `tokenHash`, `userId`, `expiresAt`
- Includes audit fields: `createdAt`, `revokedAt`, `usedAt`
- Security metadata: `deviceInfo`, `ipAddress`, `userAgent`
- Family ID for token rotation detection

**Similar Pattern Needed for PasswordResetToken:**
```typescript
export const PasswordResetTokenEntity = defineEntity({
  name: "PasswordResetToken",
  tableName: "password_reset_tokens",
  properties: {
    id: p.string().primary(),
    tokenHash: p.string().index(),
    userId: p.string().index(),
    email: p.string(),
    expiresAt: p.date().index(),
    usedAt: p.date().nullable(),
    createdAt: p.date(),
    ipAddress: p.string().nullable(),
  },
});
```

---

### JWT Utilities
**Location:** `@libs/users-backend/src/utils/jwt.utils.ts`

**Relevance:** Token generation patterns (needed for understanding but not directly used in registration)

**Key Patterns:**
- `generateTokens()` creates access + refresh token pairs
- Access token: 15 minutes expiration
- Refresh token: 7 days expiration
- Payload: `{ userId: string, email: string }`
- Uses `jsonwebtoken` library
- Separate secrets: `JWT_SECRET` and `JWT_REFRESH_SECRET`

---

### Auth Utilities
**Location:** `@libs/users-backend/src/utils/auth.utils.ts`

**Relevance:** Password hashing for registration

**Key Patterns:**
- `hashPassword(password: string): Promise<string>` — Argon2 hashing
- `verifyPassword(hash: string, password: string): Promise<boolean>` — Argon2 verification
- Uses `argon2` package with secure defaults
- Never use argon2 directly, always use these utilities

**Usage in Registration:**
```typescript
const hashedPassword = await hashPassword(body.password);
```

---

### Token Utilities
**Location:** `@libs/users-backend/src/utils/token.utils.ts`

**Relevance:** Token hashing for password reset tokens

**Key Patterns:**
- `hashToken(token: string): string` — SHA-256 hashing
- `generateFamilyId(): string` — Cryptographic ID generation
- Uses `crypto` module for secure randomness
- Hash tokens before storing in database

**Usage in Password Reset:**
```typescript
import { randomBytes } from 'crypto';
import { hashToken } from '#src/utils/token.utils.js';

// Generate token
const token = randomBytes(32).toString('hex'); // 64 chars

// Hash before storing
const tokenHash = hashToken(token);

// Send token in email, store tokenHash in database
```

---

### JWT Middleware
**Location:** `@libs/users-backend/src/middlewares/jwt-auth.middleware.ts`

**Relevance:** Pattern for protecting routes (not needed for auth routes, but reference for future)

**Key Patterns:**
- Factory function: `createJwtAuthMiddleware(em: EntityManager, jwtSecret: string)`
- Extracts `Bearer` token from `Authorization` header
- Verifies and decodes JWT
- Loads user from database using `userId` from token
- Attaches user to `request.user`
- Returns 401 for missing/invalid/expired tokens

**Applied to Routes:**
```typescript
f.addHook("preValidation", jwtAuthMiddleware);
```

---

### Module Init
**Location:** `@libs/users-backend/src/init.ts`

**Relevance:** Where to register new routes

**Key Patterns:**
- `AuthModule` class implementing `ModuleInterface<FastifyInstanceType>`
- Static `init()` method: `public static init(context: LibraryContext): Module`
- Constructor forks EntityManager: `this.em = em.fork()`
- `setupRoutes(fastify)` method registers all routes
- Routes collected in array: `const authRoutes: Route<...>[] = [...]`
- Loop through routes: `route.routeDefinition(f)`

**Where to Add New Routes:**
```typescript
const authRoutes: Route<FastifyInstanceType>[] = [
  new LoginRoute(em, configuration),
  new RefreshRoute(em, configuration),
  new LogoutRoute(em, configuration),
  // ADD HERE:
  new RegisterRoute(em, configuration),
  new ForgotPasswordRoute(em, configuration, emailService),
  new ResetPasswordRoute(em, configuration),
];
```

---

## Frontend Implementations

### Login Form
**Location:** `@libs/users-front/src/components/forms/login-form.gts`

**Relevance:** Primary template for registration form structure

**Key Patterns:**
- Uses `TpkLoginForm` component wrapper (not regular `TpkForm`)
- Service injections: `@service declare session: SessionService`
- Service injections: `@service declare router: RouterService`
- Service injections: `@service declare flashMessages: FlashMessageService`
- Service injections: `@service declare intl: IntlService`
- `onSubmit` handler with async/await
- Session authentication via `session.authenticate()`
- Flash messages for success/error: `flashMessages.success()` / `flashMessages.error()`
- Route transition after success: `router.transitionTo('dashboard')`
- Data test attribute: `data-test-login-form`

**Component Structure:**
```typescript
export default class LoginForm extends Component {
  @service declare session: SessionService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;

  onSubmit = async (data) => {
    try {
      await this.session.authenticate('authenticator:token', data);
      await this.router.transitionTo('dashboard');
    } catch (error) {
      this.flashMessages.error(this.intl.t('users.forms.login.messages.error'));
    }
  };

  <template>
    <TpkLoginForm @onSubmit={{this.onSubmit}} data-test-login-form>
      <!-- form fields -->
    </TpkLoginForm>
  </template>
}
```

---

### Login Validation
**Location:** `@libs/users-front/src/components/forms/login-validation.ts`

**Relevance:** Zod schema pattern for registration validation

**Key Patterns:**
- Factory function: `export const createLoginValidationSchema = (intl: IntlService) => ...`
- Takes `IntlService` for i18n error messages
- Zod schema with `.email()` and `.string().min()` validators
- All error messages use `intl.t()` for translations
- Type inference: `export type ValidatedLogin = z.infer<ReturnType<typeof createLoginValidationSchema>>`

**Schema Structure:**
```typescript
import { email, object, string } from 'zod';
import type { IntlService } from 'ember-intl';

export const createLoginValidationSchema = (intl: IntlService) =>
  object({
    email: email(intl.t('users.forms.login.validation.invalidEmail')),
    password: string().min(1, intl.t('users.forms.login.validation.passwordRequired')),
  });

export type ValidatedLogin = z.infer<ReturnType<typeof createLoginValidationSchema>>;
```

---

### Login Route
**Location:** `@libs/users-front/src/routes/login.gts`

**Relevance:** Route handler pattern for registration route

**Key Patterns:**
- Route signature export: `export type LoginRouteSignature = { ... }`
- Extends `Route` from `@ember/routing/route`
- Uses `prohibitAuthentication()` from ember-simple-auth route
- Redirects logged-in users to dashboard automatically
- Minimal route handler (no model loading needed)

**Route Structure:**
```typescript
import Route from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export type LoginRouteSignature = {
  model: Awaited<ReturnType<LoginRoute['model']>>;
  controller: undefined;
};

export default class LoginRoute extends Route {}
```

---

### Login Template
**Location:** `@libs/users-front/src/routes/login-template.gts`

**Relevance:** Template pattern for registration template

**Key Patterns:**
- Template-only component with `TOC<>` type (Template Only Component)
- Uses `AuthLayout` wrapper component for consistent auth page styling
- Renders form component: `<LoginForm />`
- Type annotation references route signature: `TOC<LoginRouteSignature>`

**Template Structure:**
```typescript
import type { LoginRouteSignature } from './login.ts';
import AuthLayout from '@libs/users-front/components/auth-layout';
import LoginForm from '@libs/users-front/components/forms/login-form';
import type { TOC } from '@ember/component/template-only';

export default <template>
  <AuthLayout>
    <LoginForm />
  </AuthLayout>
</template> as TOC<LoginRouteSignature>;
```

---

### Forgot Password Form (Existing, Incomplete)
**Location:** `@libs/users-front/src/components/forms/forgot-password.gts`

**Relevance:** Exists but `onSubmit` is empty — needs implementation

**Key Patterns:**
- Already has template structure with email input
- Uses `TpkLoginForm` component
- Service injections present but `onSubmit` not implemented
- Data test attribute: `data-test-forgot-password-form`

**Needs Implementation:**
```typescript
onSubmit = async (data: { email: string }) => {
  try {
    await fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    this.flashMessages.success(
      this.intl.t('users.forms.forgotPassword.messages.checkEmail')
    );
    this.router.transitionTo('login');
  } catch (error) {
    this.flashMessages.error(
      this.intl.t('users.forms.forgotPassword.messages.error')
    );
  }
};
```

---

### Session Service
**Location:** `@libs/users-front/src/services/session.ts`

**Relevance:** Integration with ember-simple-auth

**Key Patterns:**
- Extends `SessionService` from `ember-simple-auth`
- Injects `currentUser` service
- Loads current user on authentication success
- `authenticate()` method for login
- `invalidate()` method for logout

---

### Auth Handler (WarpDrive)
**Location:** `@libs/users-front/src/handlers/auth.ts`

**Relevance:** WarpDrive request handler that injects JWT tokens

**Key Patterns:**
- Custom request handler extending `LegacyNetworkHandler`
- Injects `Authorization: Bearer ${token}` header into all requests
- Integrates with session store to get current token
- Applied to WarpDrive store configuration

---

### Router Configuration
**Location:** `@libs/users-front/src/index.ts`

**Relevance:** Where to add new routes

**Key Patterns:**
- Exports `authRoutes()` function called in main router
- Uses Ember router DSL: `this.route('name')`
- Routes defined: `login`, `forgot-password`, `logout`

**Where to Add:**
```typescript
export function authRoutes(this: DSL) {
  this.route('login');
  this.route('register');           // ADD
  this.route('forgot-password');
  this.route('reset-password');     // ADD
  this.route('logout');
}
```

---

### MSW Mocks
**Location:** `@libs/users-front/src/http-mocks/login.ts`

**Relevance:** Where to add mock handlers for new auth endpoints

**Key Patterns:**
- Uses `createOpenApiHttp<paths>()` from `openapi-msw` for type safety
- `http.post()` handlers for POST endpoints
- `HttpResponse.json()` for mock responses
- JSON:API format: `{ data: { ... } }`
- Imported in `all.ts` aggregator file

**Where to Add:**
```typescript
export default [
  http.post('/api/v1/auth/login', ...existing),

  // ADD NEW MOCKS:
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

---

### Translations
**Location:** `@apps/front/translations/users/en-us.yaml` and `fr-fr.yaml`

**Relevance:** Where to add i18n keys for new forms

**Key Patterns:**
- Nested YAML structure: `forms.{form}.{section}.{key}`
- Keys for: `labels`, `validation`, `actions`, `messages`
- Parallel structure in English and French files
- Keys accessed via: `{{t "users.forms.login.labels.email"}}` or `this.intl.t('users.forms.login.messages.error')`

**Existing Structure:**
```yaml
forms:
  login:
    title: 'Login'
    labels:
      email: 'Email Address'
      password: 'Password'
    actions:
      submit: 'Login'
      forgotPassword: 'Forgot Password?'
    validation:
      invalidEmail: 'Please enter a valid email address'
      passwordRequired: 'Password is required'
    messages:
      error: 'Invalid email or password'
```

---

## Summary

These references provide the complete patterns and conventions for implementing:

**Backend:**
- Entity definitions (PasswordResetToken following RefreshToken pattern)
- Route structure (RegisterRoute, ForgotPasswordRoute, ResetPasswordRoute following LoginRoute pattern)
- Password hashing (using existing `hashPassword()` utility)
- Token hashing (using existing `hashToken()` utility)
- Module wiring (adding routes to `authRoutes` array in `init.ts`)

**Frontend:**
- Form components (RegisterForm, ResetPasswordForm following LoginForm pattern)
- Validation schemas (following `createLoginValidationSchema` factory pattern)
- Routes and templates (following login route/template separation)
- MSW mocks (adding to `login.ts` mock handlers)
- Translations (adding to `users/en-us.yaml` and `fr-fr.yaml`)

All patterns follow the established standards and ensure consistency across the authentication system implementation.

---

*These references were identified during the exploration phase and serve as the foundation for implementation decisions.*
