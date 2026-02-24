# ember-input — Composition vs Prefab

## Rule

Base components **require** composition mode (`as |X|`). Prefabs are pre-assembled.

```hbs
{{! Base — composition required }}
<TpkInput @label="First name" @value={{this.value}} @onChange={{this.onChange}} as |I|>
  <I.Label />
  <I.Input />
</TpkInput>

{{! Prefab — no composition needed }}
<F.TpkInputPrefab @label="First name" @validationField="firstName" />
```

## When to use which

| Case | Component |
|---|---|
| Standard form (inside `TpkForm`) | Yielded prefab `F.TpkXxxPrefab` |
| Standalone prefab (without `TpkForm`) | `TpkValidationXxxPrefab` with `@changeset` |
| Custom error rendering or layout | Base component (`TpkValidationInput` etc.) |

## Imports

```ts
// Base (ember-input)
import TpkInput from '@triptyk/ember-input/components/tpk-input';

// Base with validation (ember-input-validation)
import TpkValidationInput from '@triptyk/ember-input-validation/components/tpk-validation-input';

// Standalone prefab
import TpkValidationInputPrefab from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-input';

// Via TpkForm → F.TpkInputPrefab (auto-injected, no import needed)
```
