# Frontend Lib Structure

New frontend libs live in `@libs/{name}-front/`.

## Required folder structure

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

## addon-main.cjs

Copy as-is for every lib:

```javascript
'use strict';
const { addonV1Shim } = require('@embroider/addon-shim');
module.exports = addonV1Shim(__dirname, {
  isDevelopingAddon() { return true; },
});
```

## package.json

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

## rollup.config.mjs

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

## Key rules

- Lib type: Ember Addon v2 (Embroider)
- `#src/*` alias for internal imports
- No acceptance tests in libs — only integration and unit tests
- Translations managed by the app, not the lib
- `tsconfig.json` and `tsconfig.publish.json`: copy from `@libs/todos-front`
