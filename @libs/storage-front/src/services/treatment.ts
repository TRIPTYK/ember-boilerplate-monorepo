import Service, { service } from "@ember/service";
import type {
  Treatment,
  TreatmentStatus,
} from "#src/entities/treatment.entity.ts";
import type StorageService from "#src/services/storage.ts";

export type CreateTreatmentData = {
  title: string;
  description?: string | null;
  status?: TreatmentStatus;
};

export type UpdateTreatmentData = {
  id: string;
  title?: string;
  description?: string | null;
  status?: TreatmentStatus;
};

export default class TreatmentService extends Service {
  @service declare storage: StorageService;

  async save(
    data: CreateTreatmentData | UpdateTreatmentData,
  ): Promise<Treatment | undefined> {
    if ("id" in data && data.id) {
      return this.update(data);
    }
    return this.create(data as CreateTreatmentData);
  }

  async create(data: CreateTreatmentData): Promise<Treatment> {
    return this.storage.treatmentRepository.create({
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? "draft",
    });
  }

  async update(data: UpdateTreatmentData): Promise<Treatment | undefined> {
    const { id, ...fields } = data;
    return this.storage.treatmentRepository.update(id, fields);
  }

  async delete(id: string): Promise<boolean> {
    return this.storage.treatmentRepository.delete(id);
  }

  async findAll(): Promise<Treatment[]> {
    return this.storage.treatmentRepository.findAll();
  }

  async findById(id: string): Promise<Treatment | undefined> {
    return this.storage.treatmentRepository.findById(id);
  }

  async findByStatus(status: TreatmentStatus): Promise<Treatment[]> {
    return this.storage.treatmentRepository.findByStatus(status);
  }

  async search(query: string): Promise<Treatment[]> {
    return this.storage.treatmentRepository.search(query);
  }
}
