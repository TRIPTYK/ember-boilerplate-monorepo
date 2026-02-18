import type { Treatment } from '#src/schemas/treatments.ts';
import {
  type UpdatedTreatment,
  type ValidatedTreatment,
  type DraftTreatmentData,
} from '#src/components/forms/treatment-validation.ts';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import {
  createRecord,
  deleteRecord,
  updateRecord,
} from '@warp-drive/utilities/json-api';
import type ImmerChangeset from 'ember-immer-changeset';

type TreatmentWithId = DraftTreatmentData & { id: string };

export default class treatmentService extends Service {
  @service declare store: Store;

  public async save(data: DraftTreatmentData & { id?: string | null }) {
    if (data.id) {
      return this.update(data as TreatmentWithId);
    } else {
      return this.create(data);
    }
  }

  public async create(data: DraftTreatmentData) {
    const treatmentData = {
      title: data.title ?? '',
      description: data.description,
      treatmentType: data.treatmentType,
      responsible: data.responsible,
      hasDPO: data.hasDPO,
      DPO: data.DPO,
      hasExternalDPO: data.hasExternalDPO,
      externalOrganizationDPO: data.externalOrganizationDPO,
      reasons: data.reasons,
      subReasons: data.subReasons,
      legalBase: data.legalBase,
      dataSubjectCategories: data.dataSubjectCategories,
      personalData: data.personalData,
      financialData: data.financialData,
      dataSource: data.dataSource,
      retentionPeriod: data.retentionPeriod,
      hasAccessByThirdParty: data.hasAccessByThirdParty,
      thirdPartyAccess: data.thirdPartyAccess,
      areDataExportedOutsideEU: data.areDataExportedOutsideEU,
      recipient: data.recipient,
      securityMeasures: data.securityMeasures,
    };

    const treatment = this.store.createRecord<Treatment>('treatments', {
      data: treatmentData,
      status: 'draft',
      creationDate: new Date().toISOString(),
    });
    const request = createRecord(treatment);

    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(treatment)),
    });

    await this.store.request(request);
  }

  public async update(
    data: TreatmentWithId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changeset?: ImmerChangeset<ValidatedTreatment>
  ) {
    const existingTreatment = this.store.peekRecord<Treatment>({
      id: data.id,
      type: 'treatments',
    });
    assert('Treatment must exist to be updated', existingTreatment);

    const treatmentData = {
      title: data.title ?? '',
      description: data.description,
      treatmentType: data.treatmentType,
      responsible: data.responsible,
      hasDPO: data.hasDPO,
      DPO: data.DPO,
      hasExternalDPO: data.hasExternalDPO,
      externalOrganizationDPO: data.externalOrganizationDPO,
      reasons: data.reasons,
      subReasons: data.subReasons,
      legalBase: data.legalBase,
      dataSubjectCategories: data.dataSubjectCategories,
      personalData: data.personalData,
      financialData: data.financialData,
      dataSource: data.dataSource,
      retentionPeriod: data.retentionPeriod,
      hasAccessByThirdParty: data.hasAccessByThirdParty,
      thirdPartyAccess: data.thirdPartyAccess,
      areDataExportedOutsideEU: data.areDataExportedOutsideEU,
      recipient: data.recipient,
      securityMeasures: data.securityMeasures,
    };

    Object.assign(existingTreatment, {
      data: treatmentData,
    });

    const request = updateRecord(existingTreatment, { patch: true });
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existingTreatment)),
    });

    await this.store.request(request);
  }

  public async delete(data: TreatmentWithId) {
    const existingTreatment = this.store.peekRecord<Treatment>({
      id: data.id,
      type: 'treatments',
    });
    assert('Treatment must exist to be deleted', existingTreatment);
    const request = deleteRecord(existingTreatment);
    request.body = JSON.stringify({});
    return this.store.request(request);
  }
}
