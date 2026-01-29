import type { User } from "#src/schemas/users.ts";
import { type ValidatedUser } from "#src/components/forms/user-validation.ts";
import { assert } from "@ember/debug";
import Service from "@ember/service";
import { service } from "@ember/service";
import { cacheKeyFor, type Store } from "@warp-drive/core";
import { createRecord, updateRecord } from '@warp-drive/utilities/json-api';

type CreateUserData = ValidatedUser & { id: undefined };
type UpdateUserData = ValidatedUser & { id: string };

export default class UserService extends Service {
  @service declare store: Store;

  public async save(data: ValidatedUser) {
    if (data.id) {
      return this.update(data as UpdateUserData);
    } else {
      return this.create(data as CreateUserData);
    }
  }

  private create(data: CreateUserData) {
    const user = this.store.createRecord<User>('users', data);
    const request = createRecord(user);

    request.body = JSON.stringify(
      {
        data: this.store.cache.peek(cacheKeyFor(user))
      }
    );

    return this.store.request(request);
  }

  private update(data: UpdateUserData) {
    const existingUser = this.store.peekRecord<User>({ id: data.id, type: 'users' });
    assert('User must exist to be updated', existingUser);
    const request = updateRecord(existingUser);

    request.body = JSON.stringify(
      {
        data: this.store.cache.peek(cacheKeyFor(existingUser))
      }
    );

    return this.store.request(request);
  }
}
