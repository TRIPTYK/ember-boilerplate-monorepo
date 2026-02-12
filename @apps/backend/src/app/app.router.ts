import { createJwtAuthMiddleware, type AuthModule, type UserModule } from "@libs/users-backend";
import type { FastifyInstanceType } from "./app.js";
import { statusRoute } from "./status.route.js";
import { Module as TodoModule } from "@libs/todos-backend";
import type { ApplicationContext } from "./application.context.ts";
import { handleJsonApiErrors } from "@libs/backend-shared";

interface AppRouterOptions {
  authModule: AuthModule;
  userModule: UserModule;
  todosModule: TodoModule;
}

export async function appRouter(
  fastify: FastifyInstanceType,
  context: ApplicationContext,
  { authModule, userModule, todosModule }: AppRouterOptions,
) {
  await fastify.register(
    async function (fastify) {
      await fastify.register(statusRoute);
      await authModule.setupRoutes(fastify);
      await fastify.register(async (fastify) => {
        // Resource routes
        fastify.addHook("onRoute", (routeOptions) => {
          if (routeOptions.schema) {
            routeOptions.schema.tags ??= ["resource"];
          }
        });
      });

      const jwtAuthMiddleware = createJwtAuthMiddleware(
        context.orm.em,
        context.configuration.JWT_REFRESH_SECRET,
      );

      fastify.addHook("preValidation", jwtAuthMiddleware);
      
      fastify.setErrorHandler((error, request, reply) => {
        handleJsonApiErrors(error, request, reply);
      });
      await userModule.setupRoutes(fastify);
      await todosModule.setupRoutes(fastify);
    },
    {
      prefix: "api/v1",
    },
  );
}
