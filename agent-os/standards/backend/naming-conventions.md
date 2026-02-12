# Backend Naming Conventions

## File naming

Suffix files by role:
- `{action}.route.ts` — `create.route.ts`, `login.route.ts`, `list.route.ts`
- `{entity}.entity.ts` — `user.entity.ts`, `todo.entity.ts`
- `{entity}.serializer.ts` — `user.serializer.ts`
- `{purpose}.middleware.ts` — `jwt-auth.middleware.ts`
- `{purpose}.utils.ts` — `auth.utils.ts`, `jwt.utils.ts`
- `context.ts` — module context type definitions
- `init.ts` — module class and entry point

## Class & type naming

- Entities: `UserEntity` / `UserEntityType`
- Routes: `CreateRoute`, `LoginRoute`
- Modules: `UserModule`, `AuthModule`
- Serializer schemas: `SerializedUserSchema`
- Serializer functions: `jsonApiSerializeUser`, `jsonApiSerializeSingleUserDocument`
- Context types: `UserLibraryContext`

## Imports

- Prefer `#src/*` alias with `.js` extension: `import { UserEntity } from "#src/entities/user.entity.js";`
- Relative imports are OK for same-directory files
- Cross-package imports use package name: `import { makeJsonApiError } from "@libs/backend-shared";`

## Variables

- Repositories: `userRepository`, `todoRepository`
- EntityManager: `em`
- Current user: `request.user` (typed via Fastify declaration merging)
