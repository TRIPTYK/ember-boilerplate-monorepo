# Form Pattern

Forms use Zod validation + ImmerChangeset + TpkForm + HandleSaveService + entity service.

## File structure

```
@libs/{entities}-front/src/
├── changesets/{entity}.ts              # Changeset class + Draft interface
├── components/forms/{entity}-form.gts  # Form component + page object
├── components/forms/{entity}-validation.ts  # Zod schemas (create + edit)
├── services/{entity}.ts                # Entity service (save/create/update/delete)
└── routes/dashboard/{entities}/
    ├── create-template.gts             # Create route template
    └── edit-template.gts               # Edit route template
```

## Changeset

```typescript
// changesets/{entity}.ts
import ImmerChangeset from 'ember-immer-changeset';

export interface Draft{Entity} {
  id?: string | null;
  title?: string;
  // ... fields
}

export class {Entity}Changeset extends ImmerChangeset<Draft{Entity}> {}
```

## Validation schemas

Two factory functions per entity — one for create (`id` optional/nullable), one for edit (`id` required):

```typescript
// components/forms/{entity}-validation.ts
import { object, string } from 'zod';
import type z from 'zod';
import type { IntlService } from 'ember-intl';

export const create{Entity}ValidationSchema = (intl: IntlService) =>
  object({
    title: string(intl.t('{entities}.forms.{entity}.validation.titleRequired'))
      .min(1, intl.t('{entities}.forms.{entity}.validation.titleRequired')),
    id: string().optional().nullable(),
  });

export const edit{Entity}ValidationSchema = (intl: IntlService) =>
  object({
    title: string(intl.t('{entities}.forms.{entity}.validation.titleRequired'))
      .min(1, intl.t('{entities}.forms.{entity}.validation.titleRequired')),
    id: string(),
  });

export type Validated{Entity} = z.infer<ReturnType<typeof create{Entity}ValidationSchema>>;
export type Updated{Entity} = z.infer<ReturnType<typeof edit{Entity}ValidationSchema>>;
```

## Form component

- `validationSchema` is passed as an `@arg` from the route template — NOT computed inside the form
- `onSubmit` receives `(data, changeset)` — `data` is raw validated data, `changeset` is the ImmerChangeset
- Uses `HandleSaveService` for save + transition + flash + error handling
- Calls `this.{entity}.save(data)` with raw data, NOT the changeset
- Exports a `pageObject` for testing

```typescript
// components/forms/{entity}-form.gts
interface {Entity}FormArgs {
  changeset: {Entity}Changeset;
  validationSchema:
    | ReturnType<typeof create{Entity}ValidationSchema>
    | ReturnType<typeof edit{Entity}ValidationSchema>;
}

export default class {Entities}Form extends Component<{Entity}FormArgs> {
  @service declare {entity}: {Entity}Service;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;
  @service declare handleSave: HandleSaveService;

  onSubmit = async (
    data: Validated{Entity} | Updated{Entity},
    c: ImmerChangeset<Validated{Entity} | Updated{Entity}>
  ) => {
    await this.handleSave.handleSave({
      saveAction: () => this.{entity}.save(data),
      changeset: c,
      successMessage: '{entities}.forms.{entity}.messages.saveSuccess',
      transitionOnSuccess: 'dashboard.{entities}',
    });
  };

  <template>
    <TpkForm
      @changeset={{@changeset}}
      @onSubmit={{this.onSubmit}}
      @validationSchema={{@validationSchema}}
      data-test-{entities}-form
      as |F|
    >
      <F.TpkInputPrefab
        @label={{t "{entities}.forms.{entity}.labels.title"}}
        @validationField="title"
      />
      <button type="submit">{{t "{entities}.forms.{entity}.actions.submit"}}</button>
    </TpkForm>
  </template>
}

export const pageObject = create({
  scope: '[data-test-{entities}-form]',
  title: fillable('[data-test-tpk-prefab-input-container="title"] input'),
  submit: clickable('button[type="submit"]'),
});
```

## Route templates

Route template creates the changeset + validation schema and passes both to the form:

```typescript
// routes/dashboard/{entities}/create-template.gts
export default class {Entities}CreateRouteTemplate extends Component<{Entities}CreateRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof create{Entity}ValidationSchema>;
  changeset = new {Entity}Changeset({});

  constructor(owner: Owner, args: {Entities}CreateRouteSignature) {
    super(owner, args);
    this.validationSchema = create{Entity}ValidationSchema(this.intl);
  }

  <template>
    <{Entities}Form @changeset={{this.changeset}} @validationSchema={{this.validationSchema}} />
  </template>
}
```

Edit template populates the changeset from model data and uses `edit{Entity}ValidationSchema`:

```typescript
// routes/dashboard/{entities}/edit-template.gts
export default class {Entities}EditRouteTemplate extends Component<{Entities}EditRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof edit{Entity}ValidationSchema>;

  constructor(owner: Owner, args: {Entities}EditRouteSignature) {
    super(owner, args);
    this.validationSchema = edit{Entity}ValidationSchema(this.intl);
  }

  changeset = new {Entity}Changeset({
    id: this.args.model.{entity}.id,
    title: this.args.model.{entity}.title,
    // ... populate from model
  });

  <template>
    <{Entities}Form @changeset={{this.changeset}} @validationSchema={{this.validationSchema}} />
  </template>
}
```

## Entity service

`save(data)` receives raw validated data (not changeset). Routes to `create` or `update` based on `id`:

```typescript
// services/{entity}.ts
export default class {Entity}Service extends Service {
  @service declare store: Store;

  public async save(data: Validated{Entity} | Updated{Entity}) {
    if (data.id) {
      return this.update(data as Updated{Entity});
    } else {
      return this.create(data as Validated{Entity});
    }
  }
}
```

## Key rules

- Two validation schemas per entity: `create` (id optional) and `edit` (id required)
- Validation schema is a factory function — it needs `IntlService`
- `validationSchema` is passed as `@arg` to the form, NOT computed inside the form
- Changeset + validation schema are created in the **route template**, not the form
- `onSubmit` uses `HandleSaveService.handleSave()` — never manually do save + transition + flash
- `saveAction` calls `this.{entity}.save(data)` with raw data, not the changeset
- All labels and error messages use i18n keys via `t` helper
- Add `data-test-{entities}-form` attribute on `TpkForm` for testing
- Export `pageObject` from the form file for testing
