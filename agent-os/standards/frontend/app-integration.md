# App Integration Checklist

Steps to wire a new frontend lib into `@apps/front`:

## 1. Add dependency

`@apps/front/package.json`:
```json
"devDependencies": {
  "@libs/{name}-front": "workspace:^"
}
```
Then run `pnpm install`.

## 2. Initialize lib

`@apps/front/app/routes/application.ts`:
```typescript
import { initialize as initialize{Name}Lib } from '@libs/{name}-front';
import { getOwner } from '@ember/-internals/owner';

// In beforeModel():
await initialize{Name}Lib(getOwner(this)!);
// or without await if initialize is sync
```

## 3. Register mock handlers

Same file, `routes/application.ts`:
```typescript
import all{Name}Handlers from '@libs/{name}-front/http-mocks/all';

// In beforeModel(), add to setupWorker:
const worker = setupWorker(...allUsersHandlers, ...all{Name}Handlers);
```

## 4. Register routes

`@apps/front/app/router.ts`:
```typescript
import { forRouter as {name}LibRouter } from '@libs/{name}-front';

Router.map(function () {
  this.route('dashboard', { path: '/' }, function () {
    {name}LibRouter.call(this);
  });
});
```

## 5. Register schema in store

`@apps/front/app/services/store.ts`:
```typescript
import {Entity}Schema from '@libs/{name}-front/schemas/{entities}';

// Add to useLegacyStore schemas array:
schemas: [UserSchema, {Entity}Schema],
```

## 6. Add CSS source

`@apps/front/app/styles/app.css`:
```css
@source "../../node_modules/@libs/{name}-front";
```

## 7. Add translations

Create translation files in:
```
@apps/front/app/translations/{entities}/en-us.yaml
@apps/front/app/translations/{entities}/fr-fr.yaml
```
