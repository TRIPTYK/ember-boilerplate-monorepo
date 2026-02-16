import type Owner from '@ember/owner';
import { buildRegistry } from 'ember-strict-application-resolver/build-registry';
import type { DSL } from '@ember/routing/lib/dsl';

export function moduleRegistry() {
  return buildRegistry({
    ...import.meta.glob('./routes/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./templates/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./helpers/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./components/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./services/**/*.{js,ts}', { eager: true }),
  })();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function initialize(_owner: Owner) {}

export function forRouter(this: DSL) {}

export function authRoutes(this: DSL) {}
