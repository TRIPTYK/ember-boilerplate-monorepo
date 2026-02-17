# Standards for SQLite WASM Foundation

The following standards apply to this work and inform the implementation approach.

---

## frontend/lib-structure

New frontend libs live in `@libs/{name}-front/`.

### Required folder structure

```
@libs/{name}-front/
├── src/
│   ├── index.ts              # Entry point: initialize(), moduleRegistry(), forRouter()
│   ├── assets/icons/          # SVG icon components (.gts)
│   ├── changesets/            # ImmerChangeset type wrappers
│   ├── components/
│   │   └── forms/             # Form components + validation schemas
│   ├── http-mocks/            # MSW mock handlers + all.ts aggregator
│   ├── routes/dashboard/{entity}/  # Route handlers + templates
│   ├── schemas/               # WarpDrive schema definitions
│   ├── services/              # Ember services (CRUD, etc.)
│   └── styles/                # CSS styles
├── tests/
│   ├── integration/           # Integration tests
│   ├── unit/                  # Unit tests
│   ├── app.ts                 # TestApp + TestStore classes
│   ├── test-helper.ts         # Global test hooks
│   └── utils.ts               # Test utilities
├── addon-main.cjs
├── package.json
├── rollup.config.mjs
├── tsconfig.json
└── tsconfig.publish.json
```

### addon-main.cjs

Copy as-is for every lib:

```javascript
'use strict';
const { addonV1Shim } = require('@embroider/addon-shim');
module.exports = addonV1Shim(__dirname, {
  isDevelopingAddon() { return true; },
});
```

### package.json

Key sections to adapt:

```jsonc
{
  "name": "@libs/{name}-front",
  "imports": { "#src/*": "./src/*" },
  "exports": {
    ".": { "types": "./declarations/index.d.ts", "default": "./dist/index.js" },
    "./addon-main.js": "./addon-main.cjs",
    "./*.css": "./dist/*.css",
    "./*": { "types": "./declarations/*.d.ts", "default": "./dist/*.js" }
  }
}
```

Copy `dependencies` and `devDependencies` from `@libs/todos-front/package.json`. Add entity-specific deps as needed.

### rollup.config.mjs

```javascript
import { babel } from '@rollup/plugin-babel';
import { Addon } from '@embroider/addon-dev/rollup';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import alias from '@rollup/plugin-alias';
import {
  moveRouteTemplatesPlugin,
  fileNameMapper,
} from '@libs/repo-utils/configs/addon/mapper-plugin.mjs';

const addon = new Addon({ srcDir: 'src', destDir: 'dist' });
const rootDirectory = dirname(fileURLToPath(import.meta.url));
const babelConfig = resolve(rootDirectory, './babel.publish.config.cjs');
const tsConfig = resolve(rootDirectory, './tsconfig.publish.json');

export default {
  output: addon.output(),
  plugins: [
    alias({ entries: [{ find: '#src', replacement: resolve(rootDirectory, 'src') }] }),
    moveRouteTemplatesPlugin(),
    addon.publicEntrypoints(['**/*.js', 'index.js', 'template-registry.js', '**/*.yaml']),
    addon.appReexports(
      [
        'components/**/*-form.js',
        'helpers/**/*.js',
        'routes/**/*.js',
        'modifiers/**/*.js',
        'services/**/*.js',
        'handlers/**/*.js',
        'templates/**/*.js',
        'schemas/**/*.js',
      ],
      { mapFilename: fileNameMapper },
    ),
    addon.dependencies(),
    babel({ extensions: ['.js', '.gjs', '.ts', '.gts'], babelHelpers: 'bundled', configFile: babelConfig }),
    addon.hbs(),
    addon.gjs(),
    addon.declarations('declarations', `pnpm ember-tsc --declaration --project ${tsConfig}`),
    addon.keepAssets(['**/*.css']),
    addon.clean(),
  ],
};
```

### Key rules

- Lib type: Ember Addon v2 (Embroider)
- `#src/*` alias for internal imports
- No acceptance tests in libs — only integration and unit tests
- Translations managed by the app, not the lib
- `tsconfig.json` and `tsconfig.publish.json`: copy from `@libs/todos-front`

---

## frontend/app-integration

Steps to wire a new frontend lib into `@apps/front`:

### 1. Add dependency

`@apps/front/package.json`:
```json
"devDependencies": {
  "@libs/{name}-front": "workspace:^"
}
```
Then run `pnpm install`.

### 2. Initialize lib

`@apps/front/app/routes/application.ts`:
```typescript
import { initialize as initialize{Name}Lib } from '@libs/{name}-front';
import { getOwner } from '@ember/-internals/owner';

// In beforeModel():
await initialize{Name}Lib(getOwner(this)!);
// or without await if initialize is sync
```

### 3. Register mock handlers

Same file, `routes/application.ts`:
```typescript
import all{Name}Handlers from '@libs/{name}-front/http-mocks/all';

// In beforeModel(), add to setupWorker:
const worker = setupWorker(...allUsersHandlers, ...all{Name}Handlers);
```

### 4. Register routes

`@apps/front/app/router.ts`:
```typescript
import { forRouter as {name}LibRouter } from '@libs/{name}-front';

Router.map(function () {
  this.route('dashboard', { path: '/' }, function () {
    {name}LibRouter.call(this);
  });
});
```

### 5. Register schema in store

`@apps/front/app/services/store.ts`:
```typescript
import {Entity}Schema from '@libs/{name}-front/schemas/{entities}';

// Add to useLegacyStore schemas array:
schemas: [UserSchema, {Entity}Schema],
```

### 6. Add CSS source

`@apps/front/app/styles/app.css`:
```css
@source "../../node_modules/@libs/{name}-front";
```

### 7. Add translations

Create translation files in:
```
@apps/front/app/translations/{entities}/en-us.yaml
@apps/front/app/translations/{entities}/fr-fr.yaml
```

---

## frontend/service-crud

Each entity gets a service in `@libs/{entities}-front/src/services/{entity}.ts` for CRUD operations via WarpDrive.

### Structure

`save()` receives **raw validated data** (not a changeset). Types come from the validation file.

```typescript
import type { {Entity} } from '#src/schemas/{entities}.ts';
import {
  type Updated{Entity},
  type Validated{Entity},
} from '#src/components/forms/{entity}-validation.ts';
import { assert } from '@ember/debug';
import Service, { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import { createRecord, deleteRecord, updateRecord } from '@warp-drive/utilities/json-api';

export default class {Entity}Service extends Service {
  @service declare store: Store;

  public async save(data: Validated{Entity} | Updated{Entity}) {
    if (data.id) {
      return this.update(data as Updated{Entity});
    } else {
      return this.create(data as Validated{Entity});
    }
  }

  public async create(data: Validated{Entity}) {
    const record = this.store.createRecord<{Entity}>('{entities}', data);
    const request = createRecord(record);
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(record)),
    });
    await this.store.request(request);
  }

  public async update(data: Updated{Entity}) {
    const existing = this.store.peekRecord<{Entity}>({ id: data.id, type: '{entities}' });
    assert('{Entity} must exist to be updated', existing);

    Object.assign(existing, {
      // assign each field from data to the existing record
      title: data.title,
    });

    const request = updateRecord(existing, { patch: true });
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existing)),
    });
    await this.store.request(request);
  }

  public async delete(data: Updated{Entity}) {
    const existing = this.store.peekRecord<{Entity}>({ id: data.id, type: '{entities}' });
    assert('{Entity} must exist to be deleted', existing);
    const request = deleteRecord(existing);
    request.body = JSON.stringify({});
    return this.store.request(request);
  }
}
```

### Key rules

- `save(data)` receives raw validated data, NOT a changeset
- `save()` dispatches to create/update based on `data.id`
- Types are `Validated{Entity}` (create, id optional) and `Updated{Entity}` (edit, id required) — imported from the validation file
- `update()` must `Object.assign` fields onto the existing record before calling `updateRecord`
- `create`/`update` can be `private` — only `save` and `delete` need to be public
- Use `peekRecord` for update/delete (record must already be in store)
- Use `createRecord` for new records
- Always `assert` that records exist before update/delete
- `request.body` manual assignment is a WarpDrive workaround

**Note**: For SQLite services, adapt this pattern to use repositories instead of WarpDrive store.

---

## backend/entity-definitions

Use MikroORM's functional `defineEntity` API (not decorators).

### Pattern

```ts
import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const TodoEntity = defineEntity({
  name: "Todo",
  properties: {
    id: p.string().primary(),
    title: p.string(),
    completed: p.boolean().default(false),
    userId: p.string().index(),
    createdAt: p.string().onCreate(() => new Date().toISOString()),
    updatedAt: p.string().onCreate(() => new Date().toISOString()),
  },
});

export type TodoEntityType = InferEntity<typeof TodoEntity>;
```

### Rules

- Always export both the entity (`TodoEntity`) and its inferred type (`TodoEntityType`)
- Use `p.string()`, `p.boolean()`, `p.date()` etc. with chained modifiers: `.primary()`, `.nullable()`, `.index()`, `.default()`, `.onCreate()`
- Use `tableName` when the table name differs from the entity name (e.g., `refresh_tokens`)
- **Store dates as ISO strings** (`p.string()` + `.onCreate(() => new Date().toISOString())`), not Date objects — keeps the format consistent across DB, API, and frontend

### Updates

Use `wrap(entity).assign()` for partial updates, then `em.flush()`:

```ts
wrap(todo).assign(body.data.attributes);
await repository.getEntityManager().flush();
```

### File naming

`{entity}.entity.ts` (e.g., `user.entity.ts`, `todo.entity.ts`)

**Note**: For SQLite entities, adapt this pattern to create a similar `defineEntity()` API that generates SQLite CREATE TABLE statements.
