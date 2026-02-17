import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { literal, object, string } from "zod";
import type { TodoEntityType } from "#src/entities/todo.entity.js";
import {
  jsonApiErrorDocumentSchema,
  makeJsonApiError,
  makeSingleJsonApiTopDocument,
  type Route,
} from "@libs/backend-shared";

export class DeleteRoute implements Route {
  public constructor(private todoRepository: EntityRepository<TodoEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.delete(
      "/:id",
      {
        schema: {
          params: object({
            id: string(),
          }),
          response: {
            404: jsonApiErrorDocumentSchema,
            204: makeSingleJsonApiTopDocument(literal(null)),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };
        const currentUser = request.user!;

        const todo = await this.todoRepository.findOne({ id, userId: currentUser.id });

        if (!todo) {
          return reply.code(404).send(
            makeJsonApiError(404, "Not Found", {
              code: "TODO_NOT_FOUND",
              detail: `Todo with id ${id} not found`,
            }),
          );
        }

        await this.todoRepository.getEntityManager().remove(todo).flush();

        return reply.code(204).send({
          data: null,
        });
      },
    );
  }
}
