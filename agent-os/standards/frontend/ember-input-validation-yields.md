# ember-input-validation — Base component yields

Always prefer prefabs. Use base components only when a complex HTML wrapper is required.

## Available yields

All `TpkValidationXxx` base components yield:

| Yield | Type | Description |
|---|---|---|
| `Input` | Component | Input field |
| `Label` | Component | Associated label |
| `errors` | `ZodIssue[]` | Full error list |
| `hasError` | `boolean` | `true` if at least one error |
| `firstError` | `ZodIssue` | First error (message + path) |
| `mandatory` | `boolean` | Required field (inferred from Zod schema) |

## Example

```hbs
<TpkValidationInput
  @label="Last name"
  @changeset={{this.changeset}}
  @validationField="lastName"
  as |V|
>
  <div class="field-wrapper">
    <V.Label />
    <V.Input />
    {{#if V.hasError}}
      <p class="error">{{V.firstError.message}}</p>
    {{/if}}
  </div>
</TpkValidationInput>
```

- `V.firstError.message` contains the translated Zod error message
- Same yields for `TpkValidationCheckbox`, `TpkValidationDatepicker`, `TpkValidationFile`, `TpkValidationSelect`, `TpkValidationTextarea`
