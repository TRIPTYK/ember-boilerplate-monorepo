import type { Todo } from '#src/schemas/todos.ts';
import {
  type UpdatedTodo,
  type ValidatedTodo,
} from '#src/components/forms/todo-validation.ts';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import {
  createRecord,
  deleteRecord,
  updateRecord,
} from '@warp-drive/utilities/json-api';
import type ImmerChangeset from 'ember-immer-changeset';

export default class TodoService extends Service {
  @service declare store: Store;

  public async save(changeset: ImmerChangeset<ValidatedTodo | UpdatedTodo>) {
    if (changeset.data.id) {
      return this.update(changeset.data as UpdatedTodo, changeset);
    } else {
      return this.create(changeset.data as ValidatedTodo, changeset);
    }
  }

  public async create(
    data: ValidatedTodo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changeset?: ImmerChangeset<ValidatedTodo>
  ) {
    const todo = this.store.createRecord<Todo>('todos', data);
    const request = createRecord(todo);

    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(todo)),
    });

    await this.store.request(request);
  }

  public async update(
    data: UpdatedTodo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changeset?: ImmerChangeset<ValidatedTodo>
  ) {
    const existingTodo = this.store.peekRecord<Todo>({
      id: data.id,
      type: 'todos',
    });
    assert('Todo must exist to be updated', existingTodo);

    Object.assign(existingTodo, {
      title: data.title,
      description: data.description,
      completed: data.completed ?? false,
    });

    const request = updateRecord(existingTodo, { patch: true });
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existingTodo)),
    });

    await this.store.request(request);
  }

  public async delete(data: UpdatedTodo) {
    const existingTodo = this.store.peekRecord<Todo>({
      id: data.id,
      type: 'todos',
    });
    assert('Todo must exist to be deleted', existingTodo);
    const request = deleteRecord(existingTodo);
    request.body = JSON.stringify({});
    return this.store.request(request);
  }
}
