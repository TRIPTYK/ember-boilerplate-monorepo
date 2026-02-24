# TpkForm — Automatic context injection

Components yielded by `TpkForm` (`F.TpkXxxPrefab`) automatically inherit:
- `@changeset` — the changeset passed to `TpkForm`
- `@mandatory` — inferred from the Zod schema (`string().min(1)` → required)

Only `@label` and `@validationField` are required in the template.

```hbs
<TpkForm @changeset={{this.changeset}} @validationSchema={{this.schema}} @onSubmit={{this.onSubmit}} as |F|>
  {{! @changeset and @mandatory auto-injected }}
  <F.TpkInputPrefab @label="First name" @validationField="firstName" />
  <F.TpkSelectPrefab @label="Country" @validationField="country" @options={{this.countries}} @onChange={{this.onCountryChange}} />
</TpkForm>
```

## Exception: nested changeset

If a field belongs to a **different changeset** (e.g. inside `TpkStackList` per item), pass `@changeset` explicitly:

```hbs
<TpkStackList @data={{this.items}} ... as |Stack|>
  <Stack.Content as |C|>
    {{! Different changeset → pass explicitly }}
    <TpkValidationInputPrefab
      @label="Phone"
      @changeset={{C.item.changeset}}
      @validationField="phone"
    />
  </Stack.Content>
</TpkStackList>
```
