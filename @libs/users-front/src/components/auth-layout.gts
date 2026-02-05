import type { TOC } from '@ember/component/template-only';

interface AuthLayoutSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default <template>
  <div class="auth-layout" ...attributes>
    <img src="/assets/img/boilerplate_logo.png" alt="boilerplate" class="w-32" />
    <div class="auth-layout-content">
      {{yield}}
    </div>
  </div>
</template> as TOC<AuthLayoutSignature>;
