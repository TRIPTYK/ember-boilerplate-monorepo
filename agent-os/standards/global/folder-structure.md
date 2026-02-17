# Folder Structure

Standard folders for library organization.

**Frontend libraries (libs/*/src/):**
```
changesets/       # ImmerChangeset classes for forms
components/       # .gts components
handlers/         # WarpDrive request handlers (middleware)
http-mocks/       # MSW mock definitions
routes/           # Route files and templates
schemas/          # WarpDrive resource schemas
services/         # Ember services
validations/      # Zod validation schemas
```

**Backend app (backend-app/src/):**
```
app/              # Application setup, routers
entities/         # MikroORM entities (domain + DB)
features/         # Feature modules
seeders/          # Database seeders
utils/            # Utilities
```

**Purpose:**
- **handlers/** - WarpDrive middleware (e.g., auth header injection)
- **schemas/** - Define WarpDrive resources (frontend data layer)
- **entities/** - Domain models with database mappings (backend)
- **changesets/** - Form state objects

**Why:** Consistent structure across libraries. Clear separation of concerns.
