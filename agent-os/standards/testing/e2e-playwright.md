# E2E Testing with Playwright

E2E tests live in `@apps/front/e2e/` and run against the built frontend.

**Config:** Tests use `vite preview` on port 4200.

**Test structure:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Login or setup shared state
    await page.goto('/login');
    // ... login steps
  });

  test('does something', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Title' })).toBeVisible();
  });
});
```

**Selector strategy (priority order):**
1. `getByRole()` — buttons, links, headings, textboxes
2. `getByLabel()` — form inputs with labels
3. `getByText()` — visible text content
4. Avoid CSS selectors unless necessary

**Waiting:**
```typescript
// Good: wait for element state
await expect(page.getByRole('button')).toBeVisible();
await expect(page).toHaveURL('/dashboard');

// Avoid: arbitrary timeouts
await page.waitForTimeout(500); // Don't do this
```

**Rules:**
- Group related tests in `test.describe` blocks
- Use `beforeEach` for common setup (login, navigation)
- Prefer role-based selectors for accessibility
- Wait for conditions, not arbitrary timeouts

**Why:** Role-based selectors are resilient to markup changes and test accessibility.
