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
      status: 'validated',
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
        reasons: ['Gestion de la paie', 'Déclarations sociales'],
        subReasons: [],
        legalBase: [],
        dataSubjectCategories: [],
        personalData: [],
        financialData: [],
        personalDataGroup: {
          data: {
            name: [
              { name: 'Nom et prénom', isSensitive: false },
              { name: 'Numéro de sécurité sociale', isSensitive: false },
            ],
          },
          conservationDuration: '10 ans',
        },
        financialDataGroup: {
          data: {
            name: [
              { name: 'Salaire', isSensitive: false },
              { name: 'Données bancaires', isSensitive: false },
            ],
          },
          conservationDuration: '10 ans',
        },
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
      status: 'archived',
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
        reasons: ['Marketing direct', 'Communication'],
        subReasons: [],
        legalBase: [],
        dataSubjectCategories: [],
        personalData: [],
        financialData: [],
        personalDataGroup: {
          data: {
            name: [
              { name: 'Email', isSensitive: false },
              { name: 'Nom et prénom', isSensitive: false },
            ],
          },
          conservationDuration: '3 ans',
        },
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
    id: '4',
    type: 'treatments' as const,
    attributes: {
      creationDate: '2026-01-10',
      updateDate: '2026-02-16',
      status: 'validated',
      order: '4',
      isOverDueDate: true,
      data: {
        title: 'Gestion des dossiers médicaux',
        description: 'Traitement des données de santé des patients',
        treatmentType: 'RH',
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
        reasons: ['Suivi médical', 'Gestion des absences'],
        subReasons: [],
        legalBase: [],
        dataSubjectCategories: [],
        personalData: [],
        financialData: [],
        personalDataGroup: {
          data: {
            name: [
              { name: 'Nom et prénom', isSensitive: false },
              { name: 'Données de santé', isSensitive: true },
              { name: 'Données génétiques', isSensitive: true },
            ],
          },
          conservationDuration: '20 ans',
        },
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
  http.untyped.get('/api/v1/treatments', ({ request }) => {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('filter[search]');
    const sortParam = url.searchParams.get('sort');
    const includeArchived = url.searchParams.get('includeArchived') === 'true';

    let results = [...mocktreatments];

    if (!includeArchived) {
      results = results.filter(
        (treatment) => treatment.attributes.status !== 'archived'
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((treatment) => {
        const title = treatment.attributes.data?.title?.toLowerCase() || '';
        const description =
          treatment.attributes.data?.description?.toLowerCase() || '';
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
        } else if (field === 'order') {
          return isDescending
            ? Number(b.attributes.order) - Number(a.attributes.order)
            : Number(a.attributes.order) - Number(b.attributes.order);
        }

        if (aValue === undefined || bValue === undefined) {
          return 0;
        }

        const comparison = aValue.localeCompare(bValue);
        return isDescending ? -comparison : comparison;
      });
    } else {
      results.sort(
        (a, b) => Number(a.attributes.order) - Number(b.attributes.order)
      );
    }

    return HttpResponse.json({
      data: results,
      meta: {
        total: results.length,
      },
    });
  }),
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
          errors: [
            {
              status: '404',
              title: 'Not Found',
              detail: `Treatment with id ${id} not found`,
              code: 'treatment_NOT_FOUND',
            },
          ],
        },
        { status: 404 }
      );
    }
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
  http.untyped.post('/api/v1/treatments/:id/archive', (req) => {
    const { id } = req.params;
    const treatment = mocktreatments.find((treatment) => treatment.id === id);
    if (treatment) {
      treatment.attributes.status = 'archived';
      treatment.attributes.updateDate = new Date().toISOString();
      return HttpResponse.json({
        data: treatment,
      });
    }
    return HttpResponse.json(
      {
        message: 'Not Found',
        code: 'treatment_NOT_FOUND',
      },
      { status: 404 }
    );
  }),
  http.untyped.post('/api/v1/treatments/:id/unarchive', (req) => {
    const { id } = req.params;
    const treatment = mocktreatments.find((treatment) => treatment.id === id);
    if (treatment) {
      treatment.attributes.status = 'validated';
      treatment.attributes.updateDate = new Date().toISOString();
      return HttpResponse.json({
        data: treatment,
      });
    }
    return HttpResponse.json(
      {
        message: 'Not Found',
        code: 'treatment_NOT_FOUND',
      },
      { status: 404 }
    );
  }),
  http.untyped.post('/api/v1/treatments/update-order', async (req) => {
    const json = (await req.request.json()) as { treatmentIds: string[] };
    const { treatmentIds } = json;

    treatmentIds.forEach((id, index) => {
      const treatment = mocktreatments.find((t) => t.id === id);
      if (treatment) {
        treatment.attributes.order = String(index + 1);
      }
    });

    return HttpResponse.json({
      success: true,
      message: 'Treatment order updated successfully',
    });
  }),
];
