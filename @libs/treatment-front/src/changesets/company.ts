import ImmerChangeset from 'ember-immer-changeset';

export interface DraftAddress {
  streetAndNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface DraftCompany {
  hasExternalDPO?: boolean;
  hasDPO?: boolean;
  responsible?: {
    fullName?: string;
    entityNumber?: string;
    address?: DraftAddress;
  };
  DPO?: {
    fullName?: string;
    address?: DraftAddress;
  };
  externalOrganizationDPO?: {
    fullName?: string;
    entityNumber?: string;
    address?: DraftAddress;
  };
}

export class CompanyChangeset extends ImmerChangeset<DraftCompany> {}
