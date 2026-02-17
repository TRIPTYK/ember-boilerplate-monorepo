import ImmerChangeset from 'ember-immer-changeset';

export interface DraftTreatment {
  id?: string | null;
  title?: string;
  description?: string;
}

export class treatmentChangeset extends ImmerChangeset<DraftTreatment> {}
