import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const UserEntity = defineEntity({
  name: "User",
  properties: {
    id: p.string().primary(),
    email: p.string(),
    firstName: p.string(),
    lastName: p.string(),
    password: p.string(),
  },
});

export type UserEntityType = InferEntity<typeof UserEntity>;
