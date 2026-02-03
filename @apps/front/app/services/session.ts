import { service } from '@ember/service';
import type CurrentUserService from '@libs/users/services/current-user';
import SessionService from 'ember-simple-auth/services/session';

export default class MySession extends SessionService {
    @service declare currentUser: CurrentUserService;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async handleAuthentication(routeAfterAuthentication: string): Promise<void> {
        await this.currentUser.load();
        return super.handleAuthentication(routeAfterAuthentication);
    }
}
