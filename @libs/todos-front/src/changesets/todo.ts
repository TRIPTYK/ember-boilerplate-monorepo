import ImmerChangeset from 'ember-immer-changeset';

export interface DraftTodo {
  id?: string | null;
  title?: string;
  description?: string;
  completed?: boolean;
}

export class TodoChangeset extends ImmerChangeset<DraftTodo> { }
