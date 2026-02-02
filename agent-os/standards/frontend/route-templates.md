# Route/Template Split

Route templates live in separate `-template.gts` files next to routes.

**File structure:**
```
routes/
  users/
    index.gts           # Route logic
    index-template.gts  # Template
    edit.gts            # Route logic
    edit-template.gts   # Template
```

**Simple template (TOC):**
```typescript
export default <template>
  <h1>Users</h1>
</template> as TOC<{
  model: Awaited<ReturnType<UsersIndexRoute['model']>>;
}>;
```

**Stateful template (Component):**
```typescript
export default class UsersEditTemplate extends Component<UsersEditRouteSignature> {
  changeset = new UserChangeset(this.args.model.user);
  <template><UsersForm @changeset={{this.changeset}} /></template>
}
```

**Why:** Keeps route logic and templates in separate files but colocated. Standard Ember pattern, easier navigation.
