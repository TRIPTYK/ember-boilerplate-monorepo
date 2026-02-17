# SQLite WASM Foundation — Shaping Notes

## Scope

We're building the SQLite WASM foundation for Registr, positioned **between Phase 1A (authentication - complete) and Phase 1B (treatment wizard - upcoming)**.

### What We're Building

A complete client-side database layer using SQLite WASM that includes:
- SQLite WASM library integration (wa-sqlite with IndexedDB)
- Type-safe ORM-like abstraction layer (entity definitions, repositories)
- Ember service integration (storage service + entity services)
- Core Treatment entity schema (id, title, description, status, timestamps)
- Full test coverage (unit and integration tests)

### What We're NOT Building (Yet)

- Migration system (will add later when needed)
- Full Phase 1B schema (related tables for purposes, legal bases, etc.)
- Treatment wizard UI (that's Phase 1B)
- Export/import capabilities (Phase 2+)
- Sync layer to backend (Phase 3+)

## Decisions

### Library Choice: wa-sqlite

**Chosen**: wa-sqlite by rhashimoto

**Why**:
- Modern async/await API (not callback-based like sql.js)
- IndexedDB VFS for persistent storage built-in
- Active maintenance and good documentation
- Production-ready with 126+ code snippets in Context7
- Can migrate to OPFS later for better performance

### Architecture: Parallel Systems

**Decision**: SQLite operates **alongside** WarpDrive, not replacing it

**Rationale**:
- WarpDrive: JSON:API cache for server-synced data (users, auth, todos)
- SQLite: Client-side persistence for privacy-sensitive data (treatments, GDPR records)
- Services can choose which storage layer to use based on needs
- Maintains existing patterns while adding offline persistence

### ORM Design: Entity-Repository-Service Pattern

**Decision**: Three-layer architecture inspired by backend MikroORM pattern

**Layers**:
1. **Entity Definitions**: Type-safe schema using `defineEntity()` API (like MikroORM)
2. **Repositories**: Generic CRUD + entity-specific queries (like MikroORM repositories)
3. **Services**: Business logic layer following existing Ember service patterns

**Why**:
- Familiar to developers already using MikroORM on backend
- Type safety from entity definition flows through entire stack
- Clear separation of concerns (persistence vs. business logic)
- Easy to test (mock repositories in service tests)

### Schema Approach: Core Entity Only

**Decision**: Start with simple Treatment entity (6 fields)

**Why**:
- Phase 1B requirements aren't fully known yet
- Easier to add related tables later than to refactor complex schema
- Gets the foundation working quickly
- Can expand schema when Phase 1B implementation begins

### Initialization: Async in Application Route

**Decision**: Initialize SQLite in `application.ts` route's `beforeModel()` hook

**Why**:
- Ensures DB is ready before app renders
- Matches existing pattern (user lib, todo lib)
- Clear failure point if initialization fails
- Prevents race conditions

## Context

### Visuals

None provided. Schema designed from Phase 1B requirements in roadmap.

### References

**Code references studied**:
- `@libs/todos-front/src/services/todo.ts` - Data service CRUD pattern
- `@libs/users-front/src/services/current-user.ts` - State service pattern
- `@apps/front/app/services/store.ts` - WarpDrive configuration and service registration
- `@libs/users-front/src/handlers/auth.ts` - Handler middleware example
- `@libs/todos-front/` - Complete library structure example

### Product Alignment

**From** `/Users/tatooine/www/boilerplate-stagiaires/agent-os/product/mission.md`:
> Privacy-first architecture — Offline-first with SQLite via WASM. Sensitive compliance data stays on the user's device; only authentication is verified online.

**From** `/Users/tatooine/www/boilerplate-stagiaires/agent-os/product/tech-stack.md`:
> Client-Side: SQLite via WASM
> - SQLite compiled to WebAssembly
> - Runs entirely in the browser
> - Stores all treatment data and GDPR compliance records
> - Sensitive compliance data never leaves the user's device

**Alignment**: This implementation delivers on the core product promise of client-side data sovereignty.

## Standards Applied

The following standards from `agent-os/standards/` apply to this work:

1. **frontend/lib-structure** — Standard folder structure for `@libs/storage-front`
2. **frontend/app-integration** — 7-step integration checklist for wiring into `@apps/front`
3. **frontend/service-crud** — CRUD service pattern (adapted for SQLite instead of WarpDrive)
4. **backend/entity-definitions** — MikroORM's defineEntity pattern as inspiration for SQLite entities

See `standards.md` for full content of each standard.

## Key Questions & Answers

**Q**: Should SQLite replace WarpDrive or run alongside it?
**A**: Parallel systems. WarpDrive for API-synced data, SQLite for offline treatment data.

**Q**: Should we create a migration system now?
**A**: No. Keep it simple with direct schema initialization. Add migrations when Phase 1B needs them.

**Q**: How detailed should the schema be?
**A**: Core entity only (Treatment with 6 basic fields). Phase 1B will add related tables.

**Q**: Should the ORM be similar to MikroORM?
**A**: Yes. Familiar pattern, type-safe, extensible. Use functional `defineEntity()` API.

**Q**: How should services interact with the ORM?
**A**: Two-layer approach: Storage service (manages DB lifecycle), entity services (business logic).
