import { withDefaults, type WithLegacy } from '@warp-drive/legacy/model/migration-support';
import { Type } from '@warp-drive/core/types/symbols';
import type { HasMany } from '@warp-drive/legacy/model';

const UserSchema = withDefaults({
  type: 'users',
  fields: [
    { name: 'name', kind: 'attribute' },
    { name: 'email', kind: 'attribute' },
    { name: 'createdAt', kind: 'attribute' },
  ],
});

export default UserSchema;

export type User = WithLegacy<{
  firstName: string;
  lastName: string;
  age: number;
  friends: HasMany<User>;
  bestFriend: User | null;
  [Type]: 'users';
}>
