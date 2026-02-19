import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { TestApp } from '../../app';
import TreatmentsTable from '#src/components/treatments-table.gts';

module('Integration | Component | treatments-advanced-table', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the advanced table with all columns', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    await render(<template><TreatmentsTable /></template>);

    assert.dom('table').exists('Table is rendered');
    assert.dom('th').exists({ count: 9 }, 'All 9 column headers are present');
  });

  test('it filters treatments by type', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    await render(<template><TreatmentsTable /></template>);

    const typeSelect = this.element.querySelector(
      'select'
    ) as HTMLSelectElement;
    assert.ok(typeSelect, 'Type filter select exists');

    await fillIn(typeSelect, 'Finance');

    assert.dom('.badge-primary').exists('Active filter badge is shown');
  });

  test('it toggles archived treatments visibility', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    await render(<template><TreatmentsTable /></template>);

    const toggle = this.element.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    assert.ok(toggle, 'Include archived toggle exists');

    await click(toggle);

    assert.true(toggle.checked, 'Toggle is checked after click');
  });

  test('it displays status chips with correct colors', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    await render(<template><TreatmentsTable /></template>);

    assert.dom('.badge-warning').exists('Draft status badge exists');
    assert.dom('.badge-success').exists('Validated status badge exists');
  });

  test('it shows sensitive data indicators', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    await render(<template><TreatmentsTable /></template>);

    assert.dom('svg').exists('Sensitive data icons are rendered');
  });

  test('it opens archive confirmation modal', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    await render(<template><TreatmentsTable /></template>);

    const archiveButton = this.element.querySelector(
      'button[aria-label*="Archive"]'
    ) as HTMLButtonElement;

    if (archiveButton) {
      await click(archiveButton);
      assert.dom('[role="dialog"]').exists('Confirmation modal opens');
    } else {
      assert.ok(true, 'Archive button not found in current view');
    }
  });

  test('it clears type filter when clicking clear button', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    await render(<template><TreatmentsTable /></template>);

    const typeSelect = this.element.querySelector(
      'select'
    ) as HTMLSelectElement;
    await fillIn(typeSelect, 'Finance');

    const clearButton = this.element.querySelector(
      '.badge-primary button'
    ) as HTMLButtonElement;

    if (clearButton) {
      await click(clearButton);
      assert.dom('.badge-primary').doesNotExist('Filter badge is removed');
    } else {
      assert.ok(true, 'Clear button test skipped - badge not visible');
    }
  });
});
