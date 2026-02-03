import type { ModuleInterface } from "@libs/users-backend";
import type { FastifyInstanceType } from "./app.js";
import type { ApplicationContext } from "./application.context.js";
import { statusRoute } from "./status.route.js";

export async function appRouter(
  fastify: FastifyInstanceType,
  context: ApplicationContext,
  modules: ModuleInterface[],
) {
  await fastify.register(
    async function (fastify) {
      await fastify.register(statusRoute);
      await fastify.register(async (fastify) => {
        // Resource routes
        fastify.addHook("onRoute", (routeOptions) => {
          if (routeOptions.schema) {
            routeOptions.schema.tags ??= ["resource"];
          }
        });
      });
      for await (const mod of modules) {
        await mod.setupRoutes(fastify);
      }
    },
    {
      prefix: "api/v1",
    },
  );
}
