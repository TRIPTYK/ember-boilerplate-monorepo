import type { Todo } from '#src/schemas/todos.ts';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
import { findRecord } from '@warp-drive/utilities/json-api';

export type TodosEditRouteSignature = {
  model: Awaited<ReturnType<TodosEditRoute['model']>>;
  controller: undefined;
};

export default class TodosEditRoute extends Route {
  @service declare store: Store;

  async model({ todo_id }: { todo_id: string }) {
    const todo = await this.store.request(
      findRecord<Todo>('todos', todo_id, {
        include: [],
      })
    );

    assert('Todo must not be null', todo.content.data !== null);
    const data = todo.content.data;

    return {
      todo: data,
    };
  }
}
