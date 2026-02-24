import {
  withDefaults,
  type WithLegacy,
} from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const treatmentSchema = withDefaults({
  type: 'treatments',
  fields: [
    { name: 'creationDate', kind: 'attribute' },
    { name: 'updateDate', kind: 'attribute' },
    { name: 'dueDateForUpdate', kind: 'attribute' },
    { name: 'status', kind: 'attribute' },
    { name: 'order', kind: 'attribute' },
    { name: 'isOverDueDate', kind: 'attribute' },
    { name: 'data', kind: 'attribute' },
  ],
});

export default treatmentSchema;

export type TreatmentStatus = 'draft' | 'validated' | 'archived';

export interface TreatmentData {
  title?: string;
  description?: string;
  treatmentType?: string;
  reasons?: string[];
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
  subReasons?: Array<{ name?: string; additionalInformation?: string }>;
  legalBase?: Array<{ name?: string; additionalInformation?: string }>;
  dataSubjectCategories?: string[];
  subjectCategoryPrecisions?: Array<{
    name?: string;
    additionalInformation?: string;
  }>;
  personalDataGroup?: {
    data: {
      name: Array<{ name: string; isSensitive: boolean }>;
    };
    conservationDuration?: string;
  };
  financialDataGroup?: {
    data: {
      name: Array<{ name: string; isSensitive: boolean }>;
    };
    conservationDuration?: string;
  };
  dataSources?: Array<{ name: string; additionalInformation?: string }>;
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

export type Treatment = WithLegacy<{
  creationDate: string;
  updateDate?: string;
  dueDateForUpdate?: string;
  status: TreatmentStatus;
  order?: number;
  isOverDueDate?: boolean;
  data: TreatmentData;
  [Type]: 'treatments';
}>;

export type TreatmentWithId = Treatment & { id: string };
