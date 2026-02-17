import type { Treatment } from '#src/schemas/treatments.ts';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
import { findRecord } from '@warp-drive/utilities/json-api';

export type treatmentsEditRouteSignature = {
  model: Awaited<ReturnType<treatmentsEditRoute['model']>>;
  controller: undefined;
};

export default class treatmentsEditRoute extends Route {
  @service declare store: Store;

  async model({ treatment_id }: { treatment_id: string }) {
    const treatment = await this.store.request(
      findRecord<Treatment>('treatments', treatment_id, {
        include: [],
      })
    );

    assert('treatment must not be null', treatment.content.data !== null);
    const data = treatment.content.data;

    return {
      treatment: data,
    };
  }
}
