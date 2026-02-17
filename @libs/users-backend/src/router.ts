import type { Route } from "@libs/backend-shared";
import type { FastifyInstanceTypeForModule } from "./init.js";

export function moduleRouter(fastifyInstance: FastifyInstanceTypeForModule, routes: Route[]) {
  for (const route of routes) {
    route.routeDefinition(fastifyInstance);
  }
}
