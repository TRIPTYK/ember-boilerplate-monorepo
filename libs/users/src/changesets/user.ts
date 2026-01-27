export class UserChangeset {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
}

export interface DraftUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}
