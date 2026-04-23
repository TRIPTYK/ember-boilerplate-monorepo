import { withDefaults } from '@warp-drive/legacy/model/migration-support';

// Schéma WarpDrive — utilisé par SettingTable (TableGenericTableComponent)
const settingSchema = withDefaults({
  type: 'settings',
  fields: [
    { name: 'key', kind: 'attribute' },
    { name: 'name', kind: 'attribute' },
  ],
});

export default settingSchema;

export type SettingKey =
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

// Alias conservé pour compatibilité avec les composants existants
export type SettingItemKey = SettingKey;

export type SettingItem = {
  id: string;
  key: SettingKey;
  name: string;
};
