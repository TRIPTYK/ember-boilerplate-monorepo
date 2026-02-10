import type { User } from '#src/schemas/users.ts';
import { type ValidatedUser } from '#src/components/forms/user-validation.ts';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import { createRecord, deleteRecord, updateRecord } from '@warp-drive/utilities/json-api';
import type ImmerChangeset from 'ember-immer-changeset';

type CreateUserData = ValidatedUser & { id: undefined };
type UpdateUserData = ValidatedUser & { id: string };

export default class UserService extends Service {
  @service declare store: Store;

  public async save(changeset: ImmerChangeset<ValidatedUser>) {
    if (changeset.data.id) {
      return this.update(changeset.data as UpdateUserData, changeset);
    } else {
      return this.create(changeset.data as CreateUserData, changeset);
    }
  }

  public async delete(data: UpdateUserData) {
    const existingUser = this.store.peekRecord<User>({
      id: data.id,
      type: 'users',
    });
    assert('User must exist to be deleted', existingUser);
    const request = deleteRecord(existingUser);
    request.body = JSON.stringify({});
    return this.store.request(request);
  }

  private async create(data: CreateUserData, changeset: ImmerChangeset<ValidatedUser>) {
    const user = this.store.createRecord<User>('users', data);
    const request = createRecord(user);

    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(user)),
    });

    await this.store.request(request);
  }

  private async update(data: UpdateUserData, changeset: ImmerChangeset<ValidatedUser>) {
    const existingUser = this.store.peekRecord<User>({
      id: data.id,
      type: 'users',
    });
    assert('User must exist to be updated', existingUser);
    const request = updateRecord(existingUser);

    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existingUser)),
    });

    await this.store.request(request);
  }
}
