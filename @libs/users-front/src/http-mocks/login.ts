import { http, HttpResponse } from 'msw';

export default [
  http.post('/api/v1/auth/login', () => {
    return HttpResponse.json({
      data: {
        accessToken:
          'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.ANCf_8p1AE4ZQs7QuqGAyyfTEgYrKSjKWkhBk5cIn1_2QVr2jEjmM-1tu7EgnyOf_fAsvdFXva8Sv05iTGzETg',
        refreshToken: 'mock-refresh',
      },
    });
  }),
];
