import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { object, string } from "zod";
import {
  jsonApiSerializeSingleInvoiceDocument,
  SerializedInvoiceSchema,
} from "#src/serializers/invoice.serializer.js";
import type { InvoiceEntityType } from "#src/entities/invoice.entity.js";
import { InvoiceLineItemEntity } from "#src/entities/invoice-line-item.entity.js";
import { jsonApiErrorDocumentSchema, makeJsonApiError, type Route } from "@libs/backend-shared";

export class GetRoute implements Route {
  public constructor(private invoiceRepository: EntityRepository<InvoiceEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.get(
      "/:id",
      {
        schema: {
          params: object({
            id: string(),
          }),
          response: {
            200: object({
              data: SerializedInvoiceSchema,
            }),
            404: jsonApiErrorDocumentSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };
        const currentUser = request.user!;

        const invoice = await this.invoiceRepository.findOne({ id, userId: currentUser.id });

        if (!invoice) {
          return reply.code(404).send(
            makeJsonApiError(404, "Not Found", {
              code: "INVOICE_NOT_FOUND",
              detail: `Invoice with id ${id} not found`,
            }),
          );
        }

        const lineItemRepository =
          this.invoiceRepository.getEntityManager().getRepository(InvoiceLineItemEntity);
        const lineItems = await lineItemRepository.find({ invoiceId: id });

        return reply.send(jsonApiSerializeSingleInvoiceDocument(invoice, lineItems));
      },
    );
  }
}
