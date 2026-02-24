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
