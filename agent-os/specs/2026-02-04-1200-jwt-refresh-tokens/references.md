# JWT Refresh Tokens - References

## Existing Code References

### Entity Pattern
- `@libs/users-backend/src/entities/user.entity.ts` - Example of `defineEntity` usage

### Route Pattern
- `@libs/users-backend/src/routes/login.route.ts` - Auth route with Zod schemas
- `@libs/users-backend/src/routes/create.route.ts` - CRUD route example

### JWT Utilities
- `@libs/users-backend/src/utils/jwt.utils.ts` - `generateTokens`, `verifyRefreshToken`

### Auth Utilities
- `@libs/users-backend/src/utils/auth.utils.ts` - Password hashing utilities

### Module Setup
- `@libs/users-backend/src/init.ts` - Route registration pattern

### Exports
- `@libs/users-backend/src/index.ts` - Export pattern

## External References

### JWT Best Practices
- OWASP JWT Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- Auth0 Refresh Token Rotation: https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation

### Token Storage Security
- OWASP Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

### MikroORM
- Entity Definition: https://mikro-orm.io/docs/defining-entities
- Migrations: https://mikro-orm.io/docs/migrations
