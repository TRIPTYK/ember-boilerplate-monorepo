# ember-input — Specific components

## TpkValidationRadioGroup

Only component requiring mandatory composition with a yielded `G.Radio`.

```ts
import TpkValidationRadioGroup from '@triptyk/ember-input-validation/components/tpk-validation-radio-group';
// TpkValidationRadio is yielded by the group — no separate import needed
```

```hbs
{{! Via TpkForm (recommended) }}
<F.TpkRadioGroupPrefab @label="Title" @validationField="civility" as |G|>
  <G.Radio @label="Mr" @value="mr" />
  <G.Radio @label="Mrs" @value="mrs" />
</F.TpkRadioGroupPrefab>

{{! Standalone }}
<TpkValidationRadioGroup @changeset={{this.changeset}} @validationField="civility" as |G|>
  <G.Radio @label="Mr" @value="mr" />
  <G.Radio @label="Mrs" @value="mrs" />
</TpkValidationRadioGroup>
```

- `G.Radio` is auto-bound to the group (`@name`, `@selected`, `@onChange`)
- Never instantiate `TpkValidationRadio` directly — always use `G.Radio`

## TpkButton — anti-spam protection

Double-click protection enabled by default (`drop` strategy via ember-concurrency).

```hbs
<TpkButton @onClick={{this.save}}>Save</TpkButton>
```

- Never pass `@allowSpam={{true}}` — always keep the protection
- `@disabled` can be passed additionally if loading state is managed manually
