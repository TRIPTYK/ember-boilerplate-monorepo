# Form Pattern

Forms use Zod validation + ImmerChangeset + TpkForm + entity service.

## File structure

```
src/components/forms/
├── {entity}-form.gts          # Form component
└── {entity}-validation.ts     # Zod validation schema
```

## Validation schema

Factory function taking `IntlService` for i18n error messages:

```typescript
// {entity}-validation.ts
import { boolean, object, string } from 'zod';
import type { IntlService } from 'ember-intl';

export const create{Entity}ValidationSchema = (intl: IntlService) =>
  object({
    title: string(intl.t('{entities}.forms.{entity}.validation.titleRequired'))
      .min(1, intl.t('{entities}.forms.{entity}.validation.titleRequired')),
    id: string().optional().nullable(),
  });

export type Validated{Entity} = z.infer<ReturnType<typeof create{Entity}ValidationSchema>>;
export type Update{Entity}Data = Validated{Entity} & { id: string };
```

## Form component

```typescript
// {entity}-form.gts
interface {Entity}FormArgs {
  changeset: {Entity}Changeset;
}

export default class {Entity}Form extends Component<{Entity}FormArgs> {
  @service declare {entity}: {Entity}Service;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;

  get validationSchema() {
    return create{Entity}ValidationSchema(this.intl);
  }

  onSubmit = async (data, changeset) => {
    await this.{entity}.save(changeset);
    await this.router.transitionTo('dashboard.{entities}');
    this.flashMessages.success(this.intl.t('{entities}.forms.{entity}.messages.saveSuccess'));
  };

  <template>
    <TpkForm @changeset={{@changeset}} @onSubmit={{this.onSubmit}}
      @validationSchema={{this.validationSchema}} data-test-{entities}-form as |F|>
      <F.TpkInputPrefab @label={{t "{entities}.forms.{entity}.labels.title"}} @validationField="title" />
      <button type="submit">{{t "{entities}.forms.{entity}.actions.submit"}}</button>
    </TpkForm>
  </template>
}
```

## Key rules

- Validation schema is a factory function — it needs `IntlService`
- All labels and error messages use i18n keys via `t` helper
- `onSubmit` flow: save via service → transition → flash message
- Changeset is passed in from the route template, not created in the form
- Add `data-test-{entities}-form` attribute on `TpkForm` for testing
