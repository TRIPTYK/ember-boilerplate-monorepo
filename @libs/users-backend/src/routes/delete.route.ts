import type { FastifyInstanceTypeForModule, Route } from "@lib/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { literal, object, string } from "zod";
import type { UserEntityType } from "@lib/entities/user.entity.js";

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
            403: object({
              message: string(),
              code: string(),
            }),
            404: object({
              message: string(),
              code: string(),
            }),
            204: literal(null),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };
        const currentUser = request.user!;

        if (currentUser.id !== id) {
          return reply.code(403).send({
            message: "You can only delete your own profile",
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

        await this.userRepository.getEntityManager().remove(user).flush();

        return reply.code(204).send(null);
      },
    );
  }
}
