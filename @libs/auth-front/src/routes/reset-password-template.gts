import ResetPasswordForm from '#src/components/forms/reset-password-form.gts';
import type { TOC } from '@ember/component/template-only';
import type { ResetPasswordRouteSignature } from './reset-password.gts';

export default <template>
  <ResetPasswordForm @token={{@model.token}} />
</template> as TOC<ResetPasswordRouteSignature>
