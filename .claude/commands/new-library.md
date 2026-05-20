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

For backend libraries, follow the code style rules in `@libs/CLAUDE.md` (read it before generating code).

## Verify

After scaffolding is complete, run `pnpm -F @libs/<library-name> lint:js` **exactly once**, then refactor every reported violation in a single pass. Do not re-run lint to confirm — fix from the single output. This keeps token usage bounded.

Do not commit unless asked.
