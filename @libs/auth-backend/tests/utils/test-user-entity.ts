import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const TestUserEntity = defineEntity({
  name: "User",
  properties: {
    id: p.string().primary(),
    email: p.string(),
    firstName: p.string(),
    lastName: p.string(),
    password: p.string(),
  },
});

export type TestUserEntityType = InferEntity<typeof TestUserEntity>;
