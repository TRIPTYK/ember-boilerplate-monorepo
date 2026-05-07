import { http, HttpResponse } from 'msw';

const mockInvoices = [
  {
    id: 'inv-demo-1',
    type: 'invoices' as const,
    attributes: {
      userId: 'demo-user',
      month: new Date().toISOString().slice(0, 7),
      subtotal: 250,
      discount: 25,
      total: 225,
      paymentMethod: 'card',
      lineItems: [
        { id: 'li-1', type: 'service' as const, label: 'Monthly subscription', amount: 200 },
        { id: 'li-2', type: 'charge' as const, label: 'Extra usage', amount: 50 },
        { id: 'li-3', type: 'discount' as const, label: '10% loyalty discount', amount: 25 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

export default [
  http.get('/api/v1/invoices', ({ request }) => {
    const url = new URL(request.url);
    const monthFilter = url.searchParams.get('filter[month]');

    const results = monthFilter
      ? mockInvoices.filter((inv) => inv.attributes.month === monthFilter)
      : mockInvoices;

    return HttpResponse.json({
      data: results,
      meta: { total: results.length },
    });
  }),

  http.get('/api/v1/invoices/:id', ({ params }) => {
    const invoice = mockInvoices.find((inv) => inv.id === params['id']);
    if (!invoice) {
      return HttpResponse.json(
        { errors: [{ status: '404', code: 'INVOICE_NOT_FOUND' }] },
        { status: 404 },
      );
    }
    return HttpResponse.json({ data: invoice });
  }),

  http.get('/api/v1/invoices/:id/pdf', () => {
    const pdfBytes = new Uint8Array([37, 80, 68, 70]);
    return new HttpResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="invoice.pdf"',
      },
    });
  }),
];
