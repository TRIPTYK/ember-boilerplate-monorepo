import { service } from '@ember/service';
import type { NextFn } from '@warp-drive/core/request';
import type { RequestContext } from '@warp-drive/core/types/request';
import type SessionService from 'ember-simple-auth/services/session';

export default class AuthHandler {
  @service declare session: SessionService;

  request<T>(context: RequestContext, next: NextFn<T>) {
    const headers = new Headers(context.request.headers);
    headers.append(
      'Authorization',
      `Bearer ${this.session.data.authenticated.access_token}`,
    );

    return next(Object.assign({}, context.request, { headers }));
  }
}
