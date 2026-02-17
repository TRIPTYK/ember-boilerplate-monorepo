import type { Treatment } from '#src/schemas/treatments.ts';
import {
  type UpdatedTreatment,
  type ValidatedTreatment,
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

export default class treatmentService extends Service {
  @service declare store: Store;

  public async save(data: ValidatedTreatment | UpdatedTreatment) {
    if (data.id) {
      return this.update(data as UpdatedTreatment);
    } else {
      return this.create(data as ValidatedTreatment);
    }
  }

  public async create(data: ValidatedTreatment) {
    const treatment = this.store.createRecord<Treatment>('treatments', data);
    const request = createRecord(treatment);

    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(treatment)),
    });

    await this.store.request(request);
  }

  public async update(
    data: UpdatedTreatment,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changeset?: ImmerChangeset<ValidatedTreatment>
  ) {
    const existingTreatment = this.store.peekRecord<Treatment>({
      id: data.id,
      type: 'treatments',
    });
    assert('Treatment must exist to be updated', existingTreatment);

    Object.assign(existingTreatment, {
      title: data.title,
      description: data.description,
    });

    const request = updateRecord(existingTreatment, { patch: true });
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existingTreatment)),
    });

    await this.store.request(request);
  }

  public async delete(data: UpdatedTreatment) {
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
