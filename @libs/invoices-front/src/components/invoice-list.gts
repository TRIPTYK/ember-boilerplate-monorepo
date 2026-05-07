import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type InvoiceService from '#src/services/invoice.ts';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import type { IntlService } from 'ember-intl';
import { t } from 'ember-intl';
import type RouterService from '@ember/routing/router-service';

interface InvoiceData {
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
}

interface InvoiceListSignature {
  Args: {
    model: {
      invoices: InvoiceData[];
      month: string;
    };
  };
}

class InvoiceList extends Component<InvoiceListSignature> {
  @service declare invoice: InvoiceService;
  @service declare flashMessages: FlashMessagesService;
  @service declare intl: IntlService;
  @service declare router: RouterService;

  @tracked isDownloading = false;

  @action
  onMonthChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.router.transitionTo('dashboard.invoices.index', {
      queryParams: { month: input.value },
    });
  }

  @action
  async downloadPdf(invoice: InvoiceData) {
    this.isDownloading = true;
    try {
      await this.invoice.downloadPdf(invoice.id, invoice.attributes.month);
    } catch {
      this.flashMessages.danger(this.intl.t('invoices.messages.pdfError'));
    } finally {
      this.isDownloading = false;
    }
  }

  <template>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-semibold">{{t "invoices.pages.list.title"}}</h1>
        <input
          type="month"
          value={{@model.month}}
          class="border rounded px-2 py-1"
          {{on "change" this.onMonthChange}}
        />
      </div>

      {{#if @model.invoices.length}}
        {{#each @model.invoices as |invoice|}}
          <div class="border rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-medium">{{t "invoices.invoice.title" month=invoice.attributes.month}}</h2>
              <button
                type="button"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={{this.isDownloading}}
                {{on "click" (fn this.downloadPdf invoice)}}
              >
                {{t "invoices.actions.downloadPdf"}}
              </button>
            </div>

            <table class="w-full text-sm mb-4">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2">{{t "invoices.table.headers.description"}}</th>
                  <th class="text-left py-2">{{t "invoices.table.headers.type"}}</th>
                  <th class="text-right py-2">{{t "invoices.table.headers.amount"}}</th>
                </tr>
              </thead>
              <tbody>
                {{#each invoice.attributes.lineItems as |item|}}
                  <tr class="border-b">
                    <td class="py-2">{{item.label}}</td>
                    <td class="py-2">{{item.type}}</td>
                    <td class="py-2 text-right">{{item.amount}}</td>
                  </tr>
                {{/each}}
              </tbody>
            </table>

            <div class="text-right space-y-1">
              <div>{{t "invoices.totals.subtotal"}}: {{invoice.attributes.subtotal}}</div>
              <div>{{t "invoices.totals.discount"}}: -{{invoice.attributes.discount}}</div>
              <div class="font-bold text-lg">{{t "invoices.totals.total"}}: {{invoice.attributes.total}}</div>
              {{#if invoice.attributes.paymentMethod}}
                <div class="text-gray-600">{{t "invoices.totals.paymentMethod"}}: {{invoice.attributes.paymentMethod}}</div>
              {{/if}}
            </div>
          </div>
        {{/each}}
      {{else}}
        <p class="text-gray-500 text-center py-12">{{t "invoices.pages.list.empty"}}</p>
      {{/if}}
    </div>
  </template>
}

export default InvoiceList;
