# File Extensions

Use .gts for template-containing files, .ts for logic-only.

**Component files (.gts):**
```typescript
// login-form.gts
import Component from '@glimmer/component';

export default class LoginForm extends Component {
  <template>
    <form>...</form>
  </template>
}
```

**Template-only (.gts):**
```typescript
// index-template.gts
import type { TOC } from '@ember/component/template-only';

export default <template>
  <h1>Users</h1>
</template> as TOC<object>;
```

**Logic-only (.ts):**
```typescript
// user.service.ts
import Service from '@ember/service';

export default class UserService extends Service {
  // No template
}
```

**Rules:**
- .gts when file contains `<template>` tags
- .ts for services, routes, utilities, schemas
- .gts combines TypeScript + Handlebars in one file

**Why:** .gts enables type-safe templates with Glint. Clear distinction between template and logic files.
