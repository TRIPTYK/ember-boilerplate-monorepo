import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { TestApp } from '../../app';
import StatusChip from '#src/components/table-cells/status-chip.gts';

module('Integration | Component | status-chip', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders draft status with warning color', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    const mockRow = { status: 'draft' as const, isOverDueDate: false };

    await render(<template><StatusChip @row={{mockRow}} /></template>);

    assert.dom('.badge').exists('Badge is rendered');
    assert.dom('.badge-warning').exists('Draft status has warning color');
  });

  test('it renders validated status with success color', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    const mockRow = { status: 'validated' as const, isOverDueDate: false };

    await render(<template><StatusChip @row={{mockRow}} /></template>);

    assert.dom('.badge-success').exists('Validated status has success color');
  });

  test('it renders archived status with ghost color', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    const mockRow = { status: 'archived' as const, isOverDueDate: false };

    await render(<template><StatusChip @row={{mockRow}} /></template>);

    assert.dom('.badge-ghost').exists('Archived status has ghost color');
    assert.dom('.badge-outline').exists('Archived status is outlined');
  });

  test('it renders overdue status with error color', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    const mockRow = { status: 'validated' as const, isOverDueDate: true };

    await render(<template><StatusChip @row={{mockRow}} /></template>);

    assert.dom('.badge-error').exists('Overdue status has error color');
  });
});
