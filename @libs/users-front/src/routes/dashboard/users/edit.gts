import type { User } from '#src/schemas/users.ts';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
import { findRecord } from '@warp-drive/utilities/json-api';

export type UsersEditRouteSignature = {
  model: Awaited<ReturnType<UsersEditRoute['model']>>;
  controller: undefined;
};

export default class UsersEditRoute extends Route {
  @service declare store: Store;

  async model({ user_id }: { user_id: string }) {
    const user = await this.store.request(
      findRecord<User>('users', user_id, {
        include: [],
      }),
    );

    assert('User must not be null', user.content.data !== null);
    const data = user.content.data;

    return {
      user: data,
    };
  }
}
