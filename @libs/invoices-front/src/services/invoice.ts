import Service from '@ember/service';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
import type SessionService from 'ember-simple-auth/services/session';

export default class InvoiceService extends Service {
  @service declare store: Store;
  @service declare session: SessionService;

  public async fetchForMonth(month: string) {
    return this.store.request<{ data: unknown[] }>({
      url: `/api/v1/invoices?filter[month]=${encodeURIComponent(month)}`,
      method: 'GET',
    });
  }

  public async downloadPdf(invoiceId: string, month: string) {
    const authData = this.session.data.authenticated as Record<string, unknown>;
    const accessToken = (authData?.['data'] as Record<string, unknown>)?.[
      'accessToken'
    ] as string | undefined;

    const response = await fetch(`/api/v1/invoices/${invoiceId}/pdf`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${month}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
