# Create Invoice for User — Technical

## Architecture
Follows the monorepo's library-per-feature pattern. Two new libraries added:

- **`@libs/invoices-backend`** — independent Fastify module (MikroORM entities, Zod-validated routes, JSON:API serialisation). Registered in `@apps/backend` alongside todos and users modules.
- **`@libs/invoices-front`** — Ember v2 addon (WarpDrive schema, route, Glimmer component, MSW mocks). Registered in `@apps/front` alongside todos-front and users-front.

Request flow: Ember route (`InvoicesIndexRoute`) → WarpDrive `store.request()` → AuthHandler injects Bearer token → Fastify `GET /api/v1/invoices` → JWT auth middleware → `ListRoute` → MikroORM → JSON:API response.

PDF download: user clicks button in `InvoiceList` component → `InvoiceService.downloadPdf()` raw `fetch` with Bearer token → Fastify `GET /api/v1/invoices/:id/pdf` → Puppeteer renders HTML → binary PDF streamed back → Blob URL trigger download.

## Data model

### `Invoice`
| column | type | notes |
|--------|------|-------|
| id | string (PK) | UUID |
| userId | string | FK to User (logical, no DB constraint) |
| month | string | YYYY-MM format |
| subtotal | decimal | number mode |
| discount | decimal | number mode, default 0 |
| total | decimal | number mode |
| paymentMethod | string (nullable) | |
| createdAt | string | ISO 8601 |
| updatedAt | string | ISO 8601 |

### `InvoiceLineItem`
| column | type | notes |
|--------|------|-------|
| id | string (PK) | UUID |
| invoiceId | string | references Invoice.id |
| type | enum | 'charge' \| 'service' \| 'discount' |
| label | string | |
| amount | decimal | number mode |

No migrations — schema managed via `orm.schema.refresh()` in dev/test (consistent with existing pattern).

## API contract

### `GET /api/v1/invoices`
- Auth: Bearer JWT required
- Query: `filter[month]=YYYY-MM` (optional)
- Scope: current user only (`userId = request.user.id`)
- Response 200: `{ data: SerializedInvoice[], meta: { total: number } }`
- Response 401: JSON:API error

### `GET /api/v1/invoices/:id`
- Auth: Bearer JWT required
- Response 200: `{ data: SerializedInvoice }` (includes `lineItems` in attributes)
- Response 404: JSON:API error (also returned for another user's invoice)

### `GET /api/v1/invoices/:id/pdf`
- Auth: Bearer JWT required
- Response 200: `application/pdf` binary, `Content-Disposition: attachment; filename="invoice-YYYY-MM.pdf"`
- Response 404: JSON:API error

SerializedInvoice attributes: `userId, month, subtotal, discount, total, paymentMethod, lineItems[], createdAt, updatedAt`.

## Key files

### Backend
- `@libs/invoices-backend/src/entities/invoice.entity.ts` — MikroORM entity, `p.decimal("number")` for monetary fields
- `@libs/invoices-backend/src/entities/invoice-line-item.entity.ts` — line item entity with enum type
- `@libs/invoices-backend/src/serializers/invoice.serializer.ts` — JSON:API serialisation, line items embedded in attributes
- `@libs/invoices-backend/src/routes/list.route.ts` — filters by userId + optional month, batch-loads line items
- `@libs/invoices-backend/src/routes/get.route.ts` — single invoice with line items
- `@libs/invoices-backend/src/routes/pdf.route.ts` — Puppeteer HTML→PDF, browser launched per-request
- `@libs/invoices-backend/src/init.ts` — Module class, JWT auth applied to all routes under `/invoices`
- `@apps/backend/src/app/database.connection.ts` — registers `InvoiceEntity`, `InvoiceLineItemEntity`
- `@apps/backend/src/app/app.router.ts` — wires `InvoiceModule`
- `@apps/backend/src/seeders/development.seeder.ts` — seeds demo invoice with three line items

### Frontend
- `@libs/invoices-front/src/schemas/invoice.ts` — WarpDrive schema (type: 'invoices')
- `@libs/invoices-front/src/services/invoice.ts` — `downloadPdf()` uses raw fetch + ember-simple-auth session token
- `@libs/invoices-front/src/routes/dashboard/invoices/index.gts` — query param `month`, defaults to current month
- `@libs/invoices-front/src/components/invoice-list.gts` — month picker, line items table, totals, PDF download button
- `@libs/invoices-front/src/http-mocks/invoices.ts` — MSW handlers for list, get, pdf
- `@apps/front/app/services/store.ts` — adds `InvoiceSchema`
- `@apps/front/app/router.ts` — adds `invoicesLibRouter`
- `@apps/front/app/routes/application.ts` — initialises lib + registers MSW handlers

## Notable choices
- **Puppeteer per-request**: browser launched and closed on each PDF request. Adequate for a boilerplate; production use should keep a browser instance warm.
- **Line items embedded in attributes**: deviates from full JSON:API relationships. Simplifies frontend consumption for a read-only feature; relationship links can be added later if needed.
- **`decimal("number")` mode**: MikroORM infers TypeScript type as `number` directly, avoiding `Number()` casting throughout the codebase.
- **Raw `fetch` for PDF**: WarpDrive's `store.request()` does not handle binary responses; raw fetch with manual token injection from ember-simple-auth session is the correct escape hatch here.

## Deviations from the original plan
- `InvoiceLineItem.amount` uses `p.decimal("number")` not `p.decimal({ precision, scale })` — the latter is not a valid MikroORM v7 API.
- Frontend service uses ember-simple-auth session data path (`data.authenticated.data.accessToken`) consistent with `AuthHandler` in users-front.

## Operational notes
- Puppeteer downloads headless Chrome on first `pnpm install` (~130MB). Added `puppeteer: true` to `pnpm-workspace.yaml allowBuilds`.
- No env vars required beyond existing `DATABASE_URI` and `JWT_SECRET`.
- `pnpm -F @apps/backend schema:fresh` (or `schema:update`) must be run to create the new tables in an existing dev database.
