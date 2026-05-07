import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const InvoiceLineItemEntity = defineEntity({
  name: "InvoiceLineItem",
  properties: {
    id: p.string().primary(),
    invoiceId: p.string(),
    type: p.enum({ items: ["charge", "service", "discount"] as const }),
    label: p.string(),
    amount: p.decimal("number"),
  },
});

export type InvoiceLineItemEntityType = InferEntity<typeof InvoiceLineItemEntity>;
