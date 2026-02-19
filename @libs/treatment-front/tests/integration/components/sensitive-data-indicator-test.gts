import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { TestApp } from '../../app';
import SensitiveDataIndicator from '#src/components/table-cells/sensitive-data-indicator.gts';

module('Integration | Component | sensitive-data-indicator', function (hooks) {
  setupRenderingTest(hooks);

  test('it shows error icon when sensitive data is present in personal data', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    const mockRow = {
      data: {
        personalDataGroup: {
          data: {
            name: [
              { name: 'Name', isSensitive: false },
              { name: 'Health data', isSensitive: true },
            ],
          },
        },
      },
    };

    await render(
      <template><SensitiveDataIndicator @row={{mockRow}} /></template>
    );

    assert.dom('.text-error').exists('Error icon is shown for sensitive data');
    assert.dom('svg').exists('Icon is rendered');
  });

  test('it shows success icon when no sensitive data is present', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    const mockRow = {
      data: {
        personalDataGroup: {
          data: {
            name: [
              { name: 'Name', isSensitive: false },
              { name: 'Email', isSensitive: false },
            ],
          },
        },
      },
    };

    await render(
      <template><SensitiveDataIndicator @row={{mockRow}} /></template>
    );

    assert
      .dom('.text-success')
      .exists('Success icon is shown for no sensitive data');
    assert.dom('svg').exists('Icon is rendered');
  });

  test('it shows error icon when sensitive data is present in financial data', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    const mockRow = {
      data: {
        financialDataGroup: {
          data: {
            name: [
              { name: 'Salary', isSensitive: false },
              { name: 'Bank account', isSensitive: true },
            ],
          },
        },
      },
    };

    await render(
      <template><SensitiveDataIndicator @row={{mockRow}} /></template>
    );

    assert
      .dom('.text-error')
      .exists('Error icon is shown for sensitive financial data');
  });

  test('it shows success icon when data groups are empty', async function (assert) {
    const app = new TestApp(this.owner);
    await app.boot();

    const mockRow = {
      data: {},
    };

    await render(
      <template><SensitiveDataIndicator @row={{mockRow}} /></template>
    );

    assert
      .dom('.text-success')
      .exists('Success icon is shown when no data groups exist');
  });
});
