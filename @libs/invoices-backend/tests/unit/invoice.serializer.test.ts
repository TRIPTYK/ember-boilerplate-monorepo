import { describe, it, expect } from "vitest";
import {
  jsonApiSerializeInvoice,
  jsonApiSerializeManyInvoices,
  jsonApiSerializeSingleInvoiceDocument,
} from "#src/serializers/invoice.serializer.js";
import type { InvoiceEntityType } from "#src/entities/invoice.entity.js";
import type { InvoiceLineItemEntityType } from "#src/entities/invoice-line-item.entity.js";

describe("invoice.serializer", () => {
  const mockInvoice: InvoiceEntityType = {
    id: "inv-1",
    userId: "user-1",
    month: "2026-01",
    subtotal: 100,
    discount: 10,
    total: 90,
    paymentMethod: "card",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  const mockLineItems: InvoiceLineItemEntityType[] = [
    { id: "li-1", invoiceId: "inv-1", type: "charge", label: "Service fee", amount: 100 },
    { id: "li-2", invoiceId: "inv-1", type: "discount", label: "Promo code", amount: 10 },
  ];

  describe("jsonApiSerializeInvoice", () => {
    it("serializes to JSON:API format", () => {
      const result = jsonApiSerializeInvoice(mockInvoice, mockLineItems);

      expect(result).toEqual({
        id: "inv-1",
        type: "invoices",
        attributes: {
          userId: "user-1",
          month: "2026-01",
          subtotal: 100,
          discount: 10,
          total: 90,
          paymentMethod: "card",
          lineItems: [
            { id: "li-1", type: "charge", label: "Service fee", amount: 100 },
            { id: "li-2", type: "discount", label: "Promo code", amount: 10 },
          ],
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      });
    });

    it("handles null paymentMethod", () => {
      const result = jsonApiSerializeInvoice({ ...mockInvoice, paymentMethod: null }, []);
      expect(result.attributes.paymentMethod).toBeNull();
    });

    it("handles empty line items", () => {
      const result = jsonApiSerializeInvoice(mockInvoice, []);
      expect(result.attributes.lineItems).toEqual([]);
    });
  });

  describe("jsonApiSerializeManyInvoices", () => {
    it("serializes multiple invoices", () => {
      const inv2: InvoiceEntityType = { ...mockInvoice, id: "inv-2", month: "2026-02" };
      const map = new Map([
        ["inv-1", mockLineItems],
        ["inv-2", []],
      ]);
      const result = jsonApiSerializeManyInvoices([mockInvoice, inv2], map);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("inv-1");
      expect(result[1].id).toBe("inv-2");
    });

    it("returns empty array for empty input", () => {
      const result = jsonApiSerializeManyInvoices([], new Map());
      expect(result).toEqual([]);
    });
  });

  describe("jsonApiSerializeSingleInvoiceDocument", () => {
    it("wraps in data property", () => {
      const result = jsonApiSerializeSingleInvoiceDocument(mockInvoice, mockLineItems);
      expect(result).toHaveProperty("data");
      expect(result.data.id).toBe("inv-1");
    });
  });
});
