import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import UserSchema from '@libs/users/schemas/users';
import { setBuildURLConfig } from '@warp-drive/utilities';

setBuildURLConfig({
  host: null,
  namespace: 'api/v1'
});

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
