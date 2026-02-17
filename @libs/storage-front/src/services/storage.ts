import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { Database } from "#src/core/database.ts";
import { TreatmentEntity } from "#src/entities/treatment.entity.ts";
import { TreatmentRepository } from "#src/repositories/treatment-repository.ts";

const DB_NAME = "registr-idb-vfs";

export default class StorageService extends Service {
  @tracked isReady = false;
  @tracked error: Error | null = null;

  private database = new Database();
  private _treatmentRepository: TreatmentRepository | null = null;

  get treatmentRepository(): TreatmentRepository {
    if (!this._treatmentRepository) {
      throw new Error("Storage is not initialized. Call initialize() first.");
    }
    return this._treatmentRepository;
  }

  async initialize(): Promise<void> {
    try {
      await this.database.initialize(DB_NAME);
      await this.database.createTable(TreatmentEntity);

      this._treatmentRepository = new TreatmentRepository(this.database);
      this.isReady = true;
    } catch (e) {
      this.error = e instanceof Error ? e : new Error(String(e));
      throw this.error;
    }
  }

  async reset(): Promise<void> {
    await this.database.exec("DROP TABLE IF EXISTS treatments");
    await this.database.createTable(TreatmentEntity);
  }

  willDestroy(): void {
    void this.database.close();
    super.willDestroy();
  }
}
