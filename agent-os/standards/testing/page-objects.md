# Page Objects in Components

Export page objects directly from component files.

```typescript
import Component from '@glimmer/component';
import { create, fillable, clickable } from 'ember-cli-page-object';

export default class LoginForm extends Component {
  // component code...
  <template>
    <div data-test-login-form>
      <input data-test-email />
      <button type="submit">Login</button>
    </div>
  </template>
}

export const pageObject = create({
  scope: '[data-test-login-form]',
  email: fillable('[data-test-email]'),
  submit: clickable('button[type="submit"]'),
});
```

**Usage in tests:**
```typescript
import LoginForm, { pageObject } from '#src/components/login-form.gts';

await render(<template><LoginForm /></template>);
await pageObject.email('test@example.com');
await pageObject.submit();
```

**Rules:**
- Export page objects from the component file
- Use data-test-* attributes for selectors
- Create page objects for all components with interactive content

**Why:** Keeps page object definitions next to components. Easier to find and maintain.
