import type { FastifyReply, FastifyRequest } from "fastify";
import {
  hasZodFastifySchemaValidationErrors
} from "fastify-type-provider-zod";

export function handleJsonApiErrors(error: unknown, _request: FastifyRequest, reply: FastifyReply) {
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

    throw error;
}