/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from 'msw';
import type { paths } from '@apps/backend';
import { createOpenApiHttp } from 'openapi-msw';

const mockUsers = [
  {
    id: '1',
    type: 'users' as const,
    attributes: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
  },
  {
    id: '2',
    type: 'users' as const,
    attributes: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    },
  },
  {
    id: '3',
    type: 'users' as const,
    attributes: {
      firstName: 'Bob Johnson',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
    },
  },
];

const http = createOpenApiHttp<paths>();

export default [
  http.get('/api/v1/users/profile', () => {
    return HttpResponse.json({
      data: mockUsers[0]!,
    });
  }),
  http.get('/api/v1/users/{id}', (req) => {
    const { id } = req.params;
    const user = mockUsers.find((user) => user.id === id);
    if (user) {
      return HttpResponse.json({
        data: user,
      });
    } else {
      return HttpResponse.json(
        {
          message: 'Not Found',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 },
      );
    }
  }),
  http.untyped.get('/api/v1/users', ({ request }) => {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('filter[search]');
    const sortParam = url.searchParams.get('sort');

    let results = [...mockUsers];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((user) => {
        const firstName = user.attributes.firstName.toLowerCase();
        const lastName = user.attributes.lastName.toLowerCase();
        const email = user.attributes.email.toLowerCase();
        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          email.includes(query)
        );
      });
    }

    // Apply sort
    if (sortParam) {
      const isDescending = sortParam.startsWith('-');
      const field = isDescending ? sortParam.slice(1) : sortParam;

      results.sort((a, b) => {
        let aValue: string | undefined;
        let bValue: string | undefined;

        if (
          field === 'firstName' ||
          field === 'lastName' ||
          field === 'email'
        ) {
          aValue = a.attributes[field];
          bValue = b.attributes[field];
        }

        if (aValue === undefined || bValue === undefined) {
          return 0;
        }

        const comparison = aValue.localeCompare(bValue);
        return isDescending ? -comparison : comparison;
      });
    }

    return HttpResponse.json({
      data: results,
      meta: {
        total: results.length,
      },
    });
  }),
  http.post('/api/v1/users/', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;

    return HttpResponse.json({
      data: {
        id: json.data.lid,
        type: 'users' as const,
        attributes: json.data.attributes,
      },
    });
  }),
  http.patch('/api/v1/users/{id}', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;

    return HttpResponse.json({
      data: {
        id: json.data.lid,
        type: 'users' as const,
        attributes: json.data.attributes,
      },
    });
  }),
];
