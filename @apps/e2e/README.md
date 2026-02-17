# E2E Tests

End-to-end tests using Playwright that run against the real backend.

## Prerequisites

- Docker (for PostgreSQL)
- Node.js 20+

## Running Tests

### Quick Start (Recommended)

Run the full setup and tests with a single command:

```bash
pnpm test
```

This will:
1. Start PostgreSQL if not running
2. Setup the database schema and seed test data
3. Install Playwright browsers if needed
4. Start the backend and frontend servers
5. Run all e2e tests

### Other Commands

```bash
# Run tests with Playwright UI
pnpm test:ui

# Run tests in headed mode (see the browser)
pnpm test:headed

# Run tests in debug mode
pnpm test:debug

# Only run setup (without running tests)
pnpm setup
```

## Test Data

The e2e seeder (`@apps/backend/src/seeders/e2e.seeder.ts`) creates the following test users:

| Email | Password | Name |
|-------|----------|------|
| deflorenne.amaury@triptyk.eu | 123456789 | Amaury Deflorenne |
| john.doe@example.com | 123456789 | John Doe |
| jane.smith@example.com | 123456789 | Jane Smith |
| bob.johnson@example.com | 123456789 | Bob Johnson |

## Project Structure

```
@apps/e2e/
├── tests/              # Test files
│   ├── login.spec.ts
│   └── users-dashboard.spec.ts
├── scripts/
│   └── setup.ts        # Setup script
├── playwright.config.ts
└── package.json
```
