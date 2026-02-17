import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { DatabaseWorkerClient } from "#src/core/database-worker-client.ts";
import { TreatmentEntity } from "#src/entities/treatment.entity.ts";
import { TreatmentRepository } from "#src/repositories/treatment-repository.ts";

const DB_NAME = "registr-opfs";

export default class StorageService extends Service {
  @tracked isReady = false;
  @tracked error: Error | null = null;

  private database = new DatabaseWorkerClient();
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
      await this.#seedIfEmpty();
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

  async #seedIfEmpty(): Promise<void> {
    const count = await this._treatmentRepository!.count();
    if (count > 0) return;

    const examples = [
      {
        title: "Consultation initiale",
        description: "Premier rendez-vous de découverte",
        status: "validated" as const,
      },
      {
        title: "Traitement orthodontique",
        description: "Suivi des appareillages dentaires",
        status: "validated" as const,
      },
      {
        title: "Prophylaxie",
        description: "Détartrage et prévention",
        status: "draft" as const,
      },
      {
        title: "Caries à traiter",
        description: null,
        status: "draft" as const,
      },
      {
        title: "Traitement 2023",
        description: "Archive des traitements de l'année",
        status: "archived" as const,
      },
    ];

    for (const ex of examples) {
      await this._treatmentRepository!.create(ex);
    }
  }

  willDestroy(): void {
    void this.database.close();
    super.willDestroy();
  }
}
