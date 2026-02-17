/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from 'msw';
import type { paths } from '@apps/backend';
import { createOpenApiHttp } from 'openapi-msw';

const mocktreatments = [
  {
    id: '1',
    type: 'treatments' as const,
    attributes: {
      title: 'Eat 100 Raffaello',
      description: 'I need to eat 100 Raffaello to be happy',
    },
  },
  {
    id: '2',
    type: 'treatments' as const,
    attributes: {
      title: 'Eat a Durum with Stephane',
      description: 'Restaurant La Macchina, 18:00',
    },
  },
  {
    id: '3',
    type: 'treatments' as const,
    attributes: {
      title: 'Call my mom',
      description: 'I need to call my mom to wish her happy birthday',
    },
  },
];

const http = createOpenApiHttp<paths>();

export default [
  http.untyped.get('/api/v1/treatments/:id', (req) => {
    const { id } = req.params;
    const treatment = mocktreatments.find((treatment) => treatment.id === id);
    if (treatment) {
      return HttpResponse.json({
        data: treatment,
      });
    } else {
      return HttpResponse.json(
        {
          message: 'Not Found',
          code: 'treatment_NOT_FOUND',
        },
        { status: 404 }
      );
    }
  }),
  http.untyped.get('/api/v1/treatments', ({ request }) => {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('filter[search]');
    const sortParam = url.searchParams.get('sort');

    let results = [...mocktreatments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((treatment) => {
        const title = treatment.attributes.title.toLowerCase();
        const description = treatment.attributes.description.toLowerCase();
        return title.includes(query) || description.includes(query);
      });
    }

    if (sortParam) {
      const isDescending = sortParam.startsWith('-');
      const field = isDescending ? sortParam.slice(1) : sortParam;

      results.sort((a, b) => {
        let aValue: string | undefined;
        let bValue: string | undefined;

        if (field === 'title' || field === 'description') {
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
  http.untyped.post('/api/v1/treatments', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;

    return HttpResponse.json({
      data: {
        id: json.data.lid,
        type: 'treatments' as const,
        attributes: json.data.attributes,
      },
    });
  }),
  http.untyped.patch('/api/v1/treatments/:id', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;

    return HttpResponse.json({
      data: {
        id: json.data.lid,
        type: 'treatments' as const,
        attributes: json.data.attributes,
      },
    });
  }),
  http.untyped.put('/api/v1/treatments/:id', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;

    return HttpResponse.json({
      data: {
        id: json.data.id,
        type: 'treatments' as const,
        attributes: json.data.attributes,
      },
    });
  }),
  http.untyped.delete('/api/v1/treatments/:id', (req) => {
    const { id } = req.params;
    const treatment = mocktreatments.find((treatment) => treatment.id === id);
    if (treatment) {
      return HttpResponse.json(
        {
          message: 'treatment deleted successfully',
          code: 'treatment_DELETED_SUCCESSFULLY',
        },
        { status: 200 }
      );
    }
  }),
];
