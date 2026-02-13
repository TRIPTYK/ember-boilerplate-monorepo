# Helpers

Helpers are pure functions usable in templates. They live in `src/helpers/`.

## File location

`src/helpers/{helper-name}.ts`

## Pattern

Use `helper()` from `@ember/component/helper` with a typed signature:

```typescript
// src/helpers/date-format.ts
import { helper } from '@ember/component/helper';
import { format, parseISO } from 'date-fns';

export interface DateFormatSignature {
  Args: {
    Positional: [Date | string, string | undefined];
  };
  Return: string;
}

export default helper<DateFormatSignature>(function dateFormat([
  date,
  fmt,
]: DateFormatSignature['Args']['Positional']) {
  return format(
    typeof date === 'string' ? parseISO(date) : date,
    fmt ?? 'dd/MM/yyyy',
  );
});
```

## Usage in templates

Import directly and invoke with positional args:

```typescript
import dateFormat from './helpers/date-format';

<template>
  {{dateFormat this.date "dd/MM"}}
</template>
```

## Key rules

- File extension: `.ts` (no template, pure logic)
- Always define a typed `Signature` interface with `Args` and `Return`
- Helpers are pure functions — no side effects, no service injection
- Use positional args (`Args.Positional`) for simple helpers
- Export the signature interface for reuse in tests or other components
