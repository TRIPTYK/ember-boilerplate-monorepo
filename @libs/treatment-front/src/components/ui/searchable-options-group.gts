import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import TpkSelectCreate from '@triptyk/ember-input/components/tpk-select-create';
import XMarkIcon from '#src/assets/icons/x-mark.gts';

interface SearchableOptionsGroupSignature {
  Args: {
    allOptions: string[];
    selected: string[];
    onSelect: (value: string) => void;
    onRemove: (value: string) => void;
    allowCustomValues?: boolean;
    placeholder?: string;
    /** @deprecated no longer displayed */
    popularLabel?: string;
  };
}

export default class SearchableOptionsGroup extends Component<SearchableOptionsGroupSignature> {
  @action
  handleChange(newSelected: unknown): void {
    console.log('handleChange', newSelected);
    this.args.onSelect((newSelected as string[])[0] ?? '');
  }

  @action
  handleCreate(value: unknown): void {
    console.log('handleCreate', value);
    this.args.onSelect(value as string);
  }

  @action
  showCreateOption(term: string): boolean {
    return (this.args.allowCustomValues ?? false) && term.trim().length > 0;
  }

  @action
  removeItem(item: string): void {
    this.args.onRemove(item);
  }

  <template>
    <div class="tpk-select-search-container">
      aaa
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
        <div class="badge badge-primary gap-2 py-1 h-fit">
          <span>{{item}}</span>
          <button
            type="button"
            class="cursor-pointer hover:text-primary-content/70 transition-colors"
            {{on "click" (fn this.removeItem item)}}
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      {{/each}}
    </div>
  </template>
}
