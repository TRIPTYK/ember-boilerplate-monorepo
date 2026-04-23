import type { TOC } from '@ember/component/template-only';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CurrentUserService from '@libs/users-front/services/current-user';
import TpkDashBoard, {
  type SidebarItem,
  type Language,
} from '@triptyk/ember-ui/components/prefabs/tpk-dashboard';
import TpkThemeSelector from '@triptyk/ember-ui/components/prefabs/tpk-theme-selector';
import type SessionService from 'ember-simple-auth/services/session';
import type { IntlService } from 'ember-intl';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DashboardTemplate extends Component {
  @service declare currentUser: CurrentUserService;
  @service declare session: SessionService;
  @service declare intl: IntlService;

  @tracked sidebarCollapsed = true;
  themes = ['nord', 'dracula', 'pastel', 'sunset', 'corporate', 'business'];

  languages: Language[] = [
    { code: 'fr-fr', label: 'Français' },
    { code: 'en-us', label: 'Anglais' },
  ];

  @action
  handleLocaleChange(locale: string) {
    this.intl.setLocale([locale]);
  }

  @action
  handleCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  @action
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  get menuItems(): SidebarItem[] {
    return [
      {
        type: 'link',
        label: this.intl.t('dashboard.sidebar.dashboard'),
        route: 'dashboard',
        icon: <template>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block size-4 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </template> as TOC<{ Element: SVGSVGElement }>,
      },
      {
        type: 'link',
        label: this.intl.t('dashboard.sidebar.treatments'),
        route: 'dashboard.treatments',
        icon: <template>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="inline-block size-4 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
        </template> as TOC<{ Element: SVGSVGElement }>,
      },
      {
        type: 'link',
        label: this.intl.t('dashboard.sidebar.settings'),
        route: 'dashboard.settings',
        icon: <template>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="inline-block size-4 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </template> as TOC<{ Element: SVGSVGElement }>,
      },
    ];
  }

  get userForNav() {
    return {
      fullName:
        this.currentUser.currentUser.firstName +
        ' ' +
        this.currentUser.currentUser.lastName,
    };
  }

  logout = async () => {
    await this.session.invalidate();
  };

  <template>
    <TpkDashBoard
      @currentUser={{this.userForNav}}
      @onLogout={{this.logout}}
      @sidebarItems={{this.menuItems}}
      @languages={{this.languages}}
      @onLocaleChange={{this.handleLocaleChange}}
      @collapsed={{this.sidebarCollapsed}}
      @onCollapsedChange={{this.handleCollapsedChange}}
      @onSidebarToggle={{this.toggleSidebar}}
    >
      <:header>
        <div class="flex flex-col items-center justify-center p-2">
          <img
            src="/assets/icons/icon-registr.svg"
            alt="Boilerplate"
            class="w-24 object-contain"
          />
        </div>
      </:header>
      <:content>
        <div class="p-6">
          {{outlet}}
        </div>
      </:content>
      <:footer>
        <div
          class="flex items-center justify-between w-full p-2 px-4 gap-3
            {{if this.sidebarCollapsed 'flex-col'}}"
        >
          <TpkThemeSelector
            @sidebarCollapsed={{this.sidebarCollapsed}}
            @themes={{this.themes}}
          />
        </div>
      </:footer>
    </TpkDashBoard>
  </template>
}
