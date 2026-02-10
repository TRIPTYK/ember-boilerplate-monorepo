import type Owner from '@ember/owner';
import { vi } from 'vitest';

export function stubRouter(owner: Owner, value?: unknown) {
  const router = owner.lookup('service:router');
  router.transitionTo = vi.fn().mockResolvedValue(value);
  return router;
}
