import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { wrap, type EntityRepository } from "@mikro-orm/core";
import { object, string } from "zod";
import {
  jsonApiSerializeSingleUserDocument,
  SerializedUserSchema,
} from "#src/serializers/user.serializer.js";
import type { UserEntityType } from "#src/entities/user.entity.js";
import { makeSingleJsonApiTopDocument, type Route } from "@libs/backend-shared";

export class UpdateRoute implements Route {
  public constructor(private userRepository: EntityRepository<UserEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.patch(
      "/:id",
      {
        schema: {
          params: object({
            id: string(),
          }),
          body: makeSingleJsonApiTopDocument(SerializedUserSchema),
          response: {
            200: makeSingleJsonApiTopDocument(SerializedUserSchema),
            403: object({
              message: string(),
              code: string(),
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
        const body = request.body;
        const currentUser = request.user!;

        // Authorization: users can only update themselves
        if (currentUser.id !== id) {
          return reply.code(403).send({
            message: "You can only update your own profile",
            code: "FORBIDDEN",
          });
        }

        const user = await this.userRepository.findOne({ id });

        if (!user) {
          return reply.code(404).send({
            message: `User with id ${id} not found`,
            code: "USER_NOT_FOUND",
          });
        }

        wrap(user).assign(body.data.attributes);

        await this.userRepository.getEntityManager().flush();

        return reply.send(jsonApiSerializeSingleUserDocument(user));
      },
    );
  }
}
