import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import UserSchema from '@libs/users-front/schemas/users';
import { setBuildURLConfig } from '@warp-drive/utilities';
import { CacheHandler, Fetch, RequestManager } from '@warp-drive/core';
import type Owner from '@ember/owner';
import { LegacyNetworkHandler } from '@warp-drive/legacy/compat';
import { setOwner } from '@ember/owner';
import AuthHandler from '@libs/auth-front/handlers/auth';
import { getOwner } from '@ember/owner';
import TodoSchema from '@libs/todos-front/schemas/todos';
import TreatmentSchema from '@libs/treatment-front/schemas/treatments';
import SettingSchema from '@libs/treatment-front/schemas/settings';

setBuildURLConfig({
  host: null,
  namespace: 'api/v1',
});

const legacyStore = useLegacyStore({
  linksMode: false,
  legacyRequests: true,
  modelFragments: true,
  cache: JSONAPICache,
  schemas: [UserSchema, TodoSchema, TreatmentSchema, SettingSchema],
  handlers: [],
});

export default class MyStore extends legacyStore {
  constructor(owner: Owner) {
    super(owner);

    const authHandler = new AuthHandler();
    setOwner(authHandler, getOwner(this)!);

    const manager = new RequestManager();

    setOwner(this.requestManager, getOwner(this)!);

    this.requestManager = manager
      .use([authHandler, LegacyNetworkHandler, Fetch])
      .useCache(CacheHandler);
  }
}
