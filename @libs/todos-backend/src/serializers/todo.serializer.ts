import type { TodoEntityType } from "#src/entities/todo.entity.js";
import { boolean, object, string } from "zod";
import { z } from "zod";
import { makeJsonApiDocumentSchema } from "@libs/backend-shared";

export const SerializedTodoSchema = makeJsonApiDocumentSchema(
  "todos",
  object({
    title: string(),
    description: string().nullable(),
    completed: boolean(),
    createdAt: string(),
    updatedAt: string(),
  }),
);

export function jsonApiSerializeTodo(todo: TodoEntityType): z.infer<typeof SerializedTodoSchema> {
  return {
    id: todo.id,
    type: "todos" as const,
    attributes: {
      title: todo.title,
      description: todo.description ?? null,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    },
  };
}

export function jsonApiSerializeManyTodos(todos: TodoEntityType[]) {
  return todos.map(jsonApiSerializeTodo);
}

export function jsonApiSerializeSingleTodoDocument(todo: TodoEntityType) {
  return {
    data: jsonApiSerializeTodo(todo),
  };
}

export function jsonApiSerializeManyTodosDocument(todos: TodoEntityType[]) {
  return {
    data: jsonApiSerializeManyTodos(todos),
  };
}
