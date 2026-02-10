import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { TodoEntity } from "#src/entities/todo.entity.js";
import type { EntityManager } from "@mikro-orm/core";
import { array, number, object } from "zod";
import {
  jsonApiSerializeManyTodos,
  SerializedTodoSchema,
} from "#src/serializers/todo.serializer.js";
import type { Route } from "@libs/backend-shared";

export class ListRoute implements Route {
  public constructor(private em: EntityManager) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.get(
      "/",
      {
        schema: {
          response: {
            200: object({
              data: array(SerializedTodoSchema),
              meta: object({
                total: number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const currentUser = request.user!;
        const queryParams = request.query as Record<string, any>;
        const searchQuery = queryParams["filter[search]"] as string | undefined;
        const sortParam = queryParams["sort"] as string | undefined;

        const where: any = { userId: currentUser.id };

        if (searchQuery) {
          where.title = { $like: `%${searchQuery}%` };
        }

        let orderBy: any = {};
        if (sortParam) {
          const isDescending = sortParam.startsWith("-");
          const field = isDescending ? sortParam.slice(1) : sortParam;

          if (["title", "completed", "createdAt", "updatedAt"].includes(field)) {
            orderBy = { [field]: isDescending ? "DESC" : "ASC" };
          }
        }

        const todoRepository = this.em.getRepository(TodoEntity);
        const [todos, total] = await todoRepository.findAndCount(where, { orderBy });

        return reply.send({
          data: jsonApiSerializeManyTodos(todos),
          meta: {
            total,
          },
        });
      },
    );
  }
}
