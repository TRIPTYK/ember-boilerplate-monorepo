import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { object, string } from "zod";
import {
  jsonApiSerializeSingleUserDocument,
  SerializedUserSchema,
} from "#src/serializers/user.serializer.js";
import type { UserEntityType } from "#src/entities/user.entity.js";
import type { Route } from "@libs/backend-shared";

export class GetRoute implements Route {
  public constructor(private userRepository: EntityRepository<UserEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.get(
      "/:id",
      {
        schema: {
          params: object({
            id: string(),
          }),
          response: {
            200: object({
              data: SerializedUserSchema,
            }),
            404: object({
              message: string(),
              code: string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };

        const user = await this.userRepository.findOne({ id });

        if (!user) {
          return reply.code(404).send({
            message: `User with id ${id} not found`,
            code: "USER_NOT_FOUND",
          });
        }

        return reply.send(jsonApiSerializeSingleUserDocument(user));
      },
    );
  }
}
