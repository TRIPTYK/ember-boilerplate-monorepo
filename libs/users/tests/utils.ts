import { assert } from '@ember/debug';
import type Owner from '@ember/owner';
import { getOwnConfig } from '@embroider/macros';
import { vi } from 'vitest';

export function ifTesting<T>(something: () => T) {
  let pageObject : T | undefined = undefined;

  const config = getOwnConfig() as Record<string, unknown>;
  if (config.isTesting) {
    return pageObject = something();
  }

  assert("Expected page object to be defined in testing environment", pageObject);
  // force return type
  return pageObject as T;
}

export function stubRouter(owner: Owner, value?: unknown) {
    const router = owner.lookup('service:router');
    router.transitionTo = vi.fn().mockResolvedValue(value);
    return router;
}
