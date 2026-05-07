import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import type { LibraryContext } from "./context.js";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { ListRoute } from "#src/routes/list.route.js";
import { GetRoute } from "#src/routes/get.route.js";
import { PdfRoute } from "#src/routes/pdf.route.js";
import { InvoiceEntity } from "./entities/invoice.entity.js";
import { handleJsonApiErrors, type ModuleInterface, type Route } from "@libs/backend-shared";
import { createJwtAuthMiddleware } from "@libs/users-backend";

export type FastifyInstanceTypeForModule = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export class Module implements ModuleInterface<FastifyInstanceTypeForModule> {
  private constructor(private context: LibraryContext) {}

  public static init(context: LibraryContext): Module {
    return new Module(context);
  }

  public async setupRoutes(fastify: FastifyInstanceTypeForModule): Promise<void> {
    const repository = this.context.em.getRepository(InvoiceEntity);

    await fastify.register(
      async (f) => {
        const invoiceRoutes: Route<FastifyInstanceTypeForModule>[] = [
          new ListRoute(this.context.em),
          new GetRoute(repository),
          new PdfRoute(repository),
        ];

        const jwtAuthMiddleware = createJwtAuthMiddleware(
          this.context.em,
          this.context.configuration.jwtSecret,
        );

        f.setErrorHandler((error, request, reply) => {
          handleJsonApiErrors(error, request, reply);
        });

        f.addHook("preValidation", jwtAuthMiddleware);

        for (const route of invoiceRoutes) {
          route.routeDefinition(f);
        }
      },
      { prefix: "/invoices" },
    );
  }
}
