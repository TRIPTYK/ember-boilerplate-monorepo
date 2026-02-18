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
      creationDate: '2026-01-15',
      updateDate: '2026-02-10',
      status: 'draft',
      order: '1',
      isOverDueDate: false,
      data: {
        title: 'Gestion des ressources humaines',
        description: 'Traitement des données RH pour le recrutement',
        treatmentType: 'Ressources Humaines',
        responsible: {
          fullName: 'Servais SA',
          entityNumber: 'BE 0412.589.401',
          address: {
            streetAndNumber: 'Rue de la Loi 42',
            postalCode: '1000',
            city: 'Bruxelles',
            country: 'Belgique',
            phone: '+32 2 123 45 67',
            email: 'contact@servais.be',
          },
        },
        hasDPO: true,
        DPO: {
          fullName: 'Jean Dupont',
          address: {
            streetAndNumber: 'Avenue Louise 100',
            postalCode: '1050',
            city: 'Ixelles',
            country: 'Belgique',
            phone: '+32 2 987 65 43',
            email: 'dpo@servais.be',
          },
        },
        hasExternalDPO: false,
        reasons: [],
        subReasons: [],
        legalBase: [],
        dataSubjectCategories: [],
        personalData: [],
        financialData: [],
        dataSource: [],
        retentionPeriod: '',
        hasAccessByThirdParty: false,
        thirdPartyAccess: [],
        areDataExportedOutsideEU: false,
        securityMeasures: [],
      },
    },
  },
  {
    id: '2',
    type: 'treatments' as const,
    attributes: {
      creationDate: '2026-01-20',
      updateDate: '2026-02-12',
      status: 'draft',
      order: '2',
      isOverDueDate: false,
      data: {
        title: 'Gestion de la paie',
        description: 'Traitement des données de paie des employés',
        treatmentType: 'Finance',
        responsible: {
          fullName: 'Servais SA',
          entityNumber: 'BE 0412.589.401',
          address: {
            streetAndNumber: 'Rue de la Loi 42',
            postalCode: '1000',
            city: 'Bruxelles',
            country: 'Belgique',
            phone: '+32 2 123 45 67',
            email: 'contact@servais.be',
          },
        },
        hasDPO: true,
        DPO: {
          fullName: 'Jean Dupont',
          address: {
            streetAndNumber: 'Avenue Louise 100',
            postalCode: '1050',
            city: 'Ixelles',
            country: 'Belgique',
            phone: '+32 2 987 65 43',
            email: 'dpo@servais.be',
          },
        },
        hasExternalDPO: true,
        externalOrganizationDPO: {
          fullName: 'DPO Consulting SPRL',
          entityNumber: 'BE 0678.123.456',
          address: {
            streetAndNumber: 'Boulevard Anspach 25',
            postalCode: '1000',
            city: 'Bruxelles',
            country: 'Belgique',
            phone: '+32 2 555 66 77',
            email: 'contact@dpoconsulting.be',
          },
        },
        reasons: [],
        subReasons: [],
        legalBase: [],
        dataSubjectCategories: [],
        personalData: [],
        financialData: [],
        dataSource: [],
        retentionPeriod: '',
        hasAccessByThirdParty: false,
        thirdPartyAccess: [],
        areDataExportedOutsideEU: false,
        securityMeasures: [],
      },
    },
  },
  {
    id: '3',
    type: 'treatments' as const,
    attributes: {
      creationDate: '2026-02-01',
      updateDate: '2026-02-15',
      status: 'draft',
      order: '3',
      isOverDueDate: false,
      data: {
        title: 'Campagne marketing email',
        description: 'Envoi de newsletters aux clients',
        treatmentType: 'Marketing',
        responsible: {
          fullName: 'Servais SA',
          entityNumber: 'BE 0412.589.401',
          address: {
            streetAndNumber: 'Rue de la Loi 42',
            postalCode: '1000',
            city: 'Bruxelles',
            country: 'Belgique',
            phone: '+32 2 123 45 67',
            email: 'contact@servais.be',
          },
        },
        hasDPO: false,
        hasExternalDPO: false,
        reasons: [],
        subReasons: [],
        legalBase: [],
        dataSubjectCategories: [],
        personalData: [],
        financialData: [],
        dataSource: [],
        retentionPeriod: '',
        hasAccessByThirdParty: false,
        thirdPartyAccess: [],
        areDataExportedOutsideEU: false,
        securityMeasures: [],
      },
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
        const title = treatment.attributes.data?.title?.toLowerCase() || '';
        const description = treatment.attributes.data?.description?.toLowerCase() || '';
        return title.includes(query) || description.includes(query);
      });
    }

    if (sortParam) {
      const isDescending = sortParam.startsWith('-');
      const field = isDescending ? sortParam.slice(1) : sortParam;

      results.sort((a, b) => {
        let aValue: string | undefined;
        let bValue: string | undefined;

        if (field === 'title') {
          aValue = a.attributes.data?.title;
          bValue = b.attributes.data?.title;
        } else if (field === 'description') {
          aValue = a.attributes.data?.description;
          bValue = b.attributes.data?.description;
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
