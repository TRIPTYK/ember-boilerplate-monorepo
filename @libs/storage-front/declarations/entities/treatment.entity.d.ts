export type TreatmentStatus = "draft" | "validated" | "archived";
export interface Treatment {
  id: string;
  title: string;
  description: string | null;
  status: TreatmentStatus;
  createdAt: string;
  updatedAt: string;
}
export declare const TreatmentEntity: import("#src/entities/define-entity.ts").EntityDefinition<Treatment>;
//# sourceMappingURL=treatment.entity.d.ts.map
