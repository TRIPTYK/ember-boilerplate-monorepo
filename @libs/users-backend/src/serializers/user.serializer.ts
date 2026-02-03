import type { UserEntityType } from "@lib/entities/user.entity.js";
import { email, literal, object, string, ZodObject } from "zod";
import { z } from "zod";

export const makeJsonApiDocumentSchema = <T extends ZodObject>(type: string, attributesSchema: T) =>
  object({
    id: string(),
    type: literal(type),
    attributes: attributesSchema,
  });

export const SerializedUserSchema = makeJsonApiDocumentSchema(
  "users",
  object({
    email: email(),
    firstName: string(),
    lastName: string(),
  }),
);

export const makeSingleJsonApiTopDocument = <T extends ZodObject>(dataSchema: T) =>
  object({
    data: dataSchema,
    meta: z.optional(z.record(z.string(), z.unknown())),
  });

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
