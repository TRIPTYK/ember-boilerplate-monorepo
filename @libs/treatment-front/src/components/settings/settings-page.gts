import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { t } from 'ember-intl';
import SettingTable from '#src/components/tables/setting-table.gts';
import CompanyForm from '#src/components/settings/company-form.gts';

interface SettingsPageSignature {
  Args: Record<string, never>;
  Element: HTMLDivElement;
}

export default class SettingsPage extends Component<SettingsPageSignature> {
  @tracked activeTab: 'settings' | 'company' = 'settings';

  get isSettingsTab(): boolean {
    return this.activeTab === 'settings';
  }

  get settingsTabClass(): string {
    return this.isSettingsTab ? 'tab tab-active' : 'tab';
  }

  get companyTabClass(): string {
    return this.activeTab === 'company' ? 'tab tab-active' : 'tab';
  }

  @action
  setActiveTab(tab: 'settings' | 'company'): void {
    this.activeTab = tab;
  }

  <template>
    <div class="flex flex-col gap-6" ...attributes>
      <div role="tablist" class="tabs tabs-boxed w-fit">
        <button
          role="tab"
          type="button"
          class={{this.settingsTabClass}}
          {{on "click" (fn this.setActiveTab "settings")}}
        >
          {{t "settings.page.tabs.settings"}}
        </button>
        <button
          role="tab"
          type="button"
          class={{this.companyTabClass}}
          {{on "click" (fn this.setActiveTab "company")}}
        >
          {{t "settings.page.tabs.company"}}
        </button>
      </div>

      {{#if this.isSettingsTab}}
        <SettingTable />
      {{else}}
        <CompanyForm />
      {{/if}}
    </div>
  </template>
}
