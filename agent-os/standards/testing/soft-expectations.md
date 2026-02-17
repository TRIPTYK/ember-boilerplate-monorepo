# Soft Expectations

Use expect.soft for all test assertions.

```typescript
import { expect as hardExpect } from 'vitest';

const expect = hardExpect.soft;

describe('MyComponent', () => {
  test('validates multiple fields', async () => {
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
    // All three assertions run even if first fails
  });
});
```

**Rules:**
- Import expect as hardExpect, use hardExpect.soft
- Apply to all tests - integration, unit, and rendering
- All assertions in a test execute regardless of failures

**Why:** Better test ergonomics - see all failures at once instead of fixing one at a time. Faster debugging.
