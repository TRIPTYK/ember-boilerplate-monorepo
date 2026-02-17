# Password Hashing

Use Argon2 for all password hashing.

```typescript
import { hash, verify } from "argon2";

// Hash password before storing
const hashedPassword = await hash(plainPassword);

// Verify password on login
const isValid = await verify(storedHash, plainPassword);
```

**Utility functions:** Use `#src/utils/auth.utils.js`:
- `hashPassword(password)` — returns hashed string
- `verifyPassword(hash, password)` — returns boolean

**Rules:**
- Never store plain text passwords
- Always use the utility functions, not argon2 directly
- Use default Argon2 settings (secure by default)

**Why:** Argon2 is the recommended password hashing algorithm (PHC winner), more secure than bcrypt.
