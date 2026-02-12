import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import type { AuthLibraryContext, UserLibraryContext } from "./context.js";
import { hasZodFastifySchemaValidationErrors, type ZodTypeProvider } from "fastify-type-provider-zod";
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
import { type ModuleInterface, type Route } from "@libs/backend-shared";
import { handleJsonApiErrors } from "@libs/backend-shared";
import { createJwtAuthMiddleware } from "./index.ts";

export type FastifyInstanceTypeForModule = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export class AuthModule implements ModuleInterface<FastifyInstanceTypeForModule> {
  private constructor(private context: AuthLibraryContext) {}

  public static init(context: AuthLibraryContext): AuthModule {
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
        f.setErrorHandler((error, request, reply) => {
          handleJsonApiErrors(error, request, reply);
        });

        for (const route of authRoutes) {
          route.routeDefinition(f);
        }
      },
      { prefix: "/auth" },
    );
  }
}

export class UserModule implements ModuleInterface<FastifyInstanceTypeForModule> {
  private constructor(private context: UserLibraryContext) {}

  public static init(context: UserLibraryContext): UserModule {
    return new UserModule(context);
  }

  public async setupRoutes(fastify: FastifyInstanceTypeForModule): Promise<void> {
    const repository = this.context.em.getRepository(UserEntity);

    await fastify.register(
      async (f) => {
        // Apply JWT authentication middleware to all routes
        f.addHook("preValidation", async (request, reply) => {
          await jwtAuthMiddleware(request, reply);
        });

        // Handle validation errors globally for all user routes
        f.setErrorHandler((error, request, reply) => {
          console.log(error);

          if (hasZodFastifySchemaValidationErrors(error)) {
            return reply.status(400).send({
              errors: error.validation.map((issue) => ({
                status: "400",
                title: "Validation Error",
                detail: issue.message,
                source: {
                  pointer: `/${issue.instancePath.replace(/^\./, "").replace(/\./g, "/")}`,
                },
              })),
            });
          }

          // Re-throw other errors to be handled by the parent error handler
          throw error;
        });

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
