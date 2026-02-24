import { t } from 'ember-intl';
import TpkButtonComponent from '@triptyk/ember-input/components/tpk-button';
import type { TOC } from '@ember/component/template-only';

interface SuccessScreenSignature {
  Args: {
    onCreateNewFlow: () => void;
    onFinish: () => void;
  };
}

const SuccessScreen: TOC<SuccessScreenSignature> = <template>
    <div
      class="relative min-h-[80vh] flex flex-col items-center justify-center p-8"
    >

      <div class="relative z-10 w-full max-w-[800px] mx-auto text-center">
        <h1
          class="text-xl sm:text-2xl lg:text-[2.125rem] font-bold uppercase mb-16"
          aria-live="polite"
        >
          {{t "treatments.successScreen.title"}}
        </h1>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <TpkButtonComponent
            @label={{t "treatments.successScreen.createNewFlow"}}
            @onClick={{@onCreateNewFlow}}
            class="btn btn-outline btn-primary"
          >
            {{t "treatments.successScreen.createNewFlow"}}
          </TpkButtonComponent>
          <TpkButtonComponent
            @label={{t "treatments.successScreen.finishFlowCreation"}}
            @onClick={{@onFinish}}
            class="btn btn-primary"
          >
            {{t "treatments.successScreen.finishFlowCreation"}}
          </TpkButtonComponent>
        </div>
      </div>
    </div>
  </template>;

export default SuccessScreen;
