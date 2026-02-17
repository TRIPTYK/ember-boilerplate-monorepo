# Translations

Libs export translation keys. Apps provide the actual translations.

## Rule

- Libs **never** contain translation files
- Apps store translations in `@apps/front/app/translations/{entities}/{locale}.yaml`

## Key naming convention

`{entities}.{context}.{subcontext}.{key}`

Examples:
```
todos.forms.todo.labels.title
todos.forms.todo.labels.description
todos.forms.todo.validation.titleRequired
todos.forms.todo.messages.saveSuccess
todos.forms.todo.messages.deleteSuccess
todos.forms.todo.actions.submit
todos.forms.todo.actions.back
todos.table.headers.title
todos.table.headers.description
todos.table.actions.edit
todos.table.actions.delete
todos.table.actions.addTodo
todos.table.confirmModal.question
todos.pages.list.title
```

## File location

```
@apps/front/app/translations/
├── todos/
│   ├── en-us.yaml
│   └── fr-fr.yaml
├── users/
│   ├── en-us.yaml
│   └── fr-fr.yaml
└── global keys in root translations
```

## Usage in components

```typescript
// Template helper
{{t "todos.forms.todo.labels.title"}}

// Service injection
this.intl.t('todos.forms.todo.messages.saveSuccess')
```
