import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import type { LibraryContext } from "./context.js";
import {
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { LoginRoute } from "#src/routes/login.route.js";
import { RefreshRoute } from "#src/routes/refresh.route.js";
import { LogoutRoute } from "#src/routes/logout.route.js";
import { CreateRoute } from "#src/routes/create.route.js";
import { ProfileRoute } from "#src/routes/profile.route.js";
import { ListRoute } from "#src/routes/list.route.js";
import { GetRoute } from "#src/routes/get.route.js";
import { UpdateRoute } from "#src/routes/update.route.js";
import { DeleteRoute } from "#src/routes/delete.route.js";
import { UserEntity } from "./entities/user.entity.js";
import { handleJsonApiErrors, type ModuleInterface, type Route } from "@libs/backend-shared";

export type FastifyInstanceTypeForModule = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export class AuthModule implements ModuleInterface<FastifyInstanceTypeForModule> {
  private constructor(private context: LibraryContext) {}

  public static init(context: LibraryContext): AuthModule {
    return new AuthModule(context);
  }

  public async setupRoutes(fastify: FastifyInstanceTypeForModule): Promise<void> {
    const authRoutes: Route<FastifyInstanceTypeForModule>[] = [
      new LoginRoute(
        this.context.em.getRepository(UserEntity),
        this.context.em,
        this.context.configuration.jwtSecret,
        this.context.configuration.jwtRefreshSecret,
      ),
      new RefreshRoute(
        this.context.em,
        this.context.configuration.jwtSecret,
        this.context.configuration.jwtRefreshSecret,
      ),
      new LogoutRoute(this.context.em, this.context.configuration.jwtRefreshSecret),
    ];

    await fastify.register(
      async (f) => {
        for (const route of authRoutes) {
          route.routeDefinition(f);
        }
      },
      { prefix: "/auth" },
    );
  }
}

export class UserModule implements ModuleInterface<FastifyInstanceTypeForModule> {
  private constructor(private context: LibraryContext) {}

  public static init(context: LibraryContext): UserModule {
    return new UserModule(context);
  }

  public async setupRoutes(fastify: FastifyInstanceTypeForModule): Promise<void> {
    const repository = this.context.em.getRepository(UserEntity);

    await fastify.register(
      async (f) => {
        f.setErrorHandler((error, request, reply) => {
          handleJsonApiErrors(error, request, reply);
        });

        const userRoutes: Route<FastifyInstanceTypeForModule>[] = [
          new CreateRoute(repository),
          new ProfileRoute(),
          new ListRoute(this.context.em),
          new GetRoute(repository),
          new UpdateRoute(repository),
          new DeleteRoute(repository),
        ];

        for (const route of userRoutes) {
          route.routeDefinition(f);
        }
      },
      { prefix: "/users" },
    );
  }
}
