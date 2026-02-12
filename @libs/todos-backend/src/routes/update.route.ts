import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { wrap, type EntityRepository } from "@mikro-orm/core";
import { object, string } from "zod";
import {
  jsonApiSerializeSingleTodoDocument,
  SerializedTodoSchema,
} from "#src/serializers/todo.serializer.js";
import type { TodoEntityType } from "#src/entities/todo.entity.js";
import {
  jsonApiErrorDocumentSchema,
  makeJsonApiError,
  makeSingleJsonApiTopDocument,
  type Route,
} from "@libs/backend-shared";

export class UpdateRoute implements Route {
  public constructor(private todoRepository: EntityRepository<TodoEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.patch(
      "/:id",
      {
        schema: {
          params: object({
            id: string(),
          }),
          body: makeSingleJsonApiTopDocument(SerializedTodoSchema),
          response: {
            200: makeSingleJsonApiTopDocument(SerializedTodoSchema),
            404: jsonApiErrorDocumentSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body;
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

        wrap(todo).assign(body.data.attributes);

        await this.todoRepository.getEntityManager().flush();

        return reply.send(jsonApiSerializeSingleTodoDocument(todo));
      },
    );
  }
}
