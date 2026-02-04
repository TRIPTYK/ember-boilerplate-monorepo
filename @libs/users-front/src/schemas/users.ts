import {
  withDefaults,
  type WithLegacy,
} from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const UserSchema = withDefaults({
  type: 'users',
  fields: [
    { name: 'firstName', kind: 'attribute' },
    { name: 'lastName', kind: 'attribute' },
    { name: 'email', kind: 'attribute' },
  ],
});

export default UserSchema;

export type User = WithLegacy<{
  firstName: string;
  lastName: string;
  email: string;
  [Type]: 'users';
}>;
