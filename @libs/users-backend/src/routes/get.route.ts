import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { object, string } from "zod";
import {
  jsonApiSerializeSingleUserDocument,
  SerializedUserSchema,
} from "#src/serializers/user.serializer.js";
import type { UserEntityType } from "#src/entities/user.entity.js";
import { jsonApiErrorDocumentSchema, makeJsonApiError, type Route } from "@libs/backend-shared";

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
            404: jsonApiErrorDocumentSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };

        const user = await this.userRepository.findOne({ id });

        if (!user) {
          return reply.code(404).send(
            makeJsonApiError(404, "Not Found", {
              code: "USER_NOT_FOUND",
              detail: `User with id ${id} not found`,
            }),
          );
        }

        return reply.send(jsonApiSerializeSingleUserDocument(user));
      },
    );
  }
}
