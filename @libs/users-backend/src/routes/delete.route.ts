import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { literal, object, string } from "zod";
import type { UserEntityType } from "#src/entities/user.entity.js";
import { jsonApiErrorDocumentSchema, makeJsonApiError, type Route } from "@libs/backend-shared";

export class DeleteRoute implements Route {
  public constructor(private userRepository: EntityRepository<UserEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.delete(
      "/:id",
      {
        schema: {
          params: object({
            id: string(),
          }),
          response: {
            403: jsonApiErrorDocumentSchema,
            404: jsonApiErrorDocumentSchema,
            204: literal(null),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };
        const currentUser = request.user!;

        if (currentUser.id === id) {
          return reply.code(403).send(
            makeJsonApiError(403, "Forbidden", {
              code: "FORBIDDEN",
              detail: "You cannot delete your own profile",
            }),
          );
        }

        const user = await this.userRepository.findOne({ id });

        if (!user) {
          return reply.code(404).send(
            makeJsonApiError(404, "Not Found", {
              code: "USER_NOT_FOUND",
              detail: `User with id ${id} not found`,
            }),
          );
        }

        await this.userRepository.getEntityManager().remove(user).flush();

        return reply.code(204).send(null);
      },
    );
  }
}
