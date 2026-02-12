# Route + Template Convention

Routes and templates are separate files by design for separation of concerns.

## File location

`src/routes/dashboard/{entities}/`:

```
├── index.gts              # Route handler (list)
├── index-template.gts     # Template (list view)
├── create.gts             # Route handler (create)
├── create-template.gts    # Template (create form)
├── edit.gts               # Route handler (edit)
└── edit-template.gts      # Template (edit form)
```

## Naming rule

Template file = route file name + `-template.gts`

## Route handler patterns

**Simple route** (no data loading):
```typescript
export type TodosCreateRouteSignature = {
  model: Awaited<ReturnType<TodosCreateRoute['model']>>;
  controller: undefined;
};

export default class TodosCreateRoute extends Route {}
```

**Route with model loading**:
```typescript
export type TodosEditRouteSignature = {
  model: Awaited<ReturnType<TodosEditRoute['model']>>;
  controller: undefined;
};

export default class TodosEditRoute extends Route {
  @service declare store: Store;

  async model({ todo_id }: { todo_id: string }) {
    const todo = await this.store.request(
      findRecord<Todo>('todos', todo_id, { include: [] })
    );
    assert('Todo must not be null', todo.content.data !== null);
    return { todo: todo.content.data };
  }
}
```

## Template patterns

**Template-only** (list/index):
```typescript
export default <template>
  <TodosTable />
</template> as TOC<{
  model: Awaited<ReturnType<TodosIndexRoute['model']>>;
  controller: undefined;
}>;
```

**Class template** (create/edit — needs changeset):
```typescript
export default class TodosCreateRouteTemplate extends Component<TodosCreateRouteSignature> {
  changeset = new TodoChangeset({});
  <template><TodosForm @changeset={{this.changeset}} /></template>
}
```

## Key rules

- Always export route signature type from the route file
- Dynamic segments: `:{entity}_id` naming
- Edit templates initialize changeset from `this.args.model`
- Create templates initialize changeset with empty `{}`
