import Service from '@ember/service';
import type { SettingItem, SettingKey } from '#src/schemas/settings.ts';

type ApiItem = {
  id: string;
  attributes: { key: SettingKey; name: string };
};

const toSettingItem = ({ id, attributes }: ApiItem): SettingItem => ({
  id,
  key: attributes.key,
  name: attributes.name,
});

export default class SettingService extends Service {
  async findAll(): Promise<SettingItem[]> {
    const res = await fetch('/api/v1/settings');
    const json = (await res.json()) as { data: ApiItem[] };
    return json.data.map(toSettingItem);
  }

  async findByKey(key: SettingKey): Promise<SettingItem[]> {
    const res = await fetch(`/api/v1/settings?filter[key]=${key}`);
    const json = (await res.json()) as { data: ApiItem[] };
    return json.data.map(toSettingItem);
  }

  async create(key: SettingKey, name: string): Promise<SettingItem> {
    const res = await fetch('/api/v1/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { type: 'settings', attributes: { key, name } },
      }),
    });
    const json = (await res.json()) as { data: ApiItem };
    return toSettingItem(json.data);
  }

  async update(id: string, name: string): Promise<void> {
    await fetch(`/api/v1/settings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { type: 'settings', id, attributes: { name } },
      }),
    });
  }

  async delete(id: string): Promise<void> {
    await fetch(`/api/v1/settings/${id}`, { method: 'DELETE' });
  }
}
