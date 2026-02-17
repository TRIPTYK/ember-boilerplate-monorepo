# References for SQLite WASM Foundation

## Similar Implementations

### @libs/todos-front — Complete Feature Library Example

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/@libs/todos-front/`
- **Relevance**: Complete working implementation of a frontend feature library with services, routes, forms, and tests
- **Key patterns to borrow**:
  - Package structure (addon-main.cjs, rollup.config.mjs, tsconfig files)
  - Service pattern in `src/services/todo.ts` - shows CRUD operations with WarpDrive
  - Test setup in `tests/app.ts` and `tests/test-helper.ts`
  - Integration pattern in `src/index.ts` - moduleRegistry(), initialize(), forRouter()

### @libs/users-front/src/services/current-user.ts — State Service Pattern

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/@libs/users-front/src/services/current-user.ts`
- **Relevance**: Example of a reactive state-holder service (vs. stateless CRUD service)
- **Key patterns**:
  - Uses `@tracked` for reactive state
  - Exposes `load()` method for async initialization
  - Singleton pattern - one instance manages shared state
  - **Adapt for StorageService**: Similar initialization pattern, manages database lifecycle

### @libs/users-front/src/services/user.ts — CRUD Service Pattern

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/@libs/users-front/src/services/user.ts`
- **Relevance**: Standard CRUD service following the service-crud standard
- **Key patterns**:
  - `save(data)` dispatches to create or update based on `data.id`
  - Separate `create()` and `update()` private methods
  - Type-safe with `ValidatedUser` and `UpdatedUser` interfaces
  - **Adapt for TreatmentService**: Same pattern but use SQLite repository instead of WarpDrive

### @apps/front/app/services/store.ts — WarpDrive Configuration

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/@apps/front/app/services/store.ts`
- **Relevance**: Shows how to configure WarpDrive with request pipeline
- **Key patterns**:
  - Request manager with middleware chain (AuthHandler → NetworkHandler → Fetch → Cache)
  - Schema registration pattern
  - **Insight**: SQLite will run parallel to this, not replace it

### @apps/front/app/routes/application.ts — Library Initialization

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/@apps/front/app/routes/application.ts`
- **Relevance**: Shows how to initialize libraries in the application route
- **Key patterns**:
  - `beforeModel()` hook for initialization
  - Async library init with `await initializeUserLib(getOwner(this)!)`
  - MSW worker setup for mocking APIs
  - **Adapt**: Add `await initializeStorageLib(getOwner(this)!)` here

### @libs/users-front/src/handlers/auth.ts — Handler Middleware

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/@libs/users-front/src/handlers/auth.ts`
- **Relevance**: Example of WarpDrive request middleware
- **Key patterns**:
  - Implements `Handler` interface with `request()` method
  - Intercepts requests to inject JWT tokens
  - **Note**: Not directly applicable to SQLite, but shows middleware pattern if we add sync layer later

## Backend Patterns (For Entity Design Inspiration)

### @libs/todos-backend/src/entities/todo.entity.ts — MikroORM Entity

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/@libs/todos-backend/src/entities/todo.entity.ts`
- **Relevance**: Shows MikroORM's `defineEntity()` pattern that we're adapting for SQLite
- **Key patterns**:
  - Functional entity definition (not decorators)
  - `p.string()`, `p.boolean()` property builders with chained methods
  - `.primary()`, `.nullable()`, `.index()`, `.default()`, `.onCreate()` modifiers
  - ISO string timestamps (`p.string().onCreate(() => new Date().toISOString())`)
  - **Adapt**: Create similar API for SQLite entity definitions

### @libs/users-backend/src/entities/user.entity.ts — Complex Entity Example

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/@libs/users-backend/src/entities/user.entity.ts`
- **Relevance**: Shows more complex entity with multiple fields and indexes
- **Key patterns**:
  - Multiple properties with different types
  - Index definitions for query optimization
  - Nullable fields handling
  - **Reference**: Use similar structure for Treatment entity

## Documentation Standards

### agent-os/standards/frontend/lib-structure.md

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/agent-os/standards/frontend/lib-structure.md`
- **Relevance**: Defines required folder structure for frontend libraries
- **Follow exactly**: Package structure, addon-main.cjs, rollup config, tsconfig

### agent-os/standards/frontend/app-integration.md

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/agent-os/standards/frontend/app-integration.md`
- **Relevance**: 7-step checklist for wiring library into @apps/front
- **Follow exactly**: Dependency, initialization, routes, schemas, CSS, translations

### agent-os/standards/frontend/service-crud.md

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/agent-os/standards/frontend/service-crud.md`
- **Relevance**: Standard CRUD service pattern
- **Adapt**: Use same pattern but repositories instead of WarpDrive store

### agent-os/standards/backend/entity-definitions.md

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/agent-os/standards/backend/entity-definitions.md`
- **Relevance**: MikroORM defineEntity pattern
- **Adapt**: Create similar pattern for SQLite entities

## External References

### wa-sqlite Documentation

- **URL**: https://github.com/rhashimoto/wa-sqlite
- **Relevance**: SQLite WASM library we're using
- **Key sections**:
  - Getting started guide
  - IDBBatchAtomicVFS for IndexedDB persistence
  - Async build usage with Asyncify
  - API reference for database operations

### SQLite Documentation

- **URL**: https://www.sqlite.org/lang.html
- **Relevance**: SQL syntax reference for CREATE TABLE, indexes, queries
- **Key sections**:
  - CREATE TABLE syntax
  - Data types (TEXT, INTEGER, REAL, BLOB)
  - Indexes and optimization
  - Full-text search (FTS5) - for future enhancement

## Testing References

### @libs/todos-front/tests/ — Test Examples

- **Location**: `/Users/tatooine/www/boilerplate-stagiaires/@libs/todos-front/tests/`
- **Relevance**: Examples of unit and integration tests
- **Key patterns**:
  - Vitest setup with `renderingTest`
  - `TestApp` and `initializeTestApp` pattern
  - Service mocking with `vi.mock()`
  - **Adapt**: Similar structure for storage-front tests

## Summary

**Most important references** to study before implementation:
1. `@libs/todos-front/` - Complete library structure
2. `@libs/users-front/src/services/current-user.ts` - State service (like StorageService)
3. `@libs/users-front/src/services/user.ts` - CRUD service (like TreatmentService)
4. `@libs/todos-backend/src/entities/todo.entity.ts` - Entity definition pattern to adapt
5. `@apps/front/app/routes/application.ts` - Where to integrate the library

All file paths are absolute and can be read directly.
