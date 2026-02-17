# Ember Boilerplate v2

Monorepo with an Ember frontend and a Fastify backend, managed with pnpm workspaces and Turborepo.

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | Ember 6 (Octane) + Embroider/Vite  |
| Backend      | Fastify 5 + vite-node              |
| Database     | PostgreSQL 16 + MikroORM           |
| Styling      | Tailwind CSS 4 + DaisyUI 5         |
| Testing      | Vitest, Playwright                  |
| Language     | TypeScript                          |
| Monorepo     | pnpm workspaces + Turborepo        |
| Linting      | oxlint, ESLint, Stylelint, oxfmt   |
| Git hooks    | Lefthook + git-conventional-commits |

## Prerequisites

- **Node 24** (managed via [Volta](https://volta.sh/) — `volta install node@24`)
- **pnpm 10.28.1**
- **Docker** (for PostgreSQL)

## Project Structure

```
@apps/
├── front             # Ember frontend application
├── backend           # Fastify REST API server
└── e2e               # Playwright end-to-end tests

@libs/
├── backend-shared    # Shared utilities and types for backend services
├── shared-front      # Shared frontend components, services, and utilities
├── todos-backend     # Todos domain — backend (entities, routes, schemas)
├── todos-front       # Todos domain — frontend (components, routes, services)
├── users-backend     # Users domain — backend (auth, entities, emails)
├── users-front       # Users domain — frontend (auth UI, user management)
└── repo-utils        # Shared build and dev configurations
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 16 on `localhost:5432` (user: `backend_user`, password: `backend_user`, database: `database_dev`).

### 3. Set up and run the backend

From `@apps/backend`:

```bash
pnpm schema:fresh   # Create tables and seed the database
pnpm dev             # Start the dev server
```

### 4. Run the frontend

From `@apps/front`:

- **With mocked API (default):** `pnpm start`
- **With the real backend:** `pnpm start:with-back` (proxies `/api` to `http://localhost:8000`)

### 5. Or run everything from the root

```bash
pnpm dev
```

This starts the backend and the frontend concurrently.

## E2E Tests

From `@apps/e2e`:

```bash
pnpm setup      # Prepare the test database and environment
pnpm test:ui    # Run tests with the Playwright UI
pnpm test       # Run tests in headless mode
```

## Scripts

Key scripts available at the root:

| Script           | Description                               |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Run backend + frontend concurrently       |
| `pnpm lint`      | Lint all packages                         |
| `pnpm lint:fix`  | Auto-fix lint issues across all packages  |
| `pnpm format`    | Format code across all packages           |

## Git Conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) enforced via Lefthook + git-conventional-commits.

Allowed commit types: `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `build`, `ops`, `docs`, `chore`, `merge`, `revert`.

## API Documentation

When the backend is running, Swagger UI is available at [`/documentation`](http://localhost:8000/documentation).
