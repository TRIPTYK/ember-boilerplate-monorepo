# Service CRUD Pattern

Each entity gets a service in `@libs/{entities}-front/src/services/{entity}.ts` for CRUD operations via WarpDrive.

## Structure

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

## Key rules

- `save(data)` receives raw validated data, NOT a changeset
- `save()` dispatches to create/update based on `data.id`
- Types are `Validated{Entity}` (create, id optional) and `Updated{Entity}` (edit, id required) — imported from the validation file
- `update()` must `Object.assign` fields onto the existing record before calling `updateRecord`
- `create`/`update` can be `private` — only `save` and `delete` need to be public
- Use `peekRecord` for update/delete (record must already be in store)
- Use `createRecord` for new records
- Always `assert` that records exist before update/delete
- `request.body` manual assignment is a WarpDrive workaround
