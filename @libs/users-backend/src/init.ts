import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import type { UserLibraryContext } from "./context.js";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { CreateRoute } from "#src/routes/create.route.js";
import { ProfileRoute } from "#src/routes/profile.route.js";
import { ListRoute } from "#src/routes/list.route.js";
import { GetRoute } from "#src/routes/get.route.js";
import { UpdateRoute } from "#src/routes/update.route.js";
import { DeleteRoute } from "#src/routes/delete.route.js";
import { UserEntity } from "./entities/user.entity.js";
import { type ModuleInterface, type Route } from "@libs/backend-shared";
import { handleJsonApiErrors } from "@libs/backend-shared";
import { createJwtAuthMiddleware } from "@libs/auth-backend";

export type FastifyInstanceTypeForModule = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export class UserModule implements ModuleInterface<FastifyInstanceTypeForModule> {
  private constructor(private context: UserLibraryContext) {}

  public static init(context: UserLibraryContext): UserModule {
    return new UserModule(context);
  }

  public async setupRoutes(fastify: FastifyInstanceTypeForModule): Promise<void> {
    const repository = this.context.em.getRepository(UserEntity);

    await fastify.register(
      async (f) => {
        const userRoutes: Route<FastifyInstanceTypeForModule>[] = [
          new CreateRoute(repository),
          new ProfileRoute(),
          new ListRoute(this.context.em),
          new GetRoute(repository),
          new UpdateRoute(repository),
          new DeleteRoute(repository),
        ];

        f.setErrorHandler((error, request, reply) => {
          handleJsonApiErrors(error, request, reply);
        });

        const jwtAuthMiddleware = createJwtAuthMiddleware(
          this.context.em,
          this.context.configuration.jwtSecret,
          repository,
        );

        f.addHook("preValidation", jwtAuthMiddleware);

        for (const route of userRoutes) {
          route.routeDefinition(f);
        }
      },
      { prefix: "/users" },
    );
  }
}
