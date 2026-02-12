# Error Handling

All errors use JSON:API error format via `makeJsonApiError` from `@libs/backend-shared`.

## Error response format

```json
{
  "errors": [{
    "status": "404",
    "title": "Not Found",
    "code": "USER_NOT_FOUND",
    "detail": "User with id abc not found"
  }]
}
```

## Usage

```ts
import { makeJsonApiError } from "@libs/backend-shared";

return reply.code(404).send(
  makeJsonApiError(404, "Not Found", {
    code: "USER_NOT_FOUND",
    detail: `User with id ${id} not found`,
  }),
);
```

## Validation errors

Register `handleJsonApiErrors` as the error handler at module level — it converts Zod validation failures into JSON:API errors automatically:

```ts
f.setErrorHandler((error, request, reply) => {
  handleJsonApiErrors(error, request, reply);
});
```

## Error codes

- UPPER_SNAKE_CASE, descriptive (e.g., `UNAUTHORIZED`, `TOKEN_REVOKED`, `USER_NOT_FOUND`)
- Use `jsonApiErrorDocumentSchema` in route response schemas for error status codes (401, 403, 404)
