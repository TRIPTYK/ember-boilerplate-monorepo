import ImmerChangeset from 'ember-immer-changeset';

export interface DraftUser {
  id?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export class UserChangeset extends ImmerChangeset<DraftUser> {}
