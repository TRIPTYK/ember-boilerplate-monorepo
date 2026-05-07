# Create Invoice for User

## Purpose
Allow any authenticated user to generate and view a monthly invoice based on their billing data (charges, services, discounts), and export it as a PDF.

## User stories
- As an authenticated user, I want to select a month and generate my invoice, so that I can review my billing statement for that period.
- As an authenticated user, I want to export my invoice as a PDF, so that I can download or share my billing statement for accounting purposes.

## Acceptance criteria
- A user can select a month/year and generate an invoice showing their details, line items, totals, and payment method.
- The invoice lists all charges, services, and discounts for the selected month as individual line items.
- A total (subtotal, discounts applied, final total) is computed and displayed.
- The invoice displays correctly in the browser.
- The user can trigger a server-side PDF export and download the resulting file.

## Business rules & invariants
- A user can only view and export their own invoice — never another user's.
- Invoice scope is exactly one calendar month (from the 1st to the last day of the selected month).
- Totals are computed server-side to prevent client-side tampering.

## Edge cases & error states
- No special handling required for months with no billing data (no explicit empty state).

## Out of scope
- Admin ability to generate invoices for other users.
- Predefined billing cycles beyond monthly (quarterly, yearly, etc.).
- Sending invoices by email.
- Invoice editing or voiding.

## Technical approach
- New data models: `Invoice`, `InvoiceLineItem` (covers charges, services, discounts), linked to the user model.
- New API endpoints: `GET /invoices?month=YYYY-MM` (list/generate for current user), `GET /invoices/:id/pdf` (server-side PDF download).
- Server-side PDF generation using a Node.js library (e.g. Puppeteer or pdf-lib) rendering the invoice HTML template.
- Frontend: new Ember route/component for the monthly picker and invoice display.
- Auth guard: endpoints scoped to the authenticated user — no role/scope changes needed.
