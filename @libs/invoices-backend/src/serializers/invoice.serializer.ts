import type { InvoiceEntityType } from "#src/entities/invoice.entity.js";
import type { InvoiceLineItemEntityType } from "#src/entities/invoice-line-item.entity.js";
import { array, enum as zenum, number, object, string } from "zod";
import { z } from "zod";
import { makeJsonApiDocumentSchema } from "@libs/backend-shared";

export const SerializedLineItemSchema = object({
  id: string(),
  type: zenum(["charge", "service", "discount"]),
  label: string(),
  amount: number(),
});

export const SerializedInvoiceSchema = makeJsonApiDocumentSchema(
  "invoices",
  object({
    userId: string(),
    month: string(),
    subtotal: number(),
    discount: number(),
    total: number(),
    paymentMethod: string().nullable(),
    lineItems: array(SerializedLineItemSchema),
    createdAt: string(),
    updatedAt: string(),
  }),
);

export function jsonApiSerializeInvoice(
  invoice: InvoiceEntityType,
  lineItems: InvoiceLineItemEntityType[],
): z.infer<typeof SerializedInvoiceSchema> {
  return {
    id: invoice.id,
    type: "invoices" as const,
    attributes: {
      userId: invoice.userId,
      month: invoice.month,
      subtotal: invoice.subtotal,
      discount: invoice.discount,
      total: invoice.total,
      paymentMethod: invoice.paymentMethod ?? null,
      lineItems: lineItems.map((item) => ({
        id: item.id,
        type: item.type,
        label: item.label,
        amount: item.amount,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    },
  };
}

export function jsonApiSerializeManyInvoices(
  invoices: InvoiceEntityType[],
  lineItemsByInvoiceId: Map<string, InvoiceLineItemEntityType[]>,
) {
  return invoices.map((invoice) =>
    jsonApiSerializeInvoice(invoice, lineItemsByInvoiceId.get(invoice.id) ?? []),
  );
}

export function jsonApiSerializeSingleInvoiceDocument(
  invoice: InvoiceEntityType,
  lineItems: InvoiceLineItemEntityType[],
) {
  return {
    data: jsonApiSerializeInvoice(invoice, lineItems),
  };
}
