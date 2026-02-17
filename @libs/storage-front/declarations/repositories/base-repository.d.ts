import type { Database } from "#src/core/database.ts";
import type { EntityDefinition } from "#src/entities/define-entity.ts";
export declare class BaseRepository<T extends {}> {
  protected db: Database;
  protected entity: EntityDefinition<T>;
  constructor(db: Database, entity: EntityDefinition<T>);
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | undefined>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
  ): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
//# sourceMappingURL=base-repository.d.ts.map
