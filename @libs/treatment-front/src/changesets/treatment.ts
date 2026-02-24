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
  subjectCategoryPrecisions?: {
    name?: string;
    additionalInformation?: string;
  }[];
  personalDataGroup?: {
    data: { name: Array<{ name: string; isSensitive: boolean }> };
    conservationDuration?: string;
  };
  financialDataGroup?: {
    data: { name: Array<{ name: string; isSensitive: boolean }> };
    conservationDuration?: string;
  };
  dataSources?: Array<{ name: string; additionalInformation?: string }>;
  dataAccess?: Array<{ name: string; additionalInformation?: string }>;
  sharedData?: Array<{ name: string; additionalInformation?: string }>;
  retentionPeriod?: string;
  hasAccessByThirdParty?: boolean;
  thirdPartyAccess?: string[];
  areDataExportedOutsideEU?: boolean;
  recipient?: {
    fullName?: string;
    country?: string;
    guaranteeTypes?: string;
    linkToDoc?: string;
  };
  securityMeasures?: string[];
  securitySetup?: Array<{ name: string; additionalInformation?: string }>;
}

export class TreatmentChangeset extends ImmerChangeset<DraftTreatment> {}
