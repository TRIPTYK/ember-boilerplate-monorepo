import { test, expect } from '@playwright/test';

test.describe('Users Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email *' }).fill('deflorenne.amaury@triptyk.eu');
    await page.getByRole('textbox', { name: 'Password * eye' }).fill('123456789');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to users dashboard
    await page.goto('/dashboard/users');
  });

  test('displays users list', async ({ page }) => {
    // Verify page title
    await expect(page.getByRole('heading', { name: 'List des utilisateurs' })).toBeVisible();

    // Verify table headers
    await expect(page.getByRole('button', { name: 'Nom', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Prénom' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
  });

  test('can search for users', async ({ page }) => {
    // Type in search box
    const searchBox = page.getByRole('searchbox', { name: 'magnyfying glass' });
    await searchBox.fill('Jane');
    await searchBox.press('Enter');

    // Wait for search results
    await page.waitForTimeout(500);

    // Verify filtered results - 1 user found
    await expect(page.getByText('1 - 1 On 1 Results')).toBeVisible();
  });

  test('can clear search and show all users', async ({ page }) => {
    // Search for a user
    const searchBox = page.getByRole('searchbox', { name: 'magnyfying glass' });
    await searchBox.fill('Jane');
    await searchBox.press('Enter');
    await page.waitForTimeout(500);

    // Clear search
    await searchBox.click();
    await searchBox.press('Meta+a');
    await searchBox.press('Backspace');
    await searchBox.press('Enter');
    await page.waitForTimeout(500);

    // Verify all users are shown
    await expect(page.getByText('1 - 3 On 3 Results')).toBeVisible();
  });

  test('can sort by Nom column', async ({ page }) => {
    // Click Nom column to sort
    await page.getByRole('button', { name: 'Nom', exact: true }).click();
    await page.waitForTimeout(500);

    // Click again to reverse sort
    await page.getByRole('button', { name: 'Nom', exact: true }).click();
    await page.waitForTimeout(500);

    // Verify the table still displays users
    await expect(page.getByRole('cell', { name: 'john.doe@example.com' })).toBeVisible();
  });

  test('can sort by Prénom column', async ({ page }) => {
    // Click Prénom column to sort
    await page.getByRole('button', { name: 'Prénom' }).click();
    await page.waitForTimeout(500);

    // Verify the table still displays users
    await expect(page.getByRole('cell', { name: 'bob.johnson@example.com' })).toBeVisible();
  });

  test('can change results per page', async ({ page }) => {
    // Change results per page dropdown
    await page.getByLabel('Results per page:').selectOption('10');
    await page.waitForTimeout(500);

    // Verify dropdown changed
    await expect(page.getByLabel('Results per page:')).toHaveValue('10');
  });

  test('can create a new user', async ({ page }) => {
    // Click Add User button
    await page.getByRole('button', { name: 'Add User' }).click();

    // Verify navigation to create page
    await expect(page).toHaveURL('/dashboard/users/create');

    // Fill in the form
    await page.getByRole('textbox', { name: 'First Name *' }).fill('Alice');
    await page.getByRole('textbox', { name: 'Last Name *' }).fill('Williams');
    await page.getByRole('textbox', { name: 'Email *' }).fill('alice.williams@example.com');

    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify success message and redirect
    await expect(page).toHaveURL('/dashboard/users');
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
    await expect(page.getByText('User saved successfully.')).toBeVisible();
  });

  test('can edit an existing user', async ({ page }) => {
    // Click on a user row
    await page.getByRole('row', { name: /Jane Smith jane.smith@example/ }).click();

    // Verify navigation to edit page
    await expect(page).toHaveURL(/\/dashboard\/users\/\d+\/edit/);

    // Verify form is pre-filled
    await expect(page.getByRole('textbox', { name: 'First Name *' })).toHaveValue('Jane');
    await expect(page.getByRole('textbox', { name: 'Last Name *' })).toHaveValue('Smith');
    await expect(page.getByRole('textbox', { name: 'Email *' })).toHaveValue('jane.smith@example.com');

    // Update the first name
    const firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
    await firstNameInput.click();
    await firstNameInput.press('Meta+a');
    await firstNameInput.fill('Janet');

    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify success message and redirect
    await expect(page).toHaveURL('/dashboard/users');
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
    await expect(page.getByText('User saved successfully.')).toBeVisible();
  });

  test('can navigate using sidebar', async ({ page }) => {
    // Click Dashboard link in sidebar
    await page.getByRole('link', { name: 'Dashboard' }).click();

    // Verify navigation to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Navigate back to Users
    await page.getByRole('link', { name: 'Users' }).click();

    // Verify navigation to users page
    await expect(page).toHaveURL('/dashboard/users');
  });

  test('can toggle sidebar', async ({ page }) => {
    // Click sidebar toggle button
    await page.getByLabel('open sidebar').click();

    // Wait for any animations
    await page.waitForTimeout(300);

    // Verify page is still functional
    await expect(page.getByRole('heading', { name: 'List des utilisateurs' })).toBeVisible();
  });
});
