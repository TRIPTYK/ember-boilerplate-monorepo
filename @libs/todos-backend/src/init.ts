import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import type { LibraryContext } from "./context.js";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { CreateRoute } from "#src/routes/create.route.js";
import { ListRoute } from "#src/routes/list.route.js";
import { GetRoute } from "#src/routes/get.route.js";
import { UpdateRoute } from "#src/routes/update.route.js";
import { DeleteRoute } from "#src/routes/delete.route.js";
import { TodoEntity } from "./entities/todo.entity.js";
import { handleJsonApiErrors, type ModuleInterface, type Route } from "@libs/backend-shared";
import { createJwtAuthMiddleware } from "@libs/auth-backend";

export type FastifyInstanceTypeForModule = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export class Module implements ModuleInterface<FastifyInstanceTypeForModule> {
  private constructor(private context: LibraryContext) {}

  public static init(context: LibraryContext): Module {
    return new Module(context);
  }

  public async setupRoutes(fastify: FastifyInstanceTypeForModule): Promise<void> {
    const repository = this.context.em.getRepository(TodoEntity);

    await fastify.register(
      async (f) => {
        const todoRoutes: Route<FastifyInstanceTypeForModule>[] = [
          new CreateRoute(repository),
          new ListRoute(this.context.em),
          new GetRoute(repository),
          new UpdateRoute(repository),
          new DeleteRoute(repository),
        ];

        const jwtAuthMiddleware = createJwtAuthMiddleware(
          this.context.em,
          this.context.configuration.jwtSecret,
          this.context.userRepository,
        );

        f.setErrorHandler((error, request, reply) => {
          handleJsonApiErrors(error, request, reply);
        });

        f.addHook("preValidation", jwtAuthMiddleware);

        for (const route of todoRoutes) {
          route.routeDefinition(f);
        }
      },
      { prefix: "/todos" },
    );
  }
}
