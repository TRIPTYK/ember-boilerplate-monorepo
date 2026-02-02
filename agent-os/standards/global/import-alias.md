# Import Alias

Use #src/ alias for imports within libraries.

```typescript
// Good
import UserService from '#src/services/user.ts';
import { UserChangeset } from '#src/changesets/user.ts';
import UsersForm from '#src/components/forms/user-form.gts';

// Avoid
import UserService from '../../../services/user.ts';
import { UserChangeset } from '../../changesets/user.ts';
```

**Configuration (package.json):**
```json
{
  "imports": {
    "#src/*": "./src/*"
  }
}
```

**Rules:**
- Use #src/ for all imports within the library
- Never use relative paths (../) for src/ imports
- External packages use normal imports (@triptyk/...)

**Why:** Easier to read and resolve paths. No need to count ../../ levels. Refactoring-friendly.
