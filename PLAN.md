# SQLite WASM Foundation - Implementation Plan

Spec validée : `agent-os/specs/2026-02-17-1500-sqlite-wasm-foundation/`

## Task 1: Save Spec Documentation ✅ DONE
Already complete (plan.md, shape.md, standards.md, references.md).

## Task 2: Create Library Package Structure
Create `@libs/storage-front/` with Ember Addon v2 structure:
- Copy configs from `@libs/todos-front` (addon-main.cjs, rollup.config.mjs, tsconfig.json, tsconfig.publish.json, babel configs, vite.config.mts)
- Create package.json with wa-sqlite dependency
- Create src/ and tests/ folder structure
- Run `pnpm install`

## Task 3: Implement Database Core
**File**: `@libs/storage-front/src/core/database.ts`
- Wrap wa-sqlite with async API (SQLiteESMFactory + IDBBatchAtomicVFS)
- Methods: `initialize(dbName)`, `createTable(entity)`, `execute(sql, params)`, `query<T>(sql, params)`, `close()`
- Use prepared statements with parameter binding for SQL injection safety

## Task 4: Implement Entity Definition System
**File**: `@libs/storage-front/src/entities/define-entity.ts`
- Type-safe `defineEntity<T>()` API inspired by MikroORM
- Column builders: `text()`, `integer()`, `boolean()`, `timestamp()`
- Chainable methods: `.primary()`, `.nullable()`, `.default()`

**File**: `@libs/storage-front/src/entities/treatment.entity.ts`
- Treatment entity: id, title, description, status, createdAt, updatedAt

## Task 5: Implement Repository Layer
**File**: `@libs/storage-front/src/repositories/base-repository.ts`
- Generic CRUD: findAll, findById, create, update, delete, count
- Uses `crypto.randomUUID()` for ID generation, ISO timestamps

**File**: `@libs/storage-front/src/repositories/treatment-repository.ts`
- Extends BaseRepository: findByStatus, search

## Task 6: Implement Storage Service
**File**: `@libs/storage-front/src/services/storage.ts`
- Ember service with `@tracked isReady`, `@tracked error`
- `initialize()`, `treatmentRepository` getter, `reset()`, `willDestroy()`

## Task 7: Implement Treatment Service
**File**: `@libs/storage-front/src/services/treatment.ts`
- Ember service following CRUD pattern (save dispatches to create/update)
- Injects StorageService, delegates to repository

## Task 8: Create Library Entry Point
**File**: `@libs/storage-front/src/index.ts`
- `moduleRegistry()` with import.meta.glob for services
- `async initialize(owner)` - awaits storage initialization
- `forRouter()` - empty for now (Phase 1B)

## Task 9: Integrate into Application
- Add `@libs/storage-front` to `@apps/front/package.json`
- Add `await initializeStorageLib(getOwner(this)!)` in `@apps/front/app/routes/application.ts`

## Task 10: Write Unit Tests
- Database core tests (init, table creation, queries, error handling)
- Repository tests (CRUD, findByStatus, search, edge cases)

## Task 11: Write Integration Tests
- Storage service tests (initialization, error handling, repository access)
- Treatment service tests (CRUD, save dispatch, error handling)

## Task 12: Verify in Running Application
- Manual verification: pnpm dev, check IndexedDB, test CRUD via console

## Task 13: Run Linters and Tests
- `pnpm lint:fix` and `pnpm test --filter @libs/storage-front`
