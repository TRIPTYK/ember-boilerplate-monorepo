# Post-Implementation Checks

After completing any implementation task, run lint and tests.

**Lint (run globally):**
```bash
pnpm turbo lint
```

If lint fails, auto-fix:
```bash
pnpm turbo lint:fix
```

**Tests (run only on modified packages):**
```bash
# Example: if you modified @libs/users-backend
pnpm --filter @libs/users-backend test

# Multiple packages
pnpm --filter @libs/users-backend --filter @libs/users-front test
```

**Rules:**
- Always run lint globally after implementation
- Only run tests on packages you actually modified
- Fix lint errors before committing
- All tests must pass before task is complete
