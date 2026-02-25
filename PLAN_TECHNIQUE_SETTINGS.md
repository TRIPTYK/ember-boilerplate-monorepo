# Plan Technique - Système de Settings (Paramètres)

## Document technique pour développeur

**Version** : 1.0  
**Date** : 18 février 2026  
**Application** : Registr - Gestion des traitements RGPD  

---

## Table des matières

1. [Vue d'ensemble du système](#1-vue-densemble-du-système)
2. [Architecture globale](#2-architecture-globale)
3. [Types de settings disponibles](#3-types-de-settings-disponibles)
4. [Structure des données](#4-structure-des-données)
5. [API Backend](#5-api-backend)
6. [Hooks Frontend](#6-hooks-frontend)
7. [Utilisation dans les composants](#7-utilisation-dans-les-composants)
8. [Flux de données](#8-flux-de-données)
9. [Gestion du cache](#9-gestion-du-cache)
10. [Page de gestion des settings](#10-page-de-gestion-des-settings)
11. [Import/Export](#11-importexport)
12. [Cas d'usage détaillés](#12-cas-dusage-détaillés)
13. [Diagrammes](#13-diagrammes)
14. [Bonnes pratiques](#14-bonnes-pratiques)
15. [Annexes](#15-annexes)

---

## 1. Vue d'ensemble du système

### 1.1 Qu'est-ce que le système de settings ?

Le système de **settings** (paramètres) permet de stocker et gérer des **options personnalisées** créées par les utilisateurs dans l'application Registr.

**Objectif principal** : Permettre aux utilisateurs d'ajouter leurs propres valeurs aux listes prédéfinies de l'application (finalités, catégories, données, mesures de sécurité, etc.).

**Exemple** :
- L'application propose 13 mesures de sécurité standards
- L'utilisateur peut ajouter "Certification ISO 27001" comme mesure personnalisée
- Cette mesure est stockée dans les settings sous la clé `customMeasures`
- Elle devient disponible pour tous les traitements futurs

### 1.2 Portée des settings

**Niveau** : Organisation (global)

**Partage** : Tous les utilisateurs de l'organisation ont accès aux mêmes settings

**Persistance** : Les settings sont stockés en base de données et persistent entre les sessions

### 1.3 Différence avec les données de traitement

| Aspect | Settings | Données de traitement |
|--------|----------|----------------------|
| **Portée** | Global (organisation) | Spécifique (traitement) |
| **Réutilisabilité** | Oui (pour tous les traitements) | Non (unique au traitement) |
| **Modification** | Via page Settings ou inline | Via formulaire de traitement |
| **Stockage** | Table `settings` | Table `treatments` |
| **Exemple** | "Certification ISO 27001" | "Chiffrement AES-256 pour..." |

---

## 2. Architecture globale

### 2.1 Schéma d'architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Composants de formulaire (Étapes 1-8)                    │  │
│  │ - TitleStep.tsx (customTreatmentTypes)                   │  │
│  │ - PurposeStep.tsx (customReasons)                        │  │
│  │ - CategoriesStep.tsx (customCategories)                  │  │
│  │ - DataStep.tsx (customPersonalData, customFinancialData) │  │
│  │ - LegalBaseStep.tsx (customLegalBase)                    │  │
│  │ - SharedDataStep.tsx (customDataAccess, customSharedData)│  │
│  │ - SecurityStep.tsx (customMeasures)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ ↑                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Hooks React Query                                        │  │
│  │ - useGetOneSetting(key)                                  │  │
│  │ - useSettingsGetAll()                                    │  │
│  │ - useUpdateSetting()                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ ↑                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ API Client (baseFetch)                                   │  │
│  │ - GET /api/v1/settings                                   │  │
│  │ - GET /api/v1/settings/:key                              │  │
│  │ - PATCH /api/v1/settings/:key                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Routes Fastify                                           │  │
│  │ - SettingsGetByIdRoute                                   │  │
│  │ - SettingsGetAllRoute                                    │  │
│  │ - SettingsUpdateRoute                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ ↑                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Use Cases                                                │  │
│  │ - SettingsUpdateUseCase                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ ↑                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Repository (MikroORM)                                    │  │
│  │ - SettingsRepository                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ ↑                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Base de données (PostgreSQL)                             │  │
│  │ Table: settings                                          │  │
│  │ - id (UUID)                                              │  │
│  │ - key (string)                                           │  │
│  │ - value (JSON)                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Flux de données simplifié

```
1. Utilisateur saisit une valeur personnalisée dans un formulaire
   ↓
2. Composant vérifie si la valeur existe déjà
   ↓
3. Si nouvelle valeur → Appel à useUpdateSetting()
   ↓
4. Requête PATCH /api/v1/settings/:key avec la nouvelle valeur
   ↓
5. Backend met à jour la base de données
   ↓
6. Invalidation du cache React Query
   ↓
7. Rechargement automatique des settings
   ↓
8. Mise à jour de l'interface utilisateur
```

---

## 3. Types de settings disponibles

### 3.1 Liste complète des clés de settings

| Clé | Description | Type de valeur | Utilisé dans |
|-----|-------------|----------------|--------------|
| `customTreatmentTypes` | Types de traitements personnalisés | `string[]` | Étape 1 (Titre), Table des traitements |
| `customReasons` | Finalités personnalisées | `string[]` | Étape 3 (Finalités) |
| `customCategories` | Catégories de personnes personnalisées | `string[]` | Étape 4 (Catégories) |
| `customPersonalData` | Données personnelles personnalisées | `CustomPersonalData[]` | Étape 5 (Données) |
| `customEconomicInformation` | Données financières personnalisées | `CustomPersonalData[]` | Étape 5 (Données) |
| `customDataSources` | Sources de données personnalisées | `string[]` | Étape 5 (Données) |
| `customLegalBase` | Bases légales personnalisées | `string[]` | Étape 6 (Base légale) |
| `customDataAccess` | Accès internes personnalisés | `string[]` | Étape 7 (Partage) |
| `customSharedData` | Partages externes personnalisés | `string[]` | Étape 7 (Partage) |
| `customMeasures` | Mesures de sécurité personnalisées | `string[]` | Étape 8 (Sécurité) |
| `DPO` | Informations du DPO | `object` | Étape 2 (Informations) |

### 3.2 Types TypeScript

#### Frontend (useUpdateSettings.ts)

```typescript
export type SettingKey =
  | 'DPO'
  | 'customCategories'
  | 'customReasons'
  | 'customPersonalData'
  | 'customEconomicInformation'
  | 'customDataSources'
  | 'customLegalBase'
  | 'customSharedDataAccess'
  | 'customDataAccess'
  | 'customMeasures'
  | 'customSharedData'
  | 'customTreatmentTypes';
```

#### Backend (settings.entity.ts)

```typescript
export type SettingsKey = 
  | "entity"
  | "customCategories"
  | "customReasons"
  | "customPersonalData"
  | "customEconomicInformation"
  | "customDataSources"
  | "customSharedDataAccess"
  | "customDataAccess"
  | "customMeasures"
  | "customTreatmentTypes";
```

#### Type CustomPersonalData

```typescript
export interface CustomPersonalData {
  name: string;
  isSensitive: boolean;
}
```

**Utilisation** : Pour `customPersonalData` et `customEconomicInformation`

**Raison** : Ces données ont un attribut supplémentaire `isSensitive` pour indiquer si la donnée est sensible ou non.

---

## 4. Structure des données

### 4.1 Modèle de données backend

**Entité** : `SettingsEntity`

**Fichier** : `packages/registr_backend/src/domain/settings.entity.ts`

```typescript
export class SettingsEntity {
  #key: SettingsKey;
  #value: Record<string, unknown> | Record<string, unknown>[] | CustomPersonalData[];

  public static create(
    key: SettingsKey, 
    value: Record<string, unknown> | Record<string, unknown>[] | CustomPersonalData[]
  ): SettingsEntity {
    return new SettingsEntity(key, value);
  }

  get key(): SettingsKey {
    return this.#key;
  }

  get value(): Record<string, unknown> | Record<string, unknown>[] | CustomPersonalData[] {
    return this.#value;
  }

  set value(newValue: Record<string, unknown> | Record<string, unknown>[] | CustomPersonalData[]) {
    this.#value = newValue;
  }

  private constructor(
    key: SettingsKey, 
    value: Record<string, unknown> | Record<string, unknown>[] | CustomPersonalData[]
  ) {
    this.#key = key;
    this.#value = value;
  }

  toJSON() {
    return {
      key: this.key,
      value: this.value,
    };
  }
}
```

### 4.2 Modèle de données frontend

**Interface** : `Setting<T>`

**Fichier** : `packages/registr_frontend/src/features/treatments/hooks/useGetSettings.ts`

```typescript
export interface Setting<T extends SettingKey> {
  key: T;
  value: unknown;
}
```

### 4.3 Format JSON en base de données

**Table** : `settings`

**Colonnes** :
- `id` : UUID (clé primaire)
- `key` : string (unique)
- `value` : JSON

**Exemple de ligne** :

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "key": "customMeasures",
  "value": [
    "Certification ISO 27001",
    "Surveillance 24/7",
    "Plan de continuité d'activité"
  ]
}
```

**Exemple avec CustomPersonalData** :

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "key": "customPersonalData",
  "value": [
    {
      "name": "Données biométriques",
      "isSensitive": true
    },
    {
      "name": "Données de localisation",
      "isSensitive": false
    }
  ]
}
```

### 4.4 Données initiales (Seeder)

**Fichier** : `packages/registr_backend/src/framework/node/settings.seeder.ts`

**Données par défaut** :

```typescript
const settingsData = {
  customCategories: ["Données personnelles", "Données économiques"],
  customDataAccess: ["Accès aux données", "Accès aux données économiques"],
  customEconomicInformation: [
    "Données économiques",
    "Données financières",
  ],
  customDataSources: [
    "Employé",
    "Agence intérim",
  ],
  customPersonalData: [
    {
      "isSensitive": false,
      "name": "Données personnelles",
    }, 
    {
      "isSensitive": false,
      "name": "Données familiales",
    }
  ],
  customReasons: ["Intérêt légitime", "Consentement"],
  customSharedDataAccess: [
    { name: "Accès aux données", isSensitive: false },
    { name: "Accès aux données économiques", isSensitive: false },
  ],
  customMeasures: ["Mesure 1", "Mesure 2"],
};
```

---

## 5. API Backend

### 5.1 Endpoints disponibles

#### GET /api/v1/settings

**Description** : Récupère tous les settings

**Réponse** :
```json
{
  "data": [
    {
      "key": "customMeasures",
      "value": ["Certification ISO 27001", "Surveillance 24/7"]
    },
    {
      "key": "customReasons",
      "value": ["Intérêt légitime", "Consentement"]
    },
    ...
  ]
}
```

**Route** : `SettingsGetAllRoute`

**Fichier** : `packages/registr_backend/src/application/transport/settings/settings.getall.route.ts`

#### GET /api/v1/settings/:key

**Description** : Récupère un setting spécifique par sa clé

**Paramètres** :
- `key` : Clé du setting (enum)

**Réponse** :
```json
{
  "data": {
    "key": "customMeasures",
    "value": ["Certification ISO 27001", "Surveillance 24/7"]
  }
}
```

**Réponse (si non trouvé)** :
```json
{
  "data": null
}
```

**Route** : `SettingsGetByIdRoute`

**Fichier** : `packages/registr_backend/src/application/transport/settings/settings.getbyid.route.ts`

**Schéma Zod** :

```typescript
schema: {
  params: object({
    key: settingsKeysSchema
  }),
  response: {
    200: object({
      data: object({
        key: string(),
        value: any()
      }).nullable()
    }),
    400: object({
      message: string()
    })
  }
}
```

#### PATCH /api/v1/settings/:key

**Description** : Met à jour un setting spécifique

**Paramètres** :
- `key` : Clé du setting (enum)

**Body** :
```json
{
  "value": ["Certification ISO 27001", "Surveillance 24/7", "Plan de continuité"]
}
```

**Réponse** :
```json
{
  "data": {
    "key": "customMeasures",
    "value": ["Certification ISO 27001", "Surveillance 24/7", "Plan de continuité"]
  }
}
```

**Route** : `SettingsUpdateRoute`

**Fichier** : `packages/registr_backend/src/application/transport/settings/settings.update.route.ts`

**Schéma Zod** :

```typescript
schema: {
  params: object({
    key: settingsKeysSchema
  }),
  body: object({
    value: any()
  }),
  response: {
    200: object({
      data: object({
        key: string(),
        value: any()
      })
    }),
    400: object({
      message: string()
    }),
    404: object({
      message: string()
    })
  }
}
```

**Use Case** : `SettingsUpdateUseCase`

**Fichier** : `packages/registr_backend/src/application/use-case/settings/settings.update.use-case.ts`

### 5.2 Validation des clés

**Enum Zod** : `settingsKeysSchema`

**Fichier** : `packages/registr_backend/src/application/transport/settings/settings.update.route.ts`

```typescript
export const settingsKeysSchema = z.enum([
  "entity", 
  "customCategories", 
  "customDataAccess", 
  "customEconomicInformation", 
  "customDataSources", 
  "customPersonalData", 
  "customReasons", 
  "customSharedDataAccess", 
  "customMeasures", 
  "customTreatmentTypes"
]);
```

**Validation** : Seules les clés définies dans l'enum sont acceptées. Toute autre clé renvoie une erreur 400.

### 5.3 Repository

**Interface** : `SettingsRepository`

**Fichier** : `packages/registr_backend/src/domain/settings.repository.ts`

**Méthodes** :
- `findOneByKey(key: SettingsKey): Promise<SettingsEntity | null>`
- `findAll(): Promise<SettingsEntity[]>`
- `update(key: SettingsKey, value: unknown): Promise<SettingsEntity>`

**Implémentation** : `SettingsNodeRepository` (MikroORM)

**Fichier** : `packages/registr_backend/src/framework/node/settings.node.repository.ts`

---

## 6. Hooks Frontend

### 6.1 useGetOneSetting

**Description** : Hook pour récupérer un setting spécifique

**Fichier** : `packages/registr_frontend/src/features/treatments/hooks/useGetSettings.ts`

**Signature** :
```typescript
export const useGetOneSetting = <T extends SettingKey>(key: T) => {
  return useQuery<Setting<T>>({
    queryKey: ['settings', key],
    queryFn: async () => {
      const response = await baseFetch(`/api/v1/settings/${key}`);
      return response.json().then((d) => d.data);
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
```

**Utilisation** :
```typescript
const { data, isLoading, error } = useGetOneSetting('customMeasures');

// data.key = 'customMeasures'
// data.value = ["Certification ISO 27001", "Surveillance 24/7"]
```

**Cache** : React Query avec clé `['settings', key]`

**Refetch** : Désactivé (pas de refetch automatique)

### 6.2 useSettingsGetAll

**Description** : Hook pour récupérer tous les settings

**Fichier** : `packages/registr_frontend/src/features/treatments/hooks/useGetSettings.ts`

**Signature** :
```typescript
export const useSettingsGetAll = () => {
  return useQuery<SettingsResult>({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await baseFetch('/api/v1/settings');
      return response.json().then((d) => d.data);
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
```

**Utilisation** :
```typescript
const { data, isLoading, error } = useSettingsGetAll();

// data = [
//   { key: 'customMeasures', value: [...] },
//   { key: 'customReasons', value: [...] },
//   ...
// ]
```

**Cache** : React Query avec clé `['settings']`

### 6.3 useUpdateSetting

**Description** : Hook pour mettre à jour un setting

**Fichier** : `packages/registr_frontend/src/features/treatments/hooks/useUpdateSettings.ts`

**Signature** :
```typescript
export const useUpdateSetting = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: SettingUpdatePayload) => {
      await baseFetch(`/api/v1/settings/${key}`, {
        body: JSON.stringify({ value }),
        headers: { 'content-type': 'application/json' },
        method: 'PATCH',
      });
    },
    onSuccess: async () => {
      client.invalidateQueries({
        queryKey: ['settings'],
      });
    },
  });
};
```

**Utilisation** :
```typescript
const { mutateAsync } = useUpdateSetting();

// Ajouter une nouvelle mesure
await mutateAsync({
  key: 'customMeasures',
  value: [...existingMeasures, 'Nouvelle mesure']
});
```

**Invalidation du cache** : Après succès, tous les queries avec la clé `['settings']` sont invalidés et rechargés automatiquement.

---

## 7. Utilisation dans les composants

### 7.1 Étape 1 : Titre et type de traitement

**Composant** : `TitleStep.tsx`

**Setting utilisé** : `customTreatmentTypes`

**Code** :
```typescript
const { data } = useGetOneSetting('customTreatmentTypes');

const treatmentTypes = [
  ...standardTypes,
  ...(Array.isArray(data?.value) ? data.value : [])
];
```

**Utilisation** : Liste déroulante des types de traitements

### 7.2 Étape 3 : Finalités

**Composant** : `PurposeStep.tsx`

**Setting utilisé** : `customReasons`

**Code** :
```typescript
const { data } = useGetOneSetting('customReasons');
const { mutateAsync: updateSetting } = useUpdateSetting();

const handleReasonFieldChange = (selected: string[]) => {
  const customReasons = selected.filter(
    (item) =>
      !reasonOptions.includes(item) &&
      (!data?.value || !Array.isArray(data.value) || !data.value.includes(item))
  );

  if (customReasons.length > 0) {
    updateSetting({
      key: 'customReasons',
      value: [...(Array.isArray(data?.value) ? data.value : []), ...customReasons],
    });
  }
};
```

**Logique** :
1. Récupère les finalités personnalisées existantes
2. Détecte les nouvelles finalités saisies par l'utilisateur
3. Ajoute les nouvelles finalités aux settings
4. Met à jour le cache React Query

### 7.3 Étape 4 : Catégories de personnes

**Composant** : `CategoriesStep.tsx`

**Setting utilisé** : `customCategories`

**Code** :
```typescript
const { data } = useGetOneSetting('customCategories');
const { mutateAsync: updateSetting } = useUpdateSetting();

const handleCategoryFieldChange = (selected: string[]) => {
  const customCategories = selected.filter(
    (item) =>
      !categoryOptions.includes(item) &&
      (!data?.value || !Array.isArray(data.value) || !data.value.includes(item))
  );

  if (customCategories.length > 0) {
    updateSetting({
      key: 'customCategories',
      value: [...(Array.isArray(data?.value) ? data.value : []), ...customCategories],
    });
  }
};
```

### 7.4 Étape 5 : Données collectées

**Composant** : `DataStep.tsx`

**Settings utilisés** :
- `customPersonalData`
- `customEconomicInformation`
- `customDataSources`

**Code** :
```typescript
const { data: customPersonalData } = useGetOneSetting('customPersonalData');
const { data: customFinancialData } = useGetOneSetting('customEconomicInformation');
const { data: customDataSources } = useGetOneSetting('customDataSources');

// Fusion avec les options standards
const personalDataOptions = [
  ...standardPersonalData,
  ...(Array.isArray(customPersonalData?.value) 
    ? customPersonalData.value.filter((d) => typeof d === 'object' && 'name' in d)
    : [])
];
```

**Particularité** : Les données personnelles et financières ont un attribut `isSensitive`.

**Ajout d'une donnée personnalisée** :
```typescript
const newData = {
  name: 'Données biométriques',
  isSensitive: true
};

updateSetting({
  key: 'customPersonalData',
  value: [
    ...(Array.isArray(customPersonalData?.value) ? customPersonalData.value : []),
    newData
  ],
});
```

### 7.5 Étape 6 : Base légale

**Composant** : `LegalBaseStep.tsx`

**Setting utilisé** : `customLegalBase`

**Code** :
```typescript
const { data } = useGetOneSetting('customLegalBase');

const legalBaseOptions = [
  ...standardLegalBases,
  ...(Array.isArray(data?.value) ? data.value : [])
];
```

### 7.6 Étape 7 : Partage des données

**Composant** : `SharedDataStep.tsx`

**Settings utilisés** :
- `customDataAccess` (accès internes)
- `customSharedData` (partages externes)

**Code** :
```typescript
const { data: customDataAccess } = useGetOneSetting('customDataAccess');
const { data: customSharedData } = useGetOneSetting('customSharedData');

const dataAccessOptions = [
  ...standardDataAccess,
  ...(Array.isArray(customDataAccess?.value) ? customDataAccess.value : [])
];

const sharedDataOptions = [
  ...standardSharedData,
  ...(Array.isArray(customSharedData?.value) ? customSharedData.value : [])
];
```

### 7.7 Étape 8 : Mesures de sécurité

**Composant** : `SecurityStep.tsx`

**Setting utilisé** : `customMeasures`

**Code** :
```typescript
const { data: customMeasures } = useGetOneSetting('customMeasures');
const { mutateAsync: updateSetting } = useUpdateSetting();

const handleMeasureFieldChange = (selected: string[]) => {
  const customSelections = selected.filter(
    (item) =>
      !securityMeasureOptions.includes(item) &&
      (!customMeasures?.value ||
        !Array.isArray(customMeasures.value) ||
        !customMeasures.value.includes(item))
  );

  if (customSelections.length > 0) {
    updateSetting({
      key: 'customMeasures',
      value: [
        ...(Array.isArray(customMeasures?.value) ? customMeasures.value : []),
        ...customSelections,
      ],
    });
  }
};
```

### 7.8 Table des traitements

**Composant** : `TreatmentsTable.tsx`

**Setting utilisé** : `customTreatmentTypes`

**Code** :
```typescript
const { data: treatmentTypesData } = useGetOneSetting('customTreatmentTypes');

// Utilisation pour l'édition inline du type de traitement
const treatmentTypes = [
  ...standardTypes,
  ...(Array.isArray(treatmentTypesData?.value) ? treatmentTypesData.value : [])
];
```

---

## 8. Flux de données

### 8.1 Flux de lecture

```
1. Composant monte
   ↓
2. useGetOneSetting('customMeasures') est appelé
   ↓
3. React Query vérifie le cache
   ↓
4. Si cache vide → Requête GET /api/v1/settings/customMeasures
   ↓
5. Backend récupère les données de la base
   ↓
6. Réponse JSON : { key: 'customMeasures', value: [...] }
   ↓
7. React Query met en cache les données
   ↓
8. Composant reçoit les données via data
   ↓
9. Fusion avec les options standards
   ↓
10. Affichage dans l'interface
```

### 8.2 Flux d'écriture (ajout d'une option personnalisée)

```
1. Utilisateur saisit "Certification ISO 27001"
   ↓
2. Composant détecte une nouvelle valeur
   ↓
3. Appel à updateSetting({ key: 'customMeasures', value: [...existing, 'Certification ISO 27001'] })
   ↓
4. Requête PATCH /api/v1/settings/customMeasures
   Body: { value: [...existing, 'Certification ISO 27001'] }
   ↓
5. Backend met à jour la base de données
   ↓
6. Réponse 200 OK
   ↓
7. onSuccess: invalidateQueries(['settings'])
   ↓
8. React Query invalide tous les caches de settings
   ↓
9. Tous les useGetOneSetting actifs se rechargent automatiquement
   ↓
10. Composants reçoivent les nouvelles données
   ↓
11. Interface mise à jour avec la nouvelle option
```

### 8.3 Flux de fusion des options

**Problème** : Comment fusionner les options standards et personnalisées ?

**Solution** : Fusion dans le composant

**Code type** :
```typescript
const standardOptions = ['Option 1', 'Option 2', 'Option 3'];
const { data } = useGetOneSetting('customKey');

const allOptions = [
  ...standardOptions,
  ...(Array.isArray(data?.value) ? data.value : [])
];
```

**Ordre** : Standards en premier, personnalisées ensuite

**Dédoublonnage** : Géré lors de l'ajout (vérification avant d'ajouter)

---

## 9. Gestion du cache

### 9.1 Stratégie de cache React Query

**Clés de cache** :
- `['settings']` : Tous les settings
- `['settings', key]` : Un setting spécifique

**Configuration** :
```typescript
{
  refetchInterval: false,        // Pas de refetch automatique
  refetchOnWindowFocus: false,   // Pas de refetch au focus
}
```

**Raison** : Les settings changent rarement, pas besoin de refetch automatique.

### 9.2 Invalidation du cache

**Déclencheur** : Après une mutation réussie (useUpdateSetting)

**Code** :
```typescript
onSuccess: async () => {
  client.invalidateQueries({
    queryKey: ['settings'],
  });
}
```

**Effet** :
- Tous les `useGetOneSetting` actifs sont invalidés
- Rechargement automatique des données
- Mise à jour de l'interface

**Portée** : Tous les settings (pas seulement celui modifié)

**Raison** : Simplicité et cohérence (évite les problèmes de synchronisation)

### 9.3 Optimisation possible

**Invalidation ciblée** :
```typescript
onSuccess: async (_, variables) => {
  client.invalidateQueries({
    queryKey: ['settings', variables.key],
  });
}
```

**Avantage** : Invalide uniquement le setting modifié

**Inconvénient** : Ne met pas à jour `useSettingsGetAll`

**Recommandation actuelle** : Invalider tous les settings (simplicité)

---

## 10. Page de gestion des settings

### 10.1 Vue d'ensemble

**Route** : `/dashboard/settings`

**Composant** : `SettingsPage.tsx`

**Fichier** : `packages/registr_frontend/src/features/settings/pages/SettingsPage.tsx`

**Fonctionnalités** :
- Affichage de tous les settings dans une table
- Ajout de nouveaux settings
- Modification de settings existants
- Suppression de settings
- Import/Export de settings (JSON)

### 10.2 Navigation

**Deux onglets** :
1. **Paramètres** : Gestion des settings
2. **Entreprise** : Informations de l'entreprise (DPO, responsable, etc.)

**Composant** : `SettingNavBar.tsx`

### 10.3 Table des settings

**Composant** : `SettingsTable.tsx`

**Colonnes** :
- Clé (key)
- Nom (name)
- Actions (modifier, supprimer)

**Actions** :
- **Ajouter** : Ouvre un formulaire modal
- **Modifier** : Ouvre un formulaire modal avec les valeurs existantes
- **Supprimer** : Supprime le setting après confirmation

### 10.4 Formulaire de setting

**Composant** : `SettingForm.tsx`

**Champs** :
- Clé (key) : Liste déroulante des clés disponibles
- Valeur (value) : Champ texte ou liste selon le type

**Validation** : Schéma Zod

**Soumission** : Appel à `useUpdateSetting` ou `useAddSetting`

---

## 11. Import/Export

### 11.1 Export de settings

**Bouton** : "Exporter les paramètres"

**Action** : Télécharge un fichier JSON avec tous les settings

**Endpoint** : `GET /api/v1/settings/export`

**Format du fichier** :
```json
{
  "settings": [
    {
      "key": "customMeasures",
      "value": ["Certification ISO 27001", "Surveillance 24/7"]
    },
    {
      "key": "customReasons",
      "value": ["Intérêt légitime", "Consentement"]
    },
    ...
  ],
  "exportDate": "2026-02-18T10:30:00Z",
  "version": "1.0"
}
```

**Fonction** : `handleExportSettingsJsonFile()`

**Fichier** : `packages/registr_frontend/src/features/settings/utils/downloadJSONfile.ts`

### 11.2 Import de settings

**Bouton** : "Importer les paramètres"

**Action** : Upload d'un fichier JSON pour restaurer les settings

**Endpoint** : `POST /api/v1/settings/import`

**Body** : Contenu du fichier JSON

**Validation** :
- Type de fichier : `application/json` ou `text/plain`
- Structure du JSON : Validée côté backend

**Fonction** : `handleImportJson()`

**Code** :
```typescript
const handleImportJson = async (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!authorizedFileTypes.includes(file.type)) {
    notif.show(t('settings:fileTypeError'), { severity: 'error' });
    return;
  }

  try {
    await baseFetch('/api/v1/settings/import', {
      method: 'POST',
      body: await file.text(),
    });

    await queryClient.resetQueries();
    await queryClient.invalidateQueries({
      queryKey: ['setting'],
      refetchType: 'all',
    });
    notif.show(t('settings:importSuccess'), { severity: 'success' });
  } catch {
    notif.show(t('settings:importError'), { severity: 'error' });
  }
};
```

**Effet** :
- Remplace tous les settings existants
- Invalide le cache React Query
- Recharge toutes les données

**Use Case** : `SettingsImportUseCase`

**Fichier** : `packages/registr_backend/src/application/use-case/settings/settings.import.use-case.ts`

---

## 12. Cas d'usage détaillés

### 12.1 Cas d'usage 1 : Ajout d'une mesure de sécurité personnalisée

**Contexte** : Un utilisateur crée un traitement et veut ajouter "Certification ISO 27001" comme mesure de sécurité.

**Étapes** :
1. L'utilisateur arrive à l'étape 8 (Mesures de sécurité)
2. Il tape "Certification ISO 27001" dans la barre de recherche
3. L'option "Ajouter : Certification ISO 27001" apparaît
4. Il clique dessus
5. Le composant détecte une nouvelle valeur
6. Appel à `useUpdateSetting()` :
   ```typescript
   updateSetting({
     key: 'customMeasures',
     value: [...existingMeasures, 'Certification ISO 27001']
   });
   ```
7. Requête `PATCH /api/v1/settings/customMeasures`
8. Backend met à jour la base de données
9. Réponse 200 OK
10. Invalidation du cache React Query
11. Rechargement automatique des settings
12. "Certification ISO 27001" apparaît dans la liste des mesures sélectionnées
13. L'option est maintenant disponible pour tous les traitements futurs

### 12.2 Cas d'usage 2 : Utilisation d'une mesure personnalisée existante

**Contexte** : Un autre utilisateur crée un traitement et veut utiliser "Certification ISO 27001" (déjà ajoutée).

**Étapes** :
1. L'utilisateur arrive à l'étape 8
2. Il tape "Certification" dans la barre de recherche
3. "Certification ISO 27001" apparaît dans les suggestions (depuis les settings)
4. Il clique dessus
5. La mesure est ajoutée à la sélection
6. Pas d'appel à `useUpdateSetting()` (la mesure existe déjà)

### 12.3 Cas d'usage 3 : Ajout d'une donnée personnelle sensible

**Contexte** : Un utilisateur veut ajouter "Données biométriques" comme donnée personnelle sensible.

**Étapes** :
1. L'utilisateur arrive à l'étape 5 (Données collectées)
2. Il tape "Données biométriques" dans la barre de recherche (section Données personnelles)
3. L'option "Ajouter : Données biométriques" apparaît
4. Il clique dessus
5. La donnée est ajoutée à la sélection
6. Il clique sur le menu contextuel de la donnée
7. Il sélectionne "Marquer comme sensible"
8. Le composant met à jour l'état local avec `isSensitive: true`
9. Appel à `useUpdateSetting()` :
   ```typescript
   updateSetting({
     key: 'customPersonalData',
     value: [
       ...existingData,
       { name: 'Données biométriques', isSensitive: true }
     ]
   });
   ```
10. Backend met à jour la base de données
11. La donnée est maintenant disponible avec son attribut `isSensitive`

### 12.4 Cas d'usage 4 : Export et import de settings

**Contexte** : Une organisation veut sauvegarder ses settings et les restaurer sur un autre environnement.

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. Il clique sur "Exporter les paramètres"
3. Téléchargement d'un fichier `settings-2026-02-18.json`
4. Sur un autre environnement, il clique sur "Importer les paramètres"
5. Il sélectionne le fichier `settings-2026-02-18.json`
6. Upload du fichier
7. Backend valide et importe les settings
8. Tous les settings sont remplacés
9. Cache React Query invalidé
10. Interface mise à jour avec les nouveaux settings

### 12.5 Cas d'usage 5 : Modification d'un setting depuis la page Settings

**Contexte** : Un administrateur veut renommer une mesure de sécurité personnalisée.

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. Il clique sur "Modifier" à côté de "customMeasures"
3. Une modale s'ouvre avec la liste des mesures
4. Il modifie "Mesure 1" en "Audit de sécurité"
5. Il clique sur "Enregistrer"
6. Appel à `useUpdateSetting()`
7. Backend met à jour la base de données
8. Cache invalidé
9. Tous les composants utilisant cette mesure sont mis à jour

---

## 13. Diagrammes

### 13.1 Diagramme de séquence : Ajout d'une option personnalisée

```
Utilisateur    Composant    useUpdateSetting    API Backend    Base de données
    |              |               |                  |                |
    |-- Saisit --> |               |                  |                |
    |   "ISO"      |               |                  |                |
    |              |               |                  |                |
    |              |-- Détecte     |                  |                |
    |              |   nouvelle    |                  |                |
    |              |   valeur      |                  |                |
    |              |               |                  |                |
    |              |-- mutateAsync -----------------> |                |
    |              |               |   PATCH /settings|                |
    |              |               |                  |                |
    |              |               |                  |-- UPDATE ----> |
    |              |               |                  |                |
    |              |               |                  |<-- OK -------- |
    |              |               |                  |                |
    |              |               |<-- 200 OK ------ |                |
    |              |               |                  |                |
    |              |<-- onSuccess  |                  |                |
    |              |   (invalidate)|                  |                |
    |              |               |                  |                |
    |              |-- Refetch --> |                  |                |
    |              |               |   GET /settings  |                |
    |              |               |                  |                |
    |              |               |                  |-- SELECT ----> |
    |              |               |                  |                |
    |              |               |                  |<-- Data ------ |
    |              |               |                  |                |
    |              |               |<-- Data -------- |                |
    |              |               |                  |                |
    |              |<-- Nouvelles  |                  |                |
    |              |   données     |                  |                |
    |              |               |                  |                |
    |<-- Affiche --+               |                  |                |
    |   "ISO"      |               |                  |                |
```

### 13.2 Diagramme de flux : Fusion des options

```
┌─────────────────────────────────────────────────────────────────┐
│ Composant (ex: SecurityStep)                                    │
└─────────────────────────────────────────────────────────────────┘
                          |
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ Options standards (hardcodées)                                  │
│ ['Accès contrôlé', 'Gestion des autorisations', ...]           │
└─────────────────────────────────────────────────────────────────┘
                          |
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ useGetOneSetting('customMeasures')                              │
└─────────────────────────────────────────────────────────────────┘
                          |
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ Options personnalisées (depuis settings)                        │
│ ['Certification ISO 27001', 'Surveillance 24/7']                │
└─────────────────────────────────────────────────────────────────┘
                          |
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ Fusion : [...standards, ...custom]                              │
│ ['Accès contrôlé', ..., 'Certification ISO 27001', ...]         │
└─────────────────────────────────────────────────────────────────┘
                          |
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ Affichage dans SearchableOptionsGroup                           │
└─────────────────────────────────────────────────────────────────┘
```

### 13.3 Diagramme d'architecture : Cache React Query

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Query Cache                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ['settings'] → [                                               │
│    { key: 'customMeasures', value: [...] },                     │
│    { key: 'customReasons', value: [...] },                      │
│    ...                                                          │
│  ]                                                              │
│                                                                 │
│  ['settings', 'customMeasures'] → {                             │
│    key: 'customMeasures',                                       │
│    value: ['Certification ISO 27001', 'Surveillance 24/7']      │
│  }                                                              │
│                                                                 │
│  ['settings', 'customReasons'] → {                              │
│    key: 'customReasons',                                        │
│    value: ['Intérêt légitime', 'Consentement']                  │
│  }                                                              │
│                                                                 │
│  ...                                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                          ↑ ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Composants React                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SecurityStep → useGetOneSetting('customMeasures')              │
│  PurposeStep → useGetOneSetting('customReasons')                │
│  CategoriesStep → useGetOneSetting('customCategories')          │
│  ...                                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. Bonnes pratiques

### 14.1 Vérification avant ajout

**Problème** : Éviter les doublons dans les settings

**Solution** : Vérifier si la valeur existe déjà avant d'ajouter

**Code** :
```typescript
const customSelections = selected.filter(
  (item) =>
    !standardOptions.includes(item) &&
    (!customData?.value ||
      !Array.isArray(customData.value) ||
      !customData.value.includes(item))
);

if (customSelections.length > 0) {
  updateSetting({
    key: 'customKey',
    value: [...(Array.isArray(customData?.value) ? customData.value : []), ...customSelections],
  });
}
```

### 14.2 Gestion des types

**Problème** : La valeur d'un setting peut être de différents types

**Solution** : Vérifier le type avant utilisation

**Code** :
```typescript
// Vérifier si c'est un tableau
const options = Array.isArray(data?.value) ? data.value : [];

// Vérifier si c'est un tableau d'objets avec 'name'
const dataOptions = Array.isArray(data?.value) 
  ? data.value.filter((d) => typeof d === 'object' && 'name' in d)
  : [];
```

### 14.3 Gestion des erreurs

**Problème** : Une erreur lors de la mise à jour d'un setting ne doit pas bloquer l'utilisateur

**Solution** : Utiliser try/catch et afficher un message d'erreur

**Code** :
```typescript
try {
  await updateSetting({
    key: 'customMeasures',
    value: newValue
  });
} catch (error) {
  console.error('Error updating setting:', error);
  // Afficher un message d'erreur à l'utilisateur
}
```

### 14.4 Optimisation des requêtes

**Problème** : Éviter les requêtes inutiles

**Solution** : Utiliser le cache React Query et désactiver le refetch automatique

**Code** :
```typescript
{
  refetchInterval: false,
  refetchOnWindowFocus: false,
}
```

### 14.5 Invalidation du cache

**Problème** : Mettre à jour l'interface après une modification

**Solution** : Invalider le cache React Query dans `onSuccess`

**Code** :
```typescript
onSuccess: async () => {
  client.invalidateQueries({
    queryKey: ['settings'],
  });
}
```

---

## 15. Annexes

### 15.1 Récapitulatif des fichiers importants

#### Frontend

| Fichier | Description |
|---------|-------------|
| `src/features/treatments/hooks/useGetSettings.ts` | Hook pour récupérer les settings |
| `src/features/treatments/hooks/useUpdateSettings.ts` | Hook pour mettre à jour les settings |
| `src/features/settings/pages/SettingsPage.tsx` | Page de gestion des settings |
| `src/features/settings/components/SettingsTable.tsx` | Table des settings |
| `src/features/treatments/components/form-steps/*.tsx` | Étapes du formulaire utilisant les settings |

#### Backend

| Fichier | Description |
|---------|-------------|
| `src/domain/settings.entity.ts` | Entité Settings |
| `src/domain/settings.repository.ts` | Interface Repository |
| `src/framework/node/settings.node.repository.ts` | Implémentation Repository |
| `src/application/transport/settings/*.route.ts` | Routes API |
| `src/application/use-case/settings/*.use-case.ts` | Use Cases |
| `src/framework/node/settings.seeder.ts` | Données initiales |

### 15.2 Tableau récapitulatif : Où sont utilisés les settings ?

| Setting Key | Étape | Composant | Type de valeur |
|-------------|-------|-----------|----------------|
| `customTreatmentTypes` | 1 | TitleStep.tsx | `string[]` |
| `customReasons` | 3 | PurposeStep.tsx | `string[]` |
| `customCategories` | 4 | CategoriesStep.tsx | `string[]` |
| `customPersonalData` | 5 | DataStep.tsx | `CustomPersonalData[]` |
| `customEconomicInformation` | 5 | DataStep.tsx | `CustomPersonalData[]` |
| `customDataSources` | 5 | DataStep.tsx | `string[]` |
| `customLegalBase` | 6 | LegalBaseStep.tsx | `string[]` |
| `customDataAccess` | 7 | SharedDataStep.tsx | `string[]` |
| `customSharedData` | 7 | SharedDataStep.tsx | `string[]` |
| `customMeasures` | 8 | SecurityStep.tsx | `string[]` |
| `customTreatmentTypes` | Table | TreatmentsTable.tsx | `string[]` |

### 15.3 Exemples de valeurs de settings

#### customMeasures (string[])

```json
[
  "Certification ISO 27001",
  "Surveillance 24/7",
  "Plan de continuité d'activité",
  "Conformité PCI-DSS"
]
```

#### customPersonalData (CustomPersonalData[])

```json
[
  {
    "name": "Données biométriques",
    "isSensitive": true
  },
  {
    "name": "Données de localisation",
    "isSensitive": false
  },
  {
    "name": "Données de santé",
    "isSensitive": true
  }
]
```

#### customReasons (string[])

```json
[
  "Intérêt légitime",
  "Consentement",
  "Obligation légale",
  "Exécution d'un contrat"
]
```

### 15.4 Commandes utiles

#### Créer un nouveau setting (via API)

```bash
curl -X PATCH http://localhost:3000/api/v1/settings/customMeasures \
  -H "Content-Type: application/json" \
  -d '{"value": ["Mesure 1", "Mesure 2", "Mesure 3"]}'
```

#### Récupérer un setting (via API)

```bash
curl http://localhost:3000/api/v1/settings/customMeasures
```

#### Récupérer tous les settings (via API)

```bash
curl http://localhost:3000/api/v1/settings
```

### 15.5 Checklist de développement

**Avant d'ajouter un nouveau setting** :

☐ Ajouter la clé dans `SettingKey` (frontend)
☐ Ajouter la clé dans `SettingsKey` (backend)
☐ Ajouter la clé dans `settingsKeysSchema` (backend)
☐ Créer le hook `useGetOneSetting` dans le composant
☐ Implémenter la logique de fusion (standards + custom)
☐ Implémenter la logique d'ajout (détection + update)
☐ Tester l'ajout d'une valeur personnalisée
☐ Tester la réutilisation de la valeur
☐ Vérifier l'invalidation du cache
☐ Documenter le nouveau setting

### 15.6 FAQ

**Q : Pourquoi les settings sont-ils globaux et non par utilisateur ?**

R : Les settings sont conçus pour être partagés au niveau de l'organisation. Cela permet à tous les utilisateurs de bénéficier des mêmes options personnalisées et d'assurer la cohérence des données.

**Q : Peut-on supprimer une option personnalisée ?**

R : Oui, via la page Settings (`/dashboard/settings`). Cependant, cela peut causer des problèmes si l'option est utilisée dans des traitements existants.

**Q : Que se passe-t-il si deux utilisateurs ajoutent la même option en même temps ?**

R : Le dernier à sauvegarder écrase le premier. Pour éviter cela, il faudrait implémenter un système de verrouillage optimiste ou de merge.

**Q : Les settings sont-ils versionnés ?**

R : Non, il n'y a pas de système de versioning actuellement. Chaque mise à jour écrase la valeur précédente.

**Q : Peut-on avoir des settings différents par environnement (dev, prod) ?**

R : Oui, chaque environnement a sa propre base de données et donc ses propres settings. L'export/import permet de synchroniser les settings entre environnements.

**Q : Comment migrer les settings d'une ancienne version ?**

R : Utiliser l'export/import ou créer une migration de base de données.

---

**Fin du document**

Ce document fournit une vue complète du système de settings dans l'application Registr.
