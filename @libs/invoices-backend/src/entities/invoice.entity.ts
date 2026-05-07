import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const InvoiceEntity = defineEntity({
  name: "Invoice",
  properties: {
    id: p.string().primary(),
    userId: p.string(),
    month: p.string(),
    subtotal: p.decimal("number"),
    discount: p.decimal("number").default(0),
    total: p.decimal("number"),
    paymentMethod: p.string().nullable(),
    createdAt: p.string().onCreate(() => new Date().toISOString()),
    updatedAt: p.string().onCreate(() => new Date().toISOString()),
  },
});

export type InvoiceEntityType = InferEntity<typeof InvoiceEntity>;
