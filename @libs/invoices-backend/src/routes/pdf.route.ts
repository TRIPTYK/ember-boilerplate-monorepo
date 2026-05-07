import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { object, string } from "zod";
import type { InvoiceEntityType } from "#src/entities/invoice.entity.js";
import { InvoiceLineItemEntity } from "#src/entities/invoice-line-item.entity.js";
import type { InvoiceLineItemEntityType } from "#src/entities/invoice-line-item.entity.js";
import { jsonApiErrorDocumentSchema, makeJsonApiError, type Route } from "@libs/backend-shared";
import puppeteer from "puppeteer";

function buildInvoiceHtml(
  invoice: InvoiceEntityType,
  lineItems: InvoiceLineItemEntityType[],
): string {
  const rows = lineItems
    .map(
      (item) =>
        `<tr>
          <td>${item.label}</td>
          <td>${item.type}</td>
          <td style="text-align:right">${item.amount.toFixed(2)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: sans-serif; padding: 40px; color: #333; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .meta { color: #666; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { text-align: left; border-bottom: 2px solid #333; padding: 8px 4px; }
    td { padding: 8px 4px; border-bottom: 1px solid #eee; }
    .totals { text-align: right; }
    .totals td { padding: 4px 8px; }
    .total-row { font-weight: bold; font-size: 16px; }
  </style>
</head>
<body>
  <h1>Invoice — ${invoice.month}</h1>
  <div class="meta">
    <div>User ID: ${invoice.userId}</div>
    ${invoice.paymentMethod ? `<div>Payment method: ${invoice.paymentMethod}</div>` : ""}
  </div>
  <table>
    <thead>
      <tr><th>Description</th><th>Type</th><th style="text-align:right">Amount</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <table class="totals">
    <tr><td>Subtotal</td><td>${invoice.subtotal.toFixed(2)}</td></tr>
    <tr><td>Discount</td><td>-${invoice.discount.toFixed(2)}</td></tr>
    <tr class="total-row"><td>Total</td><td>${invoice.total.toFixed(2)}</td></tr>
  </table>
</body>
</html>`;
}

export class PdfRoute implements Route {
  public constructor(private invoiceRepository: EntityRepository<InvoiceEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.get(
      "/:id/pdf",
      {
        schema: {
          params: object({
            id: string(),
          }),
          response: {
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

        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        try {
          const page = await browser.newPage();
          await page.setContent(buildInvoiceHtml(invoice, lineItems), {
            waitUntil: "networkidle0",
          });
          const pdf = await page.pdf({ format: "A4", printBackground: true });

          return reply
            .header("Content-Type", "application/pdf")
            .header("Content-Disposition", `attachment; filename="invoice-${invoice.month}.pdf"`)
            .send(Buffer.from(pdf));
        } finally {
          await browser.close();
        }
      },
    );
  }
}
