import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { ImmerChangeset } from 'ember-immer-changeset';
import { email, object, string } from 'zod';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import { service } from '@ember/service';
import type SessionService from 'ember-simple-auth/services/session';

export default class LoginFormComponent extends Component {
  @service declare session: SessionService;

  @tracked changeset = new ImmerChangeset({
    email: 'deflorenne.amaury@triptyk.eu',
    password: '123456789',
  });

  validationSchema = object({
    email: email('Please enter a valid email address'),
    password: string().min(8, 'Password must be at least 8 characters'),
  });

  @action
  async onSubmit(changeset: typeof this.changeset) {
    await this.session.authenticate('authenticator:jwt', {
      email: changeset.get('email'),
      password: changeset.get('password'),
    })
  }

  <template>
    <div class="login-form-container">
      <h2>Login</h2>
      <TpkForm
        @changeset={{this.changeset}}
        @onSubmit={{this.onSubmit}}
        @reactive={{true}}
        @validationSchema={{this.validationSchema}}
      as |F|>
        <F.TpkEmailPrefab @label="Email" @validationField="email" />
        <F.TpkPasswordPrefab @label="Password" @validationField="password" />
        <button type="submit">Login</button>
      </TpkForm>
    </div>
  </template>
}
