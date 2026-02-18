import ImmerChangeset from 'ember-immer-changeset';

export interface DraftTreatment {
  id?: string | null;
  title?: string;
  description?: string;
  treatmentType?: string;
  responsible?: {
    fullName?: string;
    entityNumber?: string;
    address?: {
      streetAndNumber?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      phone?: string;
      email?: string;
    };
  };
  hasDPO?: boolean;
  DPO?: {
    fullName?: string;
    address?: {
      streetAndNumber?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      phone?: string;
      email?: string;
    };
  };
  hasExternalDPO?: boolean;
  externalOrganizationDPO?: {
    fullName?: string;
    entityNumber?: string;
    address?: {
      streetAndNumber?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      phone?: string;
      email?: string;
    };
  };
  reasons?: string[];
  subReasons?: { name?: string; additionalInformation?: string }[];
  legalBase?: { name?: string; additionalInformation?: string }[];
  dataSubjectCategories?: string[];
  personalData?: { name?: string; additionalInformation?: string }[];
  financialData?: { name?: string; additionalInformation?: string }[];
  dataSource?: string[];
  retentionPeriod?: string;
  hasAccessByThirdParty?: boolean;
  thirdPartyAccess?: string[];
  areDataExportedOutsideEU?: boolean;
  recipient?: {
    name?: string;
    entityNumber?: string;
    address?: {
      streetAndNumber?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      phone?: string;
      email?: string;
    };
  };
  securityMeasures?: string[];
}

export class treatmentChangeset extends ImmerChangeset<DraftTreatment> {}
