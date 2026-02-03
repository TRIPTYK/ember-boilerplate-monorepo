import { test, expect } from '@playwright/test';

test('can login', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email *' }).fill('deflorenne.amaury@triptyk.eu');
  await page.getByRole('textbox', { name: 'Password * eye' }).fill('123456789');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/');
});
