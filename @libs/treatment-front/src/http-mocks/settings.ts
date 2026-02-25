/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from 'msw';
import { createOpenApiHttp } from 'openapi-msw';
import type { paths } from '@apps/backend';
import type { SettingKey } from '#src/schemas/settings.ts';

type MockSetting = {
  id: SettingKey;
  type: 'settings';
  attributes: { value: unknown };
};

const mockSettings: MockSetting[] = [
  {
    id: 'customTreatmentTypes',
    type: 'settings',
    attributes: {
      value: [
        'Ressources Humaines',
        'Finance et Paie',
        'Marketing et Communication',
        'Médical et Santé',
        'Juridique et Conformité',
        'Sécurité et Surveillance',
      ],
    },
  },
  {
    id: 'customReasons',
    type: 'settings',
    attributes: {
      value: [
        'Gestion du personnel',
        'Recrutement',
        'Formation et développement',
        'Paie et rémunération',
        'Évaluation des performances',
        'Fidélisation clients',
      ],
    },
  },
  {
    id: 'customCategories',
    type: 'settings',
    attributes: {
      value: [
        'Candidats',
        'Employés',
        'Anciens employés',
        'Clients',
        'Prospects',
        'Fournisseurs',
        'Patients',
        'Bénévoles',
      ],
    },
  },
  {
    id: 'customPersonalData',
    type: 'settings',
    attributes: {
      value: [
        { name: 'Numéro de sécurité sociale (NISS)', isSensitive: true },
        { name: 'Numéro de registre national', isSensitive: true },
        { name: 'Données biométriques', isSensitive: true },
        { name: 'Données de santé', isSensitive: true },
        { name: 'Numéro de téléphone personnel', isSensitive: false },
        { name: 'Adresse e-mail personnelle', isSensitive: false },
        { name: 'Photo d\'identité', isSensitive: false },
      ],
    },
  },
  {
    id: 'customEconomicInformation',
    type: 'settings',
    attributes: {
      value: [
        { name: 'Numéro de compte bancaire (IBAN)', isSensitive: false },
        { name: 'Historique de crédit', isSensitive: true },
        { name: 'Données fiscales', isSensitive: true },
        { name: 'Salaire et avantages', isSensitive: false },
      ],
    },
  },
  {
    id: 'customDataSources',
    type: 'settings',
    attributes: {
      value: [
        'Employé lui-même',
        'Agence d\'intérim',
        'Système RH interne',
        'Candidature directe (CV)',
        'LinkedIn / réseau professionnel',
        'Secrétariat social',
      ],
    },
  },
  {
    id: 'customLegalBase',
    type: 'settings',
    attributes: {
      value: [
        'Intérêt légitime de l\'employeur',
        'Consentement explicite',
        'Obligation légale (droit belge)',
        'Exécution d\'un contrat de travail',
        'Mission d\'intérêt public',
      ],
    },
  },
  {
    id: 'customDataAccess',
    type: 'settings',
    attributes: {
      value: [
        'Service des Ressources Humaines',
        'Direction générale',
        'Service juridique et conformité',
        'Service informatique (accès technique)',
        'Médecin du travail',
        'Responsable de département',
      ],
    },
  },
  {
    id: 'customSharedData',
    type: 'settings',
    attributes: {
      value: [
        'Secrétariat social (Partena, SD Worx, Acerta...)',
        'Mutuelle d\'entreprise',
        'Fonds de pension',
        'Assureur groupe',
        'Fisc belge (SPF Finances)',
        'ONSS / INAMI',
      ],
    },
  },
  {
    id: 'customSharedDataAccess',
    type: 'settings',
    attributes: { value: [] },
  },
  {
    id: 'customMeasures',
    type: 'settings',
    attributes: {
      value: [
        'Certification ISO 27001',
        'Chiffrement AES-256',
        'Plan de continuité d\'activité (PCA)',
        'Surveillance 24/7 (SOC)',
        'Authentification multi-facteurs (MFA)',
        'Politique de gestion des accès (IAM)',
        'Audit de sécurité annuel',
        'Formation RGPD des collaborateurs',
      ],
    },
  },
  {
    id: 'DPO',
    type: 'settings',
    attributes: {
      value: {
        fullName: 'Marie Lambert',
        entityNumber: 'BE 0412.589.401',
        address: {
          streetAndNumber: 'Avenue Louise 149',
          postalCode: '1050',
          city: 'Bruxelles',
          country: 'Belgique',
          phone: '+32 2 345 67 89',
          email: 'dpo@organisation.be',
        },
      },
    },
  },
];

const http = createOpenApiHttp<paths>();

export default [
  http.untyped.get('/api/v1/settings', () => {
    return HttpResponse.json({ data: mockSettings });
  }),

  http.untyped.get('/api/v1/settings/:key', ({ params }) => {
    const { key } = params as { key: string };
    const setting = mockSettings.find((s) => s.id === key);
    if (!setting) {
      return HttpResponse.json({ data: null });
    }
    return HttpResponse.json({ data: setting });
  }),

  http.untyped.patch('/api/v1/settings/:key', async ({ params, request }) => {
    const { key } = params as { key: string };
    const body = (await request.json()) as {
      data: { attributes: { value: unknown } };
    };
    const setting = mockSettings.find((s) => s.id === key);
    if (!setting) {
      return HttpResponse.json(
        { message: 'Not Found', code: 'SETTING_NOT_FOUND' },
        { status: 404 }
      );
    }
    setting.attributes.value = body.data.attributes.value;
    return HttpResponse.json({ data: setting });
  }),
];
