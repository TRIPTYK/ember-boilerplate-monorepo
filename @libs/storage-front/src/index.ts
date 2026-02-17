import { assert } from "@ember/debug";
import type Owner from "@ember/owner";
import type { DSL } from "@ember/routing/lib/dsl";
import { buildRegistry } from "ember-strict-application-resolver/build-registry";
import type StorageService from "#src/services/storage.ts";

export function moduleRegistry() {
  return buildRegistry({
    ...import.meta.glob("./services/**/*.{js,ts}", { eager: true }),
  })();
}

export async function initialize(owner: Owner) {
  const storageService = owner.lookup("service:storage") as
    | StorageService
    | undefined;
  assert("Storage service must be available", storageService);
  await storageService.initialize();
}

export function forRouter(this: DSL) {}
