import Service from "@ember/service";
import { TreatmentRepository } from "#src/repositories/treatment-repository.ts";
export default class StorageService extends Service {
    #private;
    isReady: boolean;
    error: Error | null;
    private database;
    private _treatmentRepository;
    get treatmentRepository(): TreatmentRepository;
    initialize(): Promise<void>;
    reset(): Promise<void>;
    willDestroy(): void;
}
//# sourceMappingURL=storage.d.ts.map