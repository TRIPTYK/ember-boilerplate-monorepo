import type { FastifyInstanceType } from "#src/app/app.js";
import { logger } from "#src/app/logger.js";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

/**
 * Creates a fastify instance with schema compilers set
 *
 * Used for route testing
 */
export function fastifyTestInstance() {
  const fastifyInstance = fastify({
    loggerInstance: logger({
      PRODUCTION_ENV: false,
    }),
  });
  fastifyInstance.setValidatorCompiler(validatorCompiler);
  fastifyInstance.setSerializerCompiler(serializerCompiler);

  return fastifyInstance as unknown as FastifyInstanceType;
}
