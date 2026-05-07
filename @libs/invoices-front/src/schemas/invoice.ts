import {
  withDefaults,
  type WithLegacy,
} from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const InvoiceSchema = withDefaults({
  type: 'invoices',
  fields: [
    { name: 'userId', kind: 'attribute' },
    { name: 'month', kind: 'attribute' },
    { name: 'subtotal', kind: 'attribute' },
    { name: 'discount', kind: 'attribute' },
    { name: 'total', kind: 'attribute' },
    { name: 'paymentMethod', kind: 'attribute' },
    { name: 'lineItems', kind: 'attribute' },
    { name: 'createdAt', kind: 'attribute' },
    { name: 'updatedAt', kind: 'attribute' },
  ],
});

export default InvoiceSchema;

export type LineItem = {
  id: string;
  type: 'charge' | 'service' | 'discount';
  label: string;
  amount: number;
};

export type Invoice = WithLegacy<{
  userId: string;
  month: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string | null;
  lineItems: LineItem[];
  createdAt: string;
  updatedAt: string;
  [Type]: 'invoices';
}>;
