import Service from "@ember/service";
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
  storage: StorageService;
  save(
    data: CreateTreatmentData | UpdateTreatmentData,
  ): Promise<Treatment | undefined>;
  create(data: CreateTreatmentData): Promise<Treatment>;
  update(data: UpdateTreatmentData): Promise<Treatment | undefined>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Treatment[]>;
  findById(id: string): Promise<Treatment | undefined>;
  findByStatus(status: TreatmentStatus): Promise<Treatment[]>;
  search(query: string): Promise<Treatment[]>;
}
//# sourceMappingURL=treatment.d.ts.map
