# WarpDrive Auth Handler

Inject authentication tokens into API requests on the frontend.

```typescript
// handlers/auth.ts
export default class AuthHandler {
  @service declare session: SessionService;

  request<T>(context: RequestContext, next: NextFn<T>) {
    const headers = new Headers(context.request.headers);
    headers.append(
      "Authorization",
      `Bearer ${this.session.data.authenticated.access_token}`
    );
    return next({ ...context.request, headers });
  }
}
```

**Rules:**
- Register AuthHandler in request manager pipeline
- Token is stored at `session.data.authenticated.access_token`
- Handler runs for all API requests automatically

**Why:** Centralizes auth token injection. All API requests are authenticated without manual header management.
