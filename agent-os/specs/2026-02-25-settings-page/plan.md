# Settings Page — Plan d'exécution

## Contexte

Page `/dashboard/settings` avec deux onglets :
1. **Paramètres** — CRUD des options personnalisées utilisées dans le wizard de traitement (11 clés : customReasons, customCategories, etc.)
2. **Entreprise** — Informations de l'organisation responsable, avec 3 sections distinctes :
   - Entité responsable
   - DPO interne (optionnel)
   - DPO externe (optionnel)

## Décisions

- **Onglet Entreprise** : 3 sections visuelles distinctes, un seul bouton "Enregistrer" global
- **API** : un seul endpoint `/api/v1/company` (GET + PATCH) retournant/acceptant l'objet Company complet
- **DPO interne et externe peuvent coexister** — flags `hasDPO` et `hasExternalDPO` contrôlent l'affichage des sections
- **Import/Export** : hors scope (reporté)
- **Pagination settings** : client-side (suffisant pour le volume attendu)

## Schéma Company

```ts
type Address = {
  streetAndNumber: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
};

type CompanyType = {
  hasExternalDPO: boolean;
  hasDPO: boolean;
  responsible: {
    fullName: string;
    entityNumber?: string;
    address: Address;
  };
  DPO?: {
    fullName: string;
    address: Address;
  };
  externalOrganizationDPO?: {
    fullName: string;
    entityNumber?: string;
    address: Address;
  };
};
```

## Tâches

### 1. Brancher la route sur SettingsPage (fix bloquant)
- `routes/dashboard/settings-template.gts` → rendre `<SettingsPage />` au lieu du stub `SettingTable`

### 2. Domaine Company
- `schemas/company.ts` — types `Address` et `CompanyType`
- `services/company.ts` — `load()` / `save(company)`
- `http-mocks/company.ts` — GET + PATCH in-memory
- `http-mocks/all.ts` — enregistrer le mock

### 3. CompanyForm (3 sections)
- `components/settings/company-form.gts` — remplace `dpo-form.gts`
- Section 1 : Entité responsable (fullName, entityNumber, address)
- Section 2 : DPO interne (toggle `hasDPO` + fullName + address)
- Section 3 : DPO externe (toggle `hasExternalDPO` + fullName + entityNumber + address)
- Un seul bouton "Enregistrer" en bas → PATCH global

### 4. Traductions FR + EN
- Supprimer la clé `dpo:` de `translations/settings/*.yaml`
- Ajouter `company:` avec `entity.*`, `internalDpo.*`, `externalDpo.*`, `common.*`

### 5. Intégration
- `settings-page.gts` → remplacer `DpoForm` par `CompanyForm`

### 6. Nettoyage
- Supprimer `components/tables/setting-table.gts` (stub)
- Supprimer dossier vide `routes/dashboard/settings/`
- Supprimer `components/settings/dpo-form.gts`

### 7. Test manuel
- Vérifier CRUD settings (création, édition, suppression, filtre, pagination)
- Vérifier onglet Entreprise (load, save, toggles DPO)
