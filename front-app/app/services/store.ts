import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import UserSchema from '@libs/users/schemas/users';
import { Fetch } from '@warp-drive/core';
import AuthHandler from '@libs/users/handlers/auth';

const legacyStore = useLegacyStore({
  linksMode: false,
  legacyRequests: true,
  modelFragments: true,
  cache: JSONAPICache,
  schemas: [
     UserSchema
  ],
});

export default legacyStore;
