import { HttpResponse } from 'msw';
import type { paths } from 'backend-app';
import { createOpenApiHttp } from "openapi-msw";

const mockUsers = [
  {
    id: '1',
    type: 'users' as const,
    attributes: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date('2024-01-15').toISOString(),
    },
  },
  {
    id: '2',
    type: 'users' as const,
    attributes: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      createdAt: new Date('2024-02-20').toISOString(),
    },
  },
  {
    id: '3',
    type: 'users' as const,
    attributes: {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      createdAt: new Date('2024-03-10').toISOString(),
    },
  },
];

const http = createOpenApiHttp<paths>();

export const usersHandlers = [
  http.get('/users', () => {
    return HttpResponse.json({
      data: mockUsers,
      meta: {
        total: mockUsers.length,
      },
    });
  }),
];
