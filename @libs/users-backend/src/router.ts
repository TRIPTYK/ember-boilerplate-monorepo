import type { FastifyInstanceTypeForModule, Route } from "./init.js";

export function moduleRouter(fastifyInstance: FastifyInstanceTypeForModule, routes: Route[]) {
  for (const route of routes) {
    route.routeDefinition(fastifyInstance);
  }
}
