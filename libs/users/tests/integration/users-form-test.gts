import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, find, render } from '@ember/test-helpers';
import { object, string} from 'zod';
import ImmerChangeset from 'ember-immer-changeset';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';

import TpkFormService from '@triptyk/ember-input-validation/services/tpk-form';
import { getOwner } from '@ember/owner';

module('tpk-form', function(hooks) {
  setupRenderingTest(hooks);

  test('Should pass errors to the prefab inputs when the changeset is invalid upon submission', async function(assert) {
    const changeset = new ImmerChangeset({});
    const schema = object({
      name: string().min(10, 'Too small: expected string to have >=10 characters'),
      email: string().email('Invalid email address'),
    });


    getOwner(this)?.register('service:tpk-form', TpkFormService);

    const onSubmit = () => {
      // no-op
    };



    await render(<template>
      <TpkForm
        @changeset={{changeset}}
        @validationSchema={{schema}}
        @onSubmit={{onSubmit}}
        @reactive={{true}}
        @autoScrollOnError={{true}}
        @removeErrorsOnSubmit={{true}}
        @executeOnValid={{true}}
        as |F|
      >
        <F.TpkInputPrefab
          data-test-name
          @label="test"
          @validationField="name"
        />
        <F.TpkInput @label="test" @type="email" @validationField="email" as |I|>
          {{log I.errors}}
          <I.Label />
          <I.Input />
        </F.TpkInput>
        <button type="submit">Submit</button>
      </TpkForm>
    </template>)

    await new Promise((res) => setTimeout(res, 60000)); // wait for next tick

    assert.false(changeset.isInvalid);

    await fillIn('[data-test-name] input', 't@g.com');

    await click('button[type="submit"]');

    assert.true(changeset.isInvalid);
    assert.ok(find('[data-test-tpk-validation-errors]'));
    assert.true(find('[data-test-tpk-validation-errors]')?.textContent?.includes('Too small: expected string to have >=10 characters'));
  });
});
