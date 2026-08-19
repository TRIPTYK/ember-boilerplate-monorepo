# E2E Tests

Playwright tests that drive the real frontend against the real backend and a real
PostgreSQL database. Nothing is mocked: MSW is switched off with
`VITE_MOCK_API=false`, so a failure here means the stack is genuinely broken.

## Why these tests exist

The vitest suites in `@libs/*-front` and `@libs/*-backend` are faster and cover
far more cases — write new tests there first. This suite exists for the seams
those tests cannot reach, because they stop at a mock:

- the login handshake (form → `POST /auth/login` → token in `localStorage` →
  `GET /users/profile` → redirect). `@libs/users-front` mocks the session
  service, so it cannot catch a break in that chain.
- the session between page loads: reload, logout, route guards.
- the bearer token actually reaching the API on subsequent requests.
- JSON:API round-trips through Warp Drive: what the table renders is what the
  database returned.

If a test you are about to write would pass with a mocked backend, it belongs in
a vitest suite, not here.

## Prerequisites

- Docker (for PostgreSQL)
- Node.js 20+
- The workspace must be built — the frontend imports built libs:
  `pnpm turbo build` from the repo root.

## Running

```bash
pnpm setup   # start PostgreSQL, recreate the schema, seed, install chromium
pnpm test    # run the suite (Playwright starts the backend and frontend itself)
```

Other entry points:

```bash
pnpm test:ui       # Playwright UI mode
pnpm test:headed   # watch the browser
pnpm test:debug    # step through with the inspector
pnpm setup:db      # re-seed only (fastest way back to a clean database)
pnpm typecheck     # check the page objects and fixtures compile
```

`pnpm test` does **not** set the database up. Run `pnpm setup` once, then
`pnpm setup:db` whenever you want a clean slate.

## Layout

```
@apps/e2e/
├── fixtures/
│   ├── api.ts             JSON:API client — arranges state, cleans up after itself
│   ├── seed.ts            mirror of the backend e2e seeder + unique-data helpers
│   ├── storage-state.ts   where the signed-in browser state is saved
│   └── test.ts            the `test` every spec imports, with page-object fixtures
├── pages/
│   ├── components/        reusable widgets (table, confirm modal, flash messages)
│   ├── dashboard.page.ts
│   ├── login.page.ts
│   ├── todos.page.ts
│   └── users.page.ts
└── tests/
    ├── auth.setup.ts      signs in once, saves the session
    ├── anonymous/         runs with an empty browser — owns the login flow
    └── authenticated/     runs already signed in
```

### Projects

`playwright.config.ts` defines three:

| Project | Storage state | Contains |
|---|---|---|
| `setup` | — | `auth.setup.ts`, signs in and saves the session |
| `anonymous` | empty | `tests/anonymous/` — login, route guards |
| `authenticated` | from `setup` | `tests/authenticated/` — everything behind the login |

A test in `authenticated/` starts on a page with a valid session, so it never
replays the login form. Put a spec in `anonymous/` only when being logged out is
part of what it checks.

## Writing a test

**Arrange through the API, assert through the UI.** The `api` fixture creates
rows directly and deletes them on teardown. Clicking through three forms to reach
the state you want makes a test slow and gives it extra ways to fail.

```ts
import { unique } from "../../fixtures/seed.ts";
import { expect, test } from "../../fixtures/test.ts";

test("deletes a todo once the modal is confirmed", async ({ api, todosPage, flash }) => {
  const todo = await api.createTodo({ title: unique("Doomed"), description: "delete me" });

  await todosPage.goto();
  await todosPage.table.search(todo.title);
  await todosPage.startDelete(todo.id);
  await todosPage.deleteModal.confirm();

  await expect(todosPage.table.row(todo.id)).toHaveCount(0);
  await expect(flash.success).toContainText("Todo deleted successfully.");
});
```

Rules that keep the suite from rotting:

- **Never hardcode data you also assert on.** Tests share one database and run in
  parallel. Use `unique()` / `uniqueEmail()` from `fixtures/seed.ts`.
- **Address rows by id, not by position.** `table.row(id)` uses the
  `data-test-row` attribute; sort order and page size are not yours to rely on.
- **Put selectors in a page object, never in a spec.** A spec should read as a
  description of the behaviour. When the markup moves, exactly one file changes.
- **Prefer `data-test-*` hooks and roles over CSS classes.** The Triptyk UI
  components expose them (`data-test-tpk-prefab-input-container="firstName"`,
  `data-test-confirm-modal-confirm`, …).
- **No `waitForTimeout`.** Every `expect` in Playwright retries; a fixed sleep is
  either too short (flaky) or too long (slow).
- **Clean up what you create.** The `api` fixture does it for you; if a test
  creates data through the UI, delete it through the UI before it ends.

## Test data

The database is rebuilt from `@apps/backend/src/seeders/e2e.seeder.ts`.
`fixtures/seed.ts` mirrors it — change both together.

| Email | Password | Name |
|-------|----------|------|
| deflorenne.amaury@triptyk.eu | 123456789 | Amaury Deflorenne |
| john.doe@example.com | 123456789 | John Doe |
| jane.smith@example.com | 123456789 | Jane Smith |
| bob.johnson@example.com | 123456789 | Bob Johnson |

No todo is seeded, so todo tests always create their own.

## Known gaps in the app, not in the tests

Things these tests deliberately do not assert, because the app does not do them
yet. Fix the app and the assertion becomes easy to add:

- **A failed login shows no feedback.** `session.authenticate` rejects, nothing
  catches it: the user sees the form again with no message, and an unhandled
  rejection reaches the console. `login.spec.ts` can only assert we stayed on
  `/login`.
- **Saving a user flashes a raw translation key.** `user-form.gts` asks for
  `users.forms.user.messages.createSuccess`, which does not exist in
  `@apps/front/translations/users/*.yaml`; `handleSave` falls back to printing the
  key. Todos are fine — they use `saveSuccess`, which exists.
- **Token refresh is not exercised.** `refreshAccessTokens` is only enabled in
  the `development` environment (`@apps/front/config/environment.js`), and the
  access token lives 15 minutes, so a run never reaches expiry.
- **`/forgot-password` and `/reset-password` are untested.** They need SMTP
  (`SMTP_HOST=localhost:1025` in `.env.e2e`) — a mail catcher in the compose file
  would make them testable.
