# Schema & Changeset Definitions

## WarpDrive Schema

`src/schemas/{entities}.ts` — defines the data shape for the store:

```typescript
import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const {Entity}Schema = withDefaults({
  type: '{entities}',
  fields: [
    { name: 'title', kind: 'attribute' },
    { name: 'description', kind: 'attribute' },
    { name: 'completed', kind: 'attribute' },
  ],
});

export default {Entity}Schema;

export type {Entity} = WithLegacy<{
  title: string;
  description: string;
  completed: boolean;
  [Type]: '{entities}';
}>;
```

- Schema `type` matches the API resource type (plural)
- Export both the schema (default) and the type (named)
- Uses `@warp-drive/legacy` API intentionally

## Changeset

`src/changesets/{entity}.ts` — immutable form state wrapper:

```typescript
import ImmerChangeset from 'ember-immer-changeset';

export interface Draft{Entity} {
  id?: string | null;
  title?: string;
  description?: string;
  completed?: boolean;
}

export class {Entity}Changeset extends ImmerChangeset<Draft{Entity}> {}
```

- All fields are optional (form may be partially filled)
- `id` is `string | null | undefined` — null for new records
