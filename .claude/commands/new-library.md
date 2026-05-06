---
description: Scaffold a new frontend or backend library following the project's boilerplate (V2 — guarded, validated)
argument-hint: <frontend|backend> <library-name>
model: sonnet
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# New Library V2

Scaffold a new library in `@libs/` for this monorepo.

## Arguments

`$ARGUMENTS` — `<frontend|backend> <library-name>`

- `kind` must be exactly `frontend` or `backend`. If missing or any other value, stop and ask.
- `library-name` must be kebab-case (e.g. `invoice`, `audit-log`). If missing or invalid, stop and ask.

## Workflow

### 1. Validate arguments

- If `kind` ∉ `{frontend, backend}`, stop and ask the user.
- If `library-name` is missing or not kebab-case, stop and ask the user.

### 2. Check for collision

Derive the target package name:
- frontend → `@libs/<library-name>-front`  (directory: `@libs/<library-name>-front`)
- backend  → `@libs/<library-name>-backend` (directory: `@libs/<library-name>-backend`)

If the directory already exists, warn the user and ask for confirmation before proceeding. Do **not** overwrite silently.

### 3. Derive naming conventions

From `<library-name>` (kebab-case plural, e.g. `audit-logs`), derive:

| Convention | Rule | Example |
|---|---|---|
| Folder / URL slug | kebab-case as-is | `audit-logs` |
| Entity class | PascalCase singular | `AuditLog` |
| Service / module | PascalCase plural | `AuditLogs` |
| Schema type name | camelCase singular | `auditLog` |

If the name is ambiguous (e.g. already singular), use it as-is for the entity class.

### 4. Ensure packed tutorial is fresh

Check if the packed file is up to date:

```bash
# frontend
[ tuto/0_frontend.packed.md -nt tuto/0_frontend.md ] && echo "fresh" || pnpm pack:tuto tuto/0_frontend.md

# backend
[ tuto/1_backend.packed.md -nt tuto/1_backend.md ] && echo "fresh" || pnpm pack:tuto tuto/1_backend.md
```

If the packed file is missing or older than its source, run `pnpm pack:tuto tuto/<file>.md` first.

### 5. Read the tutorial

- If `kind` is `frontend`: read `tuto/0_frontend.packed.md` and follow it step by step.
- If `kind` is `backend`: read `tuto/1_backend.packed.md` and follow it step by step.

The `*.packed.md` files inline every referenced source file at the bottom under "## Referenced files". Do **not** open any external file path mentioned in it — the canonical content is already inlined.

### 6. Use the structural reference

Copy `package.json`, `tsconfig.json`, `tsdown.config.mts`, `vitest.config.mts` shape and dependencies from:
- frontend → `@libs/users-front`
- backend  → `@libs/users-backend`

Replace every occurrence of `user` / `User` / `users` with the derived naming conventions from step 3.

### 7. Scaffold

Follow every numbered step in the tutorial. Keep the naming from step 3 consistent throughout.

### 8. Validate

After scaffolding, run:

```bash
# Replace <package-name> with the full package name (e.g. @libs/audit-logs-front)
pnpm -F <package-name> test
pnpm -F <package-name> lint
```

Report the output. If tests or lint fail, fix the issues before marking the task done.

### 9. Link to the app (optional)

If the user explicitly asks to wire the library to the app, follow the "Liaison" section at the end of the tutorial (frontend step 14, backend step 13). Otherwise, stop after validation.

## Rules

- Do not commit unless explicitly asked.
- Do not create translations — those belong to the app, not the library.
- Libraries do not contain acceptance tests (frontend) — those live in `@apps/front`.
- All API calls in lib tests must be mocked (MSW or Vitest) — real calls are for e2e tests.
- Integration tests (backend) must use a real PostgreSQL container, not mocks.

## Report

```
Library scaffolded

Kind:    <frontend|backend>
Package: @libs/<library-name>-{front,backend}
Tests:   ✓ / ✗
Lint:    ✓ / ✗

Next steps:
- Wire to app: follow "Liaison" section in tuto/<n>_<kind>.packed.md
- Add translations (frontend): @apps/front/app/translations/<library-name>/
```
