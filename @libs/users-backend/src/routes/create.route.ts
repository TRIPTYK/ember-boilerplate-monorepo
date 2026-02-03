import type { FastifyInstanceTypeForModule, Route } from "@lib/init.js";
import { type UserEntityType } from "@lib/entities/user.entity.js";
import type { EntityRepository } from "@mikro-orm/core";
import { randomUUID } from "crypto";
import {
  jsonApiSerializeSingleUserDocument,
  makeSingleJsonApiTopDocument,
  SerializedUserSchema,
} from "@lib/serializers/user.serializer.js";
import { hash } from "argon2";
import { email, object, string } from "zod";

export class CreateRoute implements Route {
  public constructor(private userRepository: EntityRepository<UserEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/",
      {
        schema: {
          body: makeSingleJsonApiTopDocument(object({
            id: string().optional(),
            attributes: object({
              email: email(),
              firstName: string(),
              lastName: string(),
              password: string(),
            })
          })),
          response: {
            200: makeSingleJsonApiTopDocument(SerializedUserSchema),
          },
        },
      },
      async (request, reply) => {
        const body = request.body.data.attributes;

        const password = await hash(body.password);

        const user = this.userRepository.create({
          id: request.body.data.id || randomUUID(),
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          password,
        });

        await this.userRepository.getEntityManager().flush();

        return reply.send(jsonApiSerializeSingleUserDocument(user));
      },
    );
  }
}
