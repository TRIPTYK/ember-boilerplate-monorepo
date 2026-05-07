import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';

export default class InvoicesIndexRoute extends Route {
  @service declare store: Store;

  queryParams = {
    month: { refreshModel: true },
  };

  async model(params: { month?: string }) {
    const month = params.month ?? new Date().toISOString().slice(0, 7);

    const result = await this.store.request<{
      data: Array<{
        id: string;
        type: string;
        attributes: {
          month: string;
          subtotal: number;
          discount: number;
          total: number;
          paymentMethod: string | null;
          lineItems: Array<{
            id: string;
            type: 'charge' | 'service' | 'discount';
            label: string;
            amount: number;
          }>;
        };
      }>;
      meta: { total: number };
    }>({
      url: `/api/v1/invoices?filter[month]=${encodeURIComponent(month)}`,
      method: 'GET',
    });

    return { invoices: result.content.data, month };
  }
}
