import type { Database } from "#src/core/database.ts";
import type {
  Treatment,
  TreatmentStatus,
} from "#src/entities/treatment.entity.ts";
import { BaseRepository } from "#src/repositories/base-repository.ts";
export declare class TreatmentRepository extends BaseRepository<Treatment> {
  constructor(db: Database);
  findByStatus(status: TreatmentStatus): Promise<Treatment[]>;
  search(query: string): Promise<Treatment[]>;
}
//# sourceMappingURL=treatment-repository.d.ts.map
