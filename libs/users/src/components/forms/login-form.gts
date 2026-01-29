import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { ImmerChangeset } from 'ember-immer-changeset';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import { service } from '@ember/service';
import type SessionService from 'ember-simple-auth/services/session';
import { clickable, create, fillable } from 'ember-cli-page-object';
import LoginValidationSchema from './login-validation.ts';

export default class LoginForm extends Component {
  @service declare session: SessionService;

  @tracked changeset = new ImmerChangeset({
    email: 'deflorenne.amaury@triptyk.eu',
    password: '123456789',
  });

  onSubmit = async (changeset: typeof this.changeset) => {
    await this.session.authenticate('authenticator:jwt', {
      email: changeset.get('email'),
      password: changeset.get('password'),
    })
  }

  <template>
    <div class="login-form-container" data-test-login-form>
      <h2>Login</h2>
      <TpkForm
        @changeset={{this.changeset}}
        @onSubmit={{this.onSubmit}}
        @reactive={{true}}
        @validationSchema={{LoginValidationSchema}}
      as |F|>
        <F.TpkEmailPrefab @label="Email" @validationField="email" />
        <F.TpkPasswordPrefab @label="Password" @validationField="password" />
        <button type="submit">Login</button>
      </TpkForm>
    </div>
  </template>
}

export const pageObject = create({
  scope: '[data-test-login-form]',
  email: fillable('[data-test-tpk-prefab-email-container="email"] input'),
  password: fillable('[data-test-tpk-prefab-password-container="password"] input'),
  submit: clickable('button[type="submit"]'),
});

