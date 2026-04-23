import { HttpResponse } from 'msw';
import { createOpenApiHttp } from 'openapi-msw';
import type { paths } from '@apps/backend';
import type { CompanyType } from '#src/services/company.ts';

let mockCompany: CompanyType = {
  hasDPO: true,
  hasExternalDPO: false,
  responsible: {
    fullName: 'Servais SA',
    entityNumber: 'BE0123456789',
    address: {
      streetAndNumber: 'Rue de la Loi 42',
      postalCode: '1000',
      city: 'Bruxelles',
      country: 'Belgique',
      phone: '+32 2 123 45 67',
      email: 'contact@servais.be',
    },
  },
  DPO: {
    fullName: 'Marie Lambert',
    address: {
      streetAndNumber: 'Rue de la Loi 42',
      postalCode: '1000',
      city: 'Bruxelles',
      country: 'Belgique',
      phone: '+32 2 123 45 68',
      email: 'dpo@servais.be',
    },
  },
};

const http = createOpenApiHttp<paths>();

export default [
  // ── GET /api/v1/company ───────────────────────────────────────────────────
  http.untyped.get('/api/v1/company', () => {
    return HttpResponse.json({
      data: { type: 'company', id: '1', attributes: mockCompany },
    });
  }),

  // ── PATCH /api/v1/company ─────────────────────────────────────────────────
  http.untyped.patch('/api/v1/company', async ({ request }) => {
    const body = (await request.json()) as {
      data: { attributes: CompanyType };
    };
    mockCompany = body.data.attributes;
    return HttpResponse.json({
      data: { type: 'company', id: '1', attributes: mockCompany },
    });
  }),
];
