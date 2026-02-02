# Error Response Format

All errors return consistent JSON:

```json
{
  "message": "Human-readable error",
  "code": "ERROR_CODE",
  "status": 404
}
```

**Implementation:**
```typescript
fastify.setErrorHandler((error, request, reply) => {
  reply.send({
    message: error.message,
    code: error.code,
    status: error.statusCode ?? 500,
  });
});
```

**Rules:**
- Always include all three fields: message, code, status
- Use descriptive error codes (UPPER_SNAKE_CASE)
- Status code matches HTTP status

**Why:** Clients can handle errors programmatically using codes while showing messages to users.
