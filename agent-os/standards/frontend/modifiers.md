# Modifiers

Modifiers attach behavior to DOM elements. They live in `src/modifiers/`.

## File location

`src/modifiers/{modifier-name}.ts`

## Pattern

Use `modifier()` from `ember-modifier` with a typed `FunctionBasedModifier` signature:

```typescript
// src/modifiers/scroll-on-error.ts
import { modifier, type FunctionBasedModifier } from 'ember-modifier';
import type { ValidationError } from 'ember-immer-changeset';
import { runTask } from 'ember-lifeline';

// Extract reusable logic into a separate exported function
export function scrollToFirstError(
  target: object,
  element: Element | Document,
  errors: ValidationError[],
): void {
  const firstValidError = errors.find(
    (error) =>
      element.querySelector(`[anchorScrollUp="${error?.key}"]`) !== null,
  );

  if (firstValidError) {
    const errorElement = document.querySelector(
      `[anchorScrollUp="${firstValidError?.key}"]`,
    ) as HTMLElement;

    errorElement.style.transition = '0.3s ease-out';

    const targetTop =
      errorElement.getBoundingClientRect().top + window.scrollY - 85;

    runTask(
      target,
      () => {
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      },
      20,
    );
  }
}

const scrollOnErrorModifier: FunctionBasedModifier<{
  Args: { Positional: [ValidationError[]]; Named: object };
  Element: Element;
}> = modifier(function scrollOnError(
  this: object,
  element,
  [errors]: [ValidationError[]],
) {
  scrollToFirstError(this, element, errors);
});

export default scrollOnErrorModifier;
```

## Usage in templates

Import directly and invoke on an element:

```typescript
import scrollOnError from '../modifiers/scroll-on-error.ts';

<template>
  <form {{scrollOnError this.errorsForScroll}}>
    ...
  </form>
</template>
```

## Key rules

- File extension: `.ts` (no template, pure logic)
- Type the modifier with `FunctionBasedModifier<{ Args, Element }>` signature
- `Args.Positional` for positional arguments, `Args.Named` for named arguments
- The modifier function receives `(element, positionalArgs, namedArgs)`
- Extract complex logic into separate exported functions for testability
- Use `ember-lifeline` (`runTask`) for deferred DOM operations to avoid lifecycle issues
- Modifiers re-run when their tracked arguments change
