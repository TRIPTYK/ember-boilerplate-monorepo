import { boolean, object, string } from 'zod';
import type z from 'zod';
import type { IntlService } from 'ember-intl';

export const createTodoValidationSchema = (intl: IntlService) =>
  object({
    title: string(intl.t('todos.forms.todo.validation.titleRequired')).min(
      1,
      intl.t('todos.forms.todo.validation.titleRequired')
    ),
    description: string(
      intl.t('todos.forms.todo.validation.descriptionRequired')
    ).min(1, intl.t('todos.forms.todo.validation.descriptionRequired')),
    completed: boolean(
      intl.t('todos.forms.todo.validation.completedRequired')
    ).optional(),
    id: string().optional().nullable(),
  });

export type ValidatedTodo = z.infer<
  ReturnType<typeof createTodoValidationSchema>
>;

export type UpdateTodoData = ValidatedTodo & { id: string };
