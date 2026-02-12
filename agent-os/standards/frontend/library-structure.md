# Frontend Library Structure

Required folder structure for `@libs/[feature]-front` packages.

## Required Structure

```
@libs/[feature]-front/
├── src/
│   ├── index.ts              # Core exports: initialize, moduleRegistry, forRouter
│   ├── assets/               # Static assets (icons, images)
│   │   └── icons/            # SVG icons as .gts components
│   ├── components/           # Glimmer components (.gts)
│   │   └── forms/            # Optional: form components subfolder
│   ├── routes/               # Ember routes (.gts)
│   │   └── dashboard/        # Optional: nested route folders
│   ├── schemas/              # WarpDrive schemas (.ts)
│   ├── services/             # Ember services (.ts)
│   ├── changesets/           # ImmerChangeset definitions (.ts)
│   └── http-mocks/           # MSW handlers (.ts)
│       └── all.ts            # Aggregates all handlers
├── tests/
│   ├── app.ts                # TestApp, TestStore, initializeTestApp
│   ├── test-helper.ts        # Global test hooks (beforeEach, afterEach)
│   ├── utils.ts              # Test utilities
│   ├── integration/          # Integration tests (.gts)
│   └── unit/                 # Unit tests (.gts)
└── package.json
```

## File Naming

- Routes: `[route-name].gts` (e.g., `index.gts`, `create.gts`)
- Templates: `[route-name]-template.gts` (e.g., `index-template.gts`)
- Components: `[component-name].gts` (e.g., `todo-table.gts`)
- Services: `[service-name].ts` (e.g., `todo.ts`)
- Schemas: `[entity-name].ts` (e.g., `todos.ts`)
- Changesets: `[entity-name].ts` (e.g., `todo.ts`)
- Icons: `[icon-name].gts` (e.g., `edit.gts`, `delete.gts`)

## Optional Folders

- `handlers/` - WarpDrive request handlers (e.g., auth handlers)
- `components/forms/` - Form components subfolder when multiple forms exist
- `routes/dashboard/` - Nested route structure for dashboard features

## Required Files

- `src/index.ts` - Must export `initialize()`, `moduleRegistry()`, `forRouter()`
- `tests/app.ts` - Must export `TestApp`, `TestStore`, `initializeTestApp()`
- `tests/test-helper.ts` - Global test setup hooks
- `src/http-mocks/all.ts` - Aggregates all MSW handlers for export
