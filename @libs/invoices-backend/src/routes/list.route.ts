import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { InvoiceEntity } from "#src/entities/invoice.entity.js";
import { InvoiceLineItemEntity } from "#src/entities/invoice-line-item.entity.js";
import type { EntityManager } from "@mikro-orm/core";
import { array, number, object } from "zod";
import {
  jsonApiSerializeManyInvoices,
  SerializedInvoiceSchema,
} from "#src/serializers/invoice.serializer.js";
import type { Route } from "@libs/backend-shared";

export class ListRoute implements Route {
  public constructor(private em: EntityManager) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.get(
      "/",
      {
        schema: {
          response: {
            200: object({
              data: array(SerializedInvoiceSchema),
              meta: object({
                total: number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const currentUser = request.user!;
        const queryParams = request.query as Record<string, string | undefined>;
        const monthFilter = queryParams["filter[month]"];

        const where: Record<string, unknown> = { userId: currentUser.id };
        if (monthFilter) {
          where["month"] = monthFilter;
        }

        const invoiceRepository = this.em.getRepository(InvoiceEntity);
        const [invoices, total] = await invoiceRepository.findAndCount(where);

        const lineItemRepository = this.em.getRepository(InvoiceLineItemEntity);
        const invoiceIds = invoices.map((inv) => inv.id);
        const lineItems =
          invoiceIds.length > 0
            ? await lineItemRepository.find({ invoiceId: { $in: invoiceIds } })
            : [];

        const lineItemsByInvoiceId = new Map(invoices.map((inv) => [inv.id, [] as typeof lineItems]));
        for (const item of lineItems) {
          lineItemsByInvoiceId.get(item.invoiceId)?.push(item);
        }

        return reply.send({
          data: jsonApiSerializeManyInvoices(invoices, lineItemsByInvoiceId),
          meta: { total },
        });
      },
    );
  }
}
