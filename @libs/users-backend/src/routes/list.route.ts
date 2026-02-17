import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { UserEntity } from "#src/entities/user.entity.js";
import type { EntityManager } from "@mikro-orm/core";
import { array, number, object } from "zod";
import {
  jsonApiSerializeManyUsers,
  SerializedUserSchema,
} from "#src/serializers/user.serializer.js";
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
              data: array(SerializedUserSchema),
              meta: object({
                total: number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const queryParams = request.query as Record<string, any>;
        const searchQuery = queryParams["filter[search]"] as string | undefined;
        const sortParam = queryParams["sort"] as string | undefined;

        // Build where clause
        const where: any = {};

        // Apply search filter
        if (searchQuery) {
          where.$or = [
            { firstName: { $like: `%${searchQuery}%` } },
            { lastName: { $like: `%${searchQuery}%` } },
            { email: { $like: `%${searchQuery}%` } },
          ];
        }

        // Build orderBy clause
        let orderBy: any = {};
        if (sortParam) {
          const isDescending = sortParam.startsWith("-");
          const field = isDescending ? sortParam.slice(1) : sortParam;

          if (["firstName", "lastName", "email"].includes(field)) {
            orderBy = { [field]: isDescending ? "DESC" : "ASC" };
          }
        }

        const userRepository = this.em.getRepository(UserEntity);
        const [users, total] = await userRepository.findAndCount(where, { orderBy });

        return reply.send({
          data: jsonApiSerializeManyUsers(users),
          meta: {
            total,
          },
        });
      },
    );
  }
}
