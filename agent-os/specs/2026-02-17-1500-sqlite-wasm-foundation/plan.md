# SQLite WASM Foundation - Implementation Plan

## Context

Registr is a privacy-first GDPR compliance tool built with Ember.js. The product vision includes:
- **Offline-first architecture**: All sensitive compliance data stays on the user's device
- **Two-tier database**: PostgreSQL for authentication (Phase 1A - complete), SQLite WASM for treatments (this phase)
- **Phase 1B upcoming**: 8-step treatment wizard for creating GDPR compliance records

This phase prepares the SQLite WASM foundation **between Phase 1A (authentication) and Phase 1B (treatment wizard)** to enable fully client-side data storage for treatment records.

**Key Requirements:**
- Full SQLite WASM setup with type-safe ORM layer
- Parallel to WarpDrive (not replacing it)
- Core Treatment entity schema only (Phase 1B will expand)
- Ember service integration following existing patterns
- No migration system yet (simple schema initialization)

## Critical Files

1. `@libs/storage-front/src/core/database.ts` - wa-sqlite wrapper, foundation for storage
2. `@libs/storage-front/src/entities/define-entity.ts` - Type-safe entity definition API
3. `@libs/storage-front/src/repositories/base-repository.ts` - Generic CRUD repository
4. `@libs/storage-front/src/services/storage.ts` - Database lifecycle manager
5. `@libs/storage-front/src/services/treatment.ts` - Treatment business logic service
6. `@libs/storage-front/src/index.ts` - Library entry point with initialize()
7. `@apps/front/app/routes/application.ts` - App integration (add storage init)
8. `@apps/front/package.json` - Add @libs/storage-front dependency

## Implementation Tasks

### Task 1: Save Spec Documentation

Create `agent-os/specs/2026-02-17-1500-sqlite-wasm-foundation/` containing:
- **plan.md** - This full implementation plan
- **shape.md** - Shaping decisions and context from our conversation
- **standards.md** - Relevant standards (lib-structure, app-integration, service-crud, entity-definitions)
- **references.md** - Pointers to similar code (todos-front, users-front services)

### Task 2: Create Library Package Structure

Create `@libs/storage-front/` with standard Ember Addon v2 structure:
- `src/` - Source code
- `tests/` - Unit and integration tests
- `addon-main.cjs` - Standard Embroider shim
- `package.json` - Add wa-sqlite dependency
- `rollup.config.mjs` - Standard rollup config
- `tsconfig.json` and `tsconfig.publish.json` - TypeScript configs

Copy configs from `@libs/todos-front` as reference.

**Dependency**: Install `wa-sqlite` for SQLite WASM with IndexedDB support

### Task 3: Implement Database Core

**File**: `@libs/storage-front/src/core/database.ts`

Implement `Database` class that wraps wa-sqlite:
- `initialize(dbName)` - Async initialization with IDBBatchAtomicVFS
- `createTable(entity)` - Generate CREATE TABLE from entity definition
- `execute(sql, params)` - Run INSERT/UPDATE/DELETE statements
- `query<T>(sql, params)` - Run SELECT queries, return typed results
- `close()` - Cleanup database connection

Use wa-sqlite async build with IndexedDB VFS for persistent storage.

### Task 4: Implement Entity Definition System

**File**: `@libs/storage-front/src/entities/define-entity.ts`

Create type-safe entity definition API inspired by MikroORM:
- `column` object with builders: `text()`, `integer()`, `boolean()`, `timestamp()`
- `ColumnBuilder` with chainable methods: `.primary()`, `.nullable()`, `.default()`, `.autoIncrement()`
- `defineEntity<T>()` function that accepts entity definition and returns `EntityDefinition<T>`
- Type inference to maintain TypeScript types from definition to usage

**File**: `@libs/storage-front/src/entities/treatment.entity.ts`

Define core Treatment entity:
```typescript
interface Treatment {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'validated' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export const TreatmentEntity = defineEntity<Treatment>({ ... });
```

### Task 5: Implement Repository Layer

**File**: `@libs/storage-front/src/repositories/base-repository.ts`

Implement generic `BaseRepository<T>` class with CRUD operations:
- `findAll()` - Fetch all records
- `findById(id)` - Fetch single record by ID
- `create(data)` - Insert new record (auto-generate ID and timestamps)
- `update(id, data)` - Update existing record (auto-update updatedAt)
- `delete(id)` - Delete record
- `count()` - Count total records

**File**: `@libs/storage-front/src/repositories/treatment-repository.ts`

Extend BaseRepository with Treatment-specific queries:
- `findByStatus(status)` - Filter treatments by status
- `search(query)` - Full-text search in title and description

### Task 6: Implement Storage Service

**File**: `@libs/storage-front/src/services/storage.ts`

Create Ember service that manages database lifecycle:
- `@tracked isReady` - Reactive flag when DB is initialized
- `@tracked error` - Error state if initialization fails
- `initialize()` - Async method to initialize DB and create tables
- `treatmentRepository` getter - Access to TreatmentRepository
- `reset()` - Drop and recreate tables (for testing/debugging)
- `willDestroy()` - Clean up DB connection

This service is the **singleton database manager** that other services depend on.

### Task 7: Implement Treatment Service

**File**: `@libs/storage-front/src/services/treatment.ts`

Create Ember service following the CRUD pattern from standards:
- Inject `@service declare storage: StorageService`
- `save(data)` - Dispatch to create or update based on presence of `id`
- `create(data)` - Create new treatment
- `update(data)` - Update existing treatment
- `delete(id)` - Delete treatment
- `findAll()` - List all treatments
- `findById(id)` - Get single treatment
- `findByStatus(status)` - Filter by status
- `search(query)` - Search treatments

Use types `CreateTreatmentData` and `UpdateTreatmentData` for type safety.

### Task 8: Create Library Entry Point

**File**: `@libs/storage-front/src/index.ts`

Implement standard library exports:
- `moduleRegistry()` - Register services using `import.meta.glob`
- `initialize(owner)` - **Async** function to initialize storage service
- `forRouter(this: DSL)` - Empty for now (Phase 1B will add routes)

The `initialize()` function MUST await storage initialization before returning.

### Task 9: Integrate into Application

**Update**: `@apps/front/package.json`
- Add `"@libs/storage-front": "workspace:^"` to devDependencies
- Run `pnpm install`

**Update**: `@apps/front/app/routes/application.ts`
- Import `initialize as initializeStorageLib` from `@libs/storage-front`
- In `beforeModel()`, add `await initializeStorageLib(getOwner(this)!)` after other lib initializations
- **Critical**: MUST await to ensure DB is ready before app renders

### Task 10: Write Unit Tests

**File**: `tests/unit/core/database-test.ts`
- Test database initialization
- Test table creation from entity definition
- Test SQL execution and queries
- Test error handling

**File**: `tests/unit/repositories/treatment-repository-test.ts`
- Test CRUD operations (create, findById, update, delete)
- Test custom queries (findByStatus, search)
- Test edge cases (not found, null values)

Create `tests/app.ts` and `tests/test-helper.ts` following todos-front pattern.

### Task 11: Write Integration Tests

**File**: `tests/integration/services/storage-test.ts`
- Test async initialization flow
- Test error handling during initialization
- Test repository access after initialization

**File**: `tests/integration/services/treatment-test.ts`
- Test service CRUD operations with mocked storage
- Test save() dispatch logic (create vs update)
- Test error handling

Use `vi.mock()` to mock StorageService in integration tests.

### Task 12: Verify in Running Application

Manual verification steps:
1. Run `pnpm dev` to start the application
2. Open browser DevTools
3. Navigate to Application > Storage > IndexedDB
4. Verify `registr-idb-vfs` database is created
5. Use browser console to test: `service = owner.lookup('service:treatment')` then `await service.create({ title: 'Test' })`
6. Verify record persists across page reloads
7. Check that no console errors occur during initialization

### Task 13: Run Linters and Tests

Run standard checks:
```bash
pnpm lint:fix
pnpm test --filter @libs/storage-front
```

Fix any linting issues or test failures.

## Verification

After implementation:

**Database Verification:**
- [ ] SQLite WASM initializes without errors in browser console
- [ ] IndexedDB shows `registr-idb-vfs` database in DevTools
- [ ] Tables are created correctly with expected columns and indexes

**Service Verification:**
- [ ] StorageService.isReady becomes true after initialization
- [ ] TreatmentService can create/read/update/delete records
- [ ] Data persists across page reloads (check IndexedDB)

**Test Verification:**
- [ ] All unit tests pass (`pnpm test --filter @libs/storage-front`)
- [ ] No console errors during test runs
- [ ] Integration tests with mocked storage pass

**Type Safety Verification:**
- [ ] TypeScript compilation succeeds with no errors
- [ ] IDE autocomplete works for entity types
- [ ] Changing entity definition updates types throughout stack

## Next Steps (Phase 1B)

After this foundation is complete, Phase 1B will:
1. Expand schema with related tables (purposes, data subjects, legal bases, etc.)
2. Create treatment wizard routes and components
3. Build forms for 8-step wizard flow
4. Add more complex queries (filtering, joins, pagination)
5. Implement export/import capabilities

This foundation provides everything needed for Phase 1B to succeed.
