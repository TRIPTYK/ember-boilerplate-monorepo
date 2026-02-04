import type { User } from '#src/schemas/users.ts';
import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { Store } from '@warp-drive/core';
import { query } from '@warp-drive/utilities/json-api';
import type SessionService from 'ember-simple-auth/services/session';
import type { ReactiveDataDocument } from '@warp-drive/core/reactive';

export default class CurrentUserService extends Service {
  @service declare store: Store;
  @service declare session: SessionService;
  @tracked user?: User;

  get currentUser(): User {
    if (!this.user) {
      throw new Error('No current user set');
    }

    return this.user;
  }

  async load() {
    if (!this.session.isAuthenticated) {
      this.user = undefined;
      return;
    }

    const response = await this.store.request<ReactiveDataDocument<User>>(
      query<User>(
        'users',
        {},
        {
          resourcePath: 'users/profile',
        },
      ),
    );

    this.user = response.content.data;
  }
}
