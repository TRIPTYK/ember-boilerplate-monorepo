import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
import { findRecord } from '@warp-drive/utilities/json-api';
import { assert } from '@ember/debug';
import type { TreatmentWithId } from '#src/schemas/treatments.ts';

export type TreatmentsViewRouteSignature = {
  model: Awaited<ReturnType<TreatmentsViewRoute['model']>>;
  controller: undefined;
};

export default class TreatmentsViewRoute extends Route {
  @service declare store: Store;

  async model({ treatment_id }: { treatment_id: string }) {
    const response = await this.store.request(
      findRecord<TreatmentWithId>('treatments', treatment_id, { include: [] })
    );
    assert('Treatment must not be null', response.content.data !== null);
    return { treatment: response.content.data };
  }
}
