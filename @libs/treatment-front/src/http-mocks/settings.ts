import { HttpResponse } from 'msw';
import { createOpenApiHttp } from 'openapi-msw';
import type { paths } from '@apps/backend';
import type { SettingItemKey } from '#src/schemas/settings.ts';

// ── Items plats { key, name } ─────────────────────────────────────────────────

type MockItem = {
  id: string;
  type: 'settings';
  attributes: { key: SettingItemKey; name: string };
};

let nextId = 1;
const i = (key: SettingItemKey, name: string): MockItem => ({
  id: String(nextId++),
  type: 'settings',
  attributes: { key, name },
});

const mockItems: MockItem[] = [
  i('customTreatmentTypes', 'Ressources Humaines'),
  i('customTreatmentTypes', 'Finance et Paie'),
  i('customTreatmentTypes', 'Marketing et Communication'),
  i('customTreatmentTypes', 'Médical et Santé'),
  i('customTreatmentTypes', 'Juridique et Conformité'),
  i('customTreatmentTypes', 'Sécurité et Surveillance'),

  i('customReasons', 'Gestion du personnel'),
  i('customReasons', 'Recrutement'),
  i('customReasons', 'Formation et développement'),
  i('customReasons', 'Paie et rémunération'),
  i('customReasons', 'Évaluation des performances'),
  i('customReasons', 'Fidélisation clients'),

  i('customCategories', 'Candidats'),
  i('customCategories', 'Employés'),
  i('customCategories', 'Anciens employés'),
  i('customCategories', 'Clients'),
  i('customCategories', 'Prospects'),
  i('customCategories', 'Fournisseurs'),
  i('customCategories', 'Patients'),
  i('customCategories', 'Bénévoles'),

  i('customPersonalData', 'Numéro de sécurité sociale (NISS)'),
  i('customPersonalData', 'Numéro de registre national'),
  i('customPersonalData', 'Données biométriques'),
  i('customPersonalData', 'Données de santé'),
  i('customPersonalData', 'Numéro de téléphone personnel'),
  i('customPersonalData', 'Adresse e-mail personnelle'),
  i('customPersonalData', "Photo d'identité"),

  i('customEconomicInformation', 'Numéro de compte bancaire (IBAN)'),
  i('customEconomicInformation', 'Historique de crédit'),
  i('customEconomicInformation', 'Données fiscales'),
  i('customEconomicInformation', 'Salaire et avantages'),

  i('customDataSources', 'Employé lui-même'),
  i('customDataSources', "Agence d'intérim"),
  i('customDataSources', 'Système RH interne'),
  i('customDataSources', 'Candidature directe (CV)'),
  i('customDataSources', 'LinkedIn / réseau professionnel'),
  i('customDataSources', 'Secrétariat social'),

  i('customLegalBase', "Intérêt légitime de l'employeur"),
  i('customLegalBase', 'Consentement explicite'),
  i('customLegalBase', 'Obligation légale (droit belge)'),
  i('customLegalBase', "Exécution d'un contrat de travail"),
  i('customLegalBase', "Mission d'intérêt public"),

  i('customDataAccess', 'Service des Ressources Humaines'),
  i('customDataAccess', 'Direction générale'),
  i('customDataAccess', 'Service juridique et conformité'),
  i('customDataAccess', 'Service informatique (accès technique)'),
  i('customDataAccess', 'Médecin du travail'),
  i('customDataAccess', 'Responsable de département'),

  i('customSharedData', 'Secrétariat social (Partena, SD Worx, Acerta...)'),
  i('customSharedData', "Mutuelle d'entreprise"),
  i('customSharedData', 'Fonds de pension'),
  i('customSharedData', 'Assureur groupe'),
  i('customSharedData', 'Fisc belge (SPF Finances)'),
  i('customSharedData', 'ONSS / INAMI'),

  i('customMeasures', 'Certification ISO 27001'),
  i('customMeasures', 'Chiffrement AES-256'),
  i('customMeasures', "Plan de continuité d'activité (PCA)"),
  i('customMeasures', 'Surveillance 24/7 (SOC)'),
  i('customMeasures', 'Authentification multi-facteurs (MFA)'),
  i('customMeasures', 'Politique de gestion des accès (IAM)'),
  i('customMeasures', 'Audit de sécurité annuel'),
  i('customMeasures', 'Formation RGPD des collaborateurs'),
];

const http = createOpenApiHttp<paths>();

export default [
  // ── GET /api/v1/settings — liste paginée avec filtres ─────────────────────
  http.untyped.get('/api/v1/settings', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('filter[search]')?.toLowerCase() ?? '';
    const keyFilter = url.searchParams.get(
      'filter[key]'
    ) as SettingItemKey | null;
    const pageNumber = parseInt(
      url.searchParams.get('page[number]') ?? '1',
      10
    );
    const pageSize = parseInt(url.searchParams.get('page[size]') ?? '0', 10);
    const sort = url.searchParams.get('sort') ?? '';

    let filtered = mockItems;

    if (keyFilter) {
      filtered = filtered.filter((s) => s.attributes.key === keyFilter);
    }

    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.attributes.key.toLowerCase().includes(search) ||
          s.attributes.name.toLowerCase().includes(search)
      );
    }

    if (sort) {
      const field = sort.replace(/^-/, '') as 'key' | 'name';
      const dir = sort.startsWith('-') ? -1 : 1;
      if (field === 'key' || field === 'name') {
        filtered = [...filtered].sort(
          (a, b) => a.attributes[field].localeCompare(b.attributes[field]) * dir
        );
      }
    }

    const total = filtered.length;
    const paginated =
      pageSize > 0
        ? filtered.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
        : filtered;

    return HttpResponse.json({ data: paginated, meta: { total } });
  }),

  // ── POST /api/v1/settings — créer un item ─────────────────────────────────
  http.untyped.post('/api/v1/settings', async ({ request }) => {
    const body = (await request.json()) as {
      data: { attributes: { key: SettingItemKey; name: string } };
    };
    const { key, name } = body.data.attributes;
    const newItem = i(key, name);
    mockItems.push(newItem);
    return HttpResponse.json({ data: newItem }, { status: 201 });
  }),

  // ── PATCH /api/v1/settings/:id ───────────────────────────────────────────
  http.untyped.patch('/api/v1/settings/:id', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json()) as {
      data: { attributes: { name: string } };
    };
    const found = mockItems.find((s) => s.id === id);
    if (!found) {
      return HttpResponse.json(
        { message: 'Not Found', code: 'SETTING_NOT_FOUND' },
        { status: 404 }
      );
    }
    found.attributes.name = body.data.attributes.name;
    return HttpResponse.json({ data: found });
  }),

  // ── DELETE /api/v1/settings/:id ───────────────────────────────────────────
  http.untyped.delete('/api/v1/settings/:id', ({ params }) => {
    const { id } = params as { id: string };
    const index = mockItems.findIndex((s) => s.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Not Found', code: 'SETTING_NOT_FOUND' },
        { status: 404 }
      );
    }
    mockItems.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
