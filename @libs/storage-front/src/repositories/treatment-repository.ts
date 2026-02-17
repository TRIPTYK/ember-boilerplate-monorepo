import type { Database } from "#src/core/database.ts";
import type {
  Treatment,
  TreatmentStatus,
} from "#src/entities/treatment.entity.ts";
import { TreatmentEntity } from "#src/entities/treatment.entity.ts";
import { BaseRepository } from "#src/repositories/base-repository.ts";

export class TreatmentRepository extends BaseRepository<Treatment> {
  constructor(db: Database) {
    super(db, TreatmentEntity);
  }

  async findByStatus(status: TreatmentStatus): Promise<Treatment[]> {
    return this.db.query<Treatment>(
      `SELECT * FROM ${this.entity.tableName} WHERE status = ?`,
      [status],
    );
  }

  async search(query: string): Promise<Treatment[]> {
    const pattern = `%${query}%`;
    return this.db.query<Treatment>(
      `SELECT * FROM ${this.entity.tableName} WHERE title LIKE ? OR description LIKE ?`,
      [pattern, pattern],
    );
  }
}
