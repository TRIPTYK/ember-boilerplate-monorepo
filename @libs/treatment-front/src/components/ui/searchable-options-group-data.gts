import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import TpkSelectCreate from '@triptyk/ember-input/components/tpk-select-create';
import { t } from 'ember-intl';
import ShieldIcon from '#src/assets/icons/shield.gts';
import LockOpenIcon from '#src/assets/icons/lock-open.gts';
import LockIcon from '#src/assets/icons/lock.gts';
import DeleteIcon from '#src/assets/icons/delete.gts';
import KebabIcon from '#src/assets/icons/kebab.gts';

export interface SensitiveDataItem {
  name: string;
  isSensitive: boolean;
}

interface SearchableOptionsGroupDataSignature {
  Args: {
    allOptions: string[];
    selected: SensitiveDataItem[];
    onSelect: (value: string) => void;
    onRemove: (name: string) => void;
    onToggleSensitivity: (name: string) => void;
    allowCustomValues?: boolean;
    placeholder?: string;
  };
}

export default class SearchableOptionsGroupData extends Component<SearchableOptionsGroupDataSignature> {
  @action
  handleChange(newSelected: unknown): void {
    this.args.onSelect((newSelected as string[])[0] ?? '');
  }

  @action
  handleCreate(value: unknown): void {
    this.args.onSelect(value as string);
  }

  @action
  showCreateOption(term: string): boolean {
    return (this.args.allowCustomValues ?? false) && term.trim().length > 0;
  }

  @action
  removeItem(name: string): void {
    this.args.onRemove(name);
  }

  @action
  toggleSensitivity(name: string): void {
    this.args.onToggleSensitivity(name);
  }

  <template>
    <div class="tpk-select-search-container">
      <TpkSelectCreate
        @label={{if @placeholder @placeholder "Rechercher..."}}
        @options={{@allOptions}}
        @multiple={{true}}
        @onChange={{this.handleChange}}
        @onCreate={{this.handleCreate}}
        @showCreateWhen={{this.showCreateOption}}
        @searchEnabled={{true}}
        @placeholder={{if @placeholder @placeholder "Rechercher..."}}
        as |S|
      >
        <S.Option as |O|>{{O.option}}</S.Option>
      </TpkSelectCreate>
    </div>
    <div class="flex flex-wrap gap-2 mt-3">
      {{#each @selected as |item|}}
        <div
          class="badge gap-2 py-1 h-fit
            {{if item.isSensitive 'badge-warning' 'badge-primary'}}"
        >
          {{#if item.isSensitive}}
            <span
              title={{t "treatments.form.step5.labels.markAsNotSensitive"}}
            ><ShieldIcon class="w-4 h-4" /></span>
          {{/if}}
          <span>{{item.name}}</span>
          <button
            type="button"
            class="cursor-pointer p-0.5 rounded hover:bg-black/20 transition-colors"
            title={{if
              item.isSensitive
              (t "treatments.form.step5.labels.markAsNotSensitive")
              (t "treatments.form.step5.labels.markAsSensitive")
            }}
            {{on "click" (fn this.toggleSensitivity item.name)}}
          >
            {{#if item.isSensitive}}<LockOpenIcon
                class="w-4 h-4"
              />{{else}}<LockIcon class="w-4 h-4" />{{/if}}
          </button>
          <div class="dropdown dropdown-end">
            <button
              tabindex="0"
              type="button"
              class="p-0.5 rounded hover:bg-black/20 transition-colors cursor-pointer"
            >
              <KebabIcon class="w-4 h-4" />
            </button>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 min-w-44 text-base-content p-0"
            >
              <li>
                <button
                  type="button"
                  class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-base-200 text-left rounded-none"
                  {{on "click" (fn this.toggleSensitivity item.name)}}
                >
                  {{#if item.isSensitive}}<LockOpenIcon
                      class="w-4 h-4"
                    />{{else}}<LockIcon class="w-4 h-4" />{{/if}}
                  {{if
                    item.isSensitive
                    (t "treatments.form.step5.labels.markAsNotSensitive")
                    (t "treatments.form.step5.labels.markAsSensitive")
                  }}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-base-200 text-error text-left rounded-none"
                  {{on "click" (fn this.removeItem item.name)}}
                >
                  <DeleteIcon class="w-4 h-4" />
                  {{t "treatments.form.step5.labels.delete"}}
                </button>
              </li>
            </ul>
          </div>
        </div>
      {{/each}}
    </div>
  </template>
}
