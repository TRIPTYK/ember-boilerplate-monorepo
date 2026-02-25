import { assert } from '@ember/debug';
import Service, { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import { findRecord, updateRecord } from '@warp-drive/utilities/json-api';
import type {
  Setting,
  SettingKey,
  SettingValue,
  SettingWithKey,
} from '#src/schemas/settings.ts';

export default class SettingService extends Service {
  @service declare store: Store;

  /**
   * Load a single setting by key from the API (or cache if already loaded).
   */
  public async load<K extends SettingKey>(key: K): Promise<SettingWithKey<K>> {
    const response = await this.store.request(
      findRecord<Setting>('settings', key, { include: [] })
    );
    return response.content.data as SettingWithKey<K>;
  }

  /**
   * Load all settings from the API.
   */
  public async loadAll(): Promise<SettingWithKey[]> {
    const response = await this.store.request<{ data: Setting[] }>({
      url: '/api/v1/settings',
      method: 'GET',
      op: 'query',
    });
    return response.content.data as SettingWithKey[];
  }

  /**
   * Read a cached setting without making a network request.
   * Returns null if the setting has not been loaded yet.
   */
  public peek<K extends SettingKey>(key: K): SettingWithKey<K> | null {
    return this.store.peekRecord<Setting>({
      id: key,
      type: 'settings',
    }) as SettingWithKey<K> | null;
  }

  /**
   * Update (PATCH) a setting value.
   * The setting must already be in the store — call load(key) first.
   */
  public async update<K extends SettingKey>(
    key: K,
    value: SettingValue<K>
  ): Promise<void> {
    const existing = this.store.peekRecord<Setting>({
      id: key,
      type: 'settings',
    });
    assert(`Setting '${key}' must be loaded before updating`, existing);

    Object.assign(existing, { value });

    const request = updateRecord(existing, { patch: true });
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existing)),
    });

    await this.store.request(request);
  }
}
