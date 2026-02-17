import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const TodoEntity = defineEntity({
  name: "Todo",
  properties: {
    id: p.string().primary(),
    title: p.string(),
    description: p.string().nullable(),
    completed: p.boolean().default(false),
    userId: p.string(),
    createdAt: p.string().onCreate(() => new Date().toISOString()),
    updatedAt: p.string().onCreate(() => new Date().toISOString()),
  },
});

export type TodoEntityType = InferEntity<typeof TodoEntity>;
