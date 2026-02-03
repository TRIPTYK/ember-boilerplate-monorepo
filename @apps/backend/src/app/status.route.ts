import { object, string } from "zod";
import type { FastifyInstanceType } from "./app.js";

export function statusRoute(fastify: FastifyInstanceType) {
  return fastify.get(
    "/status",
    {
      schema: {
        response: {
          200: object({
            status: string().includes("ok"),
          }),
        },
      },
    },
    async (_, reply) => {
      reply.send({
        status: "ok",
      });
    },
  );
}
