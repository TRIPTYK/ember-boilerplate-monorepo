import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { TodoEntityType } from "#src/entities/todo.entity.js";
import type { EntityRepository } from "@mikro-orm/core";
import { randomUUID } from "crypto";
import {
  jsonApiSerializeSingleTodoDocument,
  SerializedTodoSchema,
} from "#src/serializers/todo.serializer.js";
import { boolean, object, string } from "zod";
import { makeSingleJsonApiTopDocument, type Route } from "@libs/backend-shared";

export class CreateRoute implements Route {
  public constructor(private todoRepository: EntityRepository<TodoEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/",
      {
        schema: {
          body: makeSingleJsonApiTopDocument(
            object({
              id: string().optional().nullable(),
              attributes: object({
                title: string(),
                description: string().optional().nullable(),
                completed: boolean().optional(),
              }),
            }),
          ),
          response: {
            200: makeSingleJsonApiTopDocument(SerializedTodoSchema),
          },
        },
      },
      async (request, reply) => {
        const body = request.body.data.attributes;
        const currentUser = request.user!;

        const todo = this.todoRepository.create({
          id: request.body.data.id || randomUUID(),
          title: body.title,
          description: body.description ?? null,
          completed: body.completed ?? false,
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        await this.todoRepository.getEntityManager().flush();

        return reply.send(jsonApiSerializeSingleTodoDocument(todo));
      },
    );
  }
}
