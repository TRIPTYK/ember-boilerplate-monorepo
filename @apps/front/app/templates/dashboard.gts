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
        label: this.intl.t('dashboard.sidebar.users'),
        route: 'dashboard.users',
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </template> as TOC<{ Element: SVGSVGElement }>,
      },
      {
        type: 'link',
        label: this.intl.t('dashboard.sidebar.todos'),
        route: 'dashboard.todos',
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
            src="/assets/img/boilerplate_logo.png"
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
          <FooterComponent @collapsed={{this.sidebarCollapsed}} />
          <TpkThemeSelector @sidebarCollapsed={{this.sidebarCollapsed}} />
        </div>
      </:footer>
    </TpkDashBoard>
  </template>
}

const FooterComponent = <template>
  <div class="flex items-center gap-3 {{if @collapsed 'flex-col'}}">
    <a
      href="https://github.com/triptyk/ember-common-ui"
      target="_blank"
      rel="noopener noreferrer"
      class="tooltip"
      data-tip="GitHub"
    >
      <svg
        class="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
        />
      </svg>
    </a>
    <a
      href="https://triptyk.eu"
      target="_blank"
      rel="noopener noreferrer"
      class="tooltip"
      data-tip="Our website"
    >
      <svg
        class="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path
          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        />
      </svg>
    </a>
    <a
      href="https://facebook.com/triptykdigital"
      target="_blank"
      rel="noopener noreferrer"
      class="tooltip"
      data-tip="Facebook"
    >
      <svg
        class="size-5"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <path
          d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
        />
      </svg>
    </a>
  </div>
</template> satisfies TOC<{ collapsed: boolean }>;
