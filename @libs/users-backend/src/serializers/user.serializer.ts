import type { UserEntityType } from "#src/entities/user.entity.js";
import { email, object, string } from "zod";
import { z } from "zod";
import { makeJsonApiDocumentSchema } from "@libs/backend-shared";

export const SerializedUserSchema = makeJsonApiDocumentSchema(
  "users",
  object({
    email: email(),
    firstName: string(),
    lastName: string(),
  }),
);

export function jsonApiSerializeUser(user: UserEntityType): z.infer<typeof SerializedUserSchema> {
  return {
    id: user.id,
    type: "users" as const,
    attributes: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
}

export function jsonApiSerializeManyUsers(users: UserEntityType[]) {
  return users.map(jsonApiSerializeUser);
}

export function jsonApiSerializeSingleUserDocument(user: UserEntityType) {
  return {
    data: jsonApiSerializeUser(user),
  };
}

export function jsonApiSerializeManyUsersDocument(users: UserEntityType[]) {
  return {
    data: jsonApiSerializeManyUsers(users),
  };
}
