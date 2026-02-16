import ImmerChangeset from 'ember-immer-changeset';

export interface DraftUser {
  id?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string | null;
}

export class UserChangeset extends ImmerChangeset<DraftUser> {}
