# Service CRUD Pattern

Each entity gets a service in `src/services/{entity}.ts` for CRUD operations via WarpDrive.

## Structure

```typescript
import Service, { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import { createRecord, deleteRecord, updateRecord } from '@warp-drive/utilities/json-api';
import type ImmerChangeset from 'ember-immer-changeset';

export default class {Entity}Service extends Service {
  @service declare store: Store;

  public async save(changeset: ImmerChangeset<Validated{Entity}>) {
    if (changeset.data.id) {
      return this.update(changeset.data as Update{Entity}Data, changeset);
    } else {
      return this.create(changeset.data as Create{Entity}Data, changeset);
    }
  }

  public async create(data: Create{Entity}Data, changeset?: ImmerChangeset<Validated{Entity}>) {
    const record = this.store.createRecord<{Entity}>('{entities}', data);
    const request = createRecord(record);
    // Workaround: manually set request body (may change in future WarpDrive versions)
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(record)),
    });
    await this.store.request(request);
  }

  public async update(data: Update{Entity}Data, changeset?: ImmerChangeset<Validated{Entity}>) {
    const existing = this.store.peekRecord<{Entity}>({ id: data.id, type: '{entities}' });
    assert('{Entity} must exist to be updated', existing);
    const request = updateRecord(existing, { patch: true });
    // Workaround: manually set request body
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existing)),
    });
    await this.store.request(request);
  }

  public async delete(data: Update{Entity}Data) {
    const existing = this.store.peekRecord<{Entity}>({ id: data.id, type: '{entities}' });
    assert('{Entity} must exist to be deleted', existing);
    const request = deleteRecord(existing);
    request.body = JSON.stringify({});
    return this.store.request(request);
  }
}
```

## Key rules

- `save()` dispatches to create/update based on `changeset.data.id`
- Use `peekRecord` for update/delete (record must already be in store)
- Use `createRecord` for new records
- Always `assert` that records exist before update/delete
- `request.body` manual assignment is a workaround — may change in future WarpDrive versions
