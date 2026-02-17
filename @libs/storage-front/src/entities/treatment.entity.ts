import { defineEntity, column } from "#src/entities/define-entity.ts";

export type TreatmentStatus = "draft" | "validated" | "archived";

export interface Treatment {
  id: string;
  title: string;
  description: string | null;
  status: TreatmentStatus;
  createdAt: string;
  updatedAt: string;
}

export const TreatmentEntity = defineEntity<Treatment>({
  tableName: "treatments",
  columns: {
    id: column.text().primary(),
    title: column.text(),
    description: column.text().nullable(),
    status: column.text().default("draft"),
    createdAt: column.timestamp(),
    updatedAt: column.timestamp(),
  },
});
