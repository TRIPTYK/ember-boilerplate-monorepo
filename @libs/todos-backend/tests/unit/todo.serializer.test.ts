import { describe, it, expect } from "vitest";
import {
  jsonApiSerializeTodo,
  jsonApiSerializeManyTodos,
  jsonApiSerializeSingleTodoDocument,
  jsonApiSerializeManyTodosDocument,
} from "#src/serializers/todo.serializer.js";
import type { TodoEntityType } from "#src/entities/todo.entity.js";

describe("todo.serializer", () => {
  const mockTodo: TodoEntityType = {
    id: "todo-1",
    title: "Test Todo",
    description: "A test description",
    completed: false,
    userId: "user-1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  const mockTodos: TodoEntityType[] = [
    mockTodo,
    {
      id: "todo-2",
      title: "Another Todo",
      description: null,
      completed: true,
      userId: "user-1",
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
  ];

  describe("jsonApiSerializeTodo", () => {
    it("should serialize a todo to JSON:API format", () => {
      const result = jsonApiSerializeTodo(mockTodo);

      expect(result).toEqual({
        id: "todo-1",
        type: "todos",
        attributes: {
          title: "Test Todo",
          description: "A test description",
          completed: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      });
    });

    it("should not include userId in serialized output", () => {
      const result = jsonApiSerializeTodo(mockTodo);

      expect(result).not.toHaveProperty("userId");
      expect(result.attributes).not.toHaveProperty("userId");
    });

    it("should handle null description", () => {
      const todoWithNullDesc: TodoEntityType = { ...mockTodo, description: null };
      const result = jsonApiSerializeTodo(todoWithNullDesc);

      expect(result.attributes.description).toBeNull();
    });
  });

  describe("jsonApiSerializeManyTodos", () => {
    it("should serialize multiple todos to JSON:API format", () => {
      const result = jsonApiSerializeManyTodos(mockTodos);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: "todo-1",
        type: "todos",
      });
      expect(result[1]).toMatchObject({
        id: "todo-2",
        type: "todos",
      });
    });

    it("should return empty array for empty input", () => {
      const result = jsonApiSerializeManyTodos([]);

      expect(result).toEqual([]);
    });
  });

  describe("jsonApiSerializeSingleTodoDocument", () => {
    it("should wrap serialized todo in data property", () => {
      const result = jsonApiSerializeSingleTodoDocument(mockTodo);

      expect(result).toHaveProperty("data");
      expect(result.data).toMatchObject({
        id: "todo-1",
        type: "todos",
        attributes: {
          title: "Test Todo",
          description: "A test description",
          completed: false,
        },
      });
    });
  });

  describe("jsonApiSerializeManyTodosDocument", () => {
    it("should wrap serialized todos array in data property", () => {
      const result = jsonApiSerializeManyTodosDocument(mockTodos);

      expect(result).toHaveProperty("data");
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it("should return empty data array for empty input", () => {
      const result = jsonApiSerializeManyTodosDocument([]);

      expect(result).toEqual({ data: [] });
    });
  });
});
