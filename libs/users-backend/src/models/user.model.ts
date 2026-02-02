import { defineEntity, p } from '@mikro-orm/core';

export const UserSchema = defineEntity({
  name: 'User',
  properties: {
    id: p.integer().primary(),
    email: p.string(),
    username: p.string(),
  },
});

