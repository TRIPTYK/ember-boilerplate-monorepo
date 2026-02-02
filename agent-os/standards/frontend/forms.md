# Changeset + TpkForm Pattern

Use ImmerChangeset with TpkForm for all forms.

```typescript
import { ImmerChangeset } from 'ember-immer-changeset';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import { object, string } from 'zod';

class MyForm extends Component {
  @tracked changeset = new ImmerChangeset({ firstName: '', lastName: '' });
  
  validationSchema = object({
    firstName: string().min(2),
    lastName: string().min(2),
  });

  onSubmit = async () => {
    // Form is already validated by TpkForm
    await this.myService.save(this.changeset.data);
  }

  <template>
    <TpkForm
      @changeset={{this.changeset}}
      @onSubmit={{this.onSubmit}}
      @validationSchema={{this.validationSchema}}
      @reactive={{true}}
    as |F|>
      <F.TpkInputPrefab @label="First Name" @validationField="firstName" />
      <button type="submit">Submit</button>
    </TpkForm>
  </template>
}
```

**Rules:**
- Always use @reactive={{true}} for validation
- Use TpkForm prefabs (TpkInputPrefab, TpkEmailPrefab, etc.)
- TpkForm validates before calling onSubmit

**Why:** ImmerChangeset handles nested properties, rollback, and validation. Consistent form patterns across the app.
