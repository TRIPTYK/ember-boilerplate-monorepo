import type { User } from '#src/schemas/users.ts';
import {
  type UpdatedUser,
  type ValidatedUser,
} from '#src/components/forms/user-validation.ts';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import {
  createRecord,
  deleteRecord,
  updateRecord,
} from '@warp-drive/utilities/json-api';

export default class UserService extends Service {
  @service declare store: Store;

  public async save(data: ValidatedUser | UpdatedUser) {
    if (data.id) {
      return this.update(data as UpdatedUser);
    } else {
      return this.create(data as ValidatedUser);
    }
  }

  public async delete(data: UpdatedUser) {
    const existingUser = this.store.peekRecord<User>({
      id: data.id,
      type: 'users',
    });
    assert('User must exist to be deleted', existingUser);
    const request = deleteRecord(existingUser);
    request.body = JSON.stringify({});
    return this.store.request(request);
  }

  private async create(data: ValidatedUser) {
    const user = this.store.createRecord<User>('users', data);
    const request = createRecord(user);

    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(user)),
    });

    await this.store.request(request);
  }

  private async update(data: UpdatedUser) {
    const existingUser = this.store.peekRecord<User>({
      id: data.id,
      type: 'users',
    });
    assert('User must exist to be updated', existingUser);

    Object.assign(existingUser, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });

    const request = updateRecord(existingUser, { patch: true });

    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existingUser)),
    });

    await this.store.request(request);
  }
}
