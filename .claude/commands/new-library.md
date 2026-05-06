---
description: Scaffold a new frontend or backend library following the project's boilerplate
argument-hint: <frontend|backend> <library-name>
---

# New Library

Scaffold a new library in `@libs/` for this monorepo.

## Arguments

`$ARGUMENTS` — `<frontend|backend> <library-name>`

If missing or invalid, ask the user before doing anything.

## What to do

- If kind is `frontend`: read `tuto/0_frontend.packed.md` and follow it step by step.
- If kind is `backend`: read `tuto/1_backend.packed.md` and follow it step by step.

The `*.packed.md` files are produced by `pnpm pack:tuto tuto/<file>.md` and inline every referenced source file at the bottom under "## Referenced files". If the packed file is missing or stale, regenerate it first.

Use the existing `@libs/users-front` (frontend) or `@libs/users-backend` (backend) as the structural reference — copy `package.json`, `tsconfig.json`, `tsdown.config.mts`, `vitest.config.mts` shape and dependencies from it. Replace `user` / `User` with the new library's name / entity.

Do not commit unless asked.
