import {
  withDefaults,
  type WithLegacy,
} from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const settingSchema = withDefaults({
  type: 'settings',
  fields: [{ name: 'value', kind: 'attribute' }],
});

export default settingSchema;

export interface CustomPersonalData {
  name: string;
  isSensitive: boolean;
}

export type SettingKey =
  | 'DPO'
  | 'customCategories'
  | 'customDataAccess'
  | 'customDataSources'
  | 'customEconomicInformation'
  | 'customLegalBase'
  | 'customMeasures'
  | 'customPersonalData'
  | 'customReasons'
  | 'customSharedData'
  | 'customSharedDataAccess'
  | 'customTreatmentTypes';

export type SettingValueMap = {
  DPO: {
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
  customCategories: string[];
  customDataAccess: string[];
  customDataSources: string[];
  customEconomicInformation: CustomPersonalData[];
  customLegalBase: string[];
  customMeasures: string[];
  customPersonalData: CustomPersonalData[];
  customReasons: string[];
  customSharedData: string[];
  customSharedDataAccess: string[];
  customTreatmentTypes: string[];
};

export type SettingValue<K extends SettingKey> = SettingValueMap[K];

export type Setting = WithLegacy<{
  value: unknown;
  [Type]: 'settings';
}>;

export type SettingWithKey<K extends SettingKey = SettingKey> = Setting & {
  id: K;
};
