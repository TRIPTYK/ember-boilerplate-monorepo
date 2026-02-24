# Plan — Wizard Step 5 : Données (Data)

**Spec:** `agent-os/specs/2026-02-24-1430-wizard-step-5-data/`
**Source:** `SPECIFICATIONS_ETAPE_5_FORMULAIRE.md`
**Hors périmètre:** Settings API (customPersonalData, customEconomicInformation, customDataSources)

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-02-24-1430-wizard-step-5-data/` with:
- **plan.md** — Ce plan complet
- **shape.md** — Notes de cadrage (scope, décisions, contexte)
- **standards.md** — Standards applicables et contenu
- **references.md** — Pointeurs vers les implémentations similaires étudiées

---

## Task 2: Créer le composant `SearchableOptionsGroupData`

**Fichier :** `@libs/treatment-front/src/components/ui/searchable-options-group-data.gts`

Ce composant est une variante de `SearchableOptionsGroup` pour gérer des données avec marquage de sensibilité.

**Interface :**
```typescript
interface SearchableOptionsGroupDataSignature {
  Args: {
    allOptions: string[];
    selected: Array<{ name: string; isSensitive: boolean }>;
    onSelect: (value: string) => void;
    onRemove: (name: string) => void;
    onToggleSensitivity: (name: string) => void;
    allowCustomValues?: boolean;
    placeholder?: string;
    isAutoSensitive?: boolean; // true pour les données financières
  };
}
```

**Comportement des chips :**
- Chip non sensible : fond bleu (`badge-primary`) + icône cadenas masquée au hover
- Chip sensible : fond or/warning (`badge-warning`) + icône bouclier toujours visible
- Au hover : affichage du bouton toggle sensibilité + bouton menu (3 points)
- Le bouton toggle bascule `isSensitive`
- Le bouton menu ouvre un petit dropdown avec : "Marquer comme sensible/non sensible" + "Supprimer"

**Implémentation simplifiée des chips :**
- Utiliser `@tracked openMenuFor: string | null = null` pour le menu contextuel
- Actions : `toggleSensitivity(name)`, `removeItem(name)`, `openMenu(name)`, `closeMenu()`
- Le menu se ferme en cliquant ailleurs (click outside ou en choisissant une option)

**Note :** Utiliser `TpkSelectCreate` (même que `SearchableOptionsGroup`) pour le champ de recherche.

---

## Task 3: Mettre à jour le Changeset et le Schéma WarpDrive

### 3a — `@libs/treatment-front/src/changesets/treatment.ts`

Dans l'interface `DraftTreatment`, **remplacer** :
```typescript
personalData?: { name?: string; additionalInformation?: string }[];
financialData?: { name?: string; additionalInformation?: string }[];
dataSource?: string[];
```
**Par :**
```typescript
personalDataGroup?: {
  data: { name: Array<{ name: string; isSensitive: boolean }> };
  conservationDuration?: string;
};
financialDataGroup?: {
  data: { name: Array<{ name: string; isSensitive: boolean }> };
  conservationDuration?: string;
};
dataSources?: Array<{ name: string; additionalInformation?: string }>;
```

### 3b — `@libs/treatment-front/src/schemas/treatments.ts`

Dans `TreatmentData`, **remplacer** `dataSource?: string[]` par `dataSources?: Array<{ name: string; additionalInformation?: string }>`.

Les champs `personalDataGroup` et `financialDataGroup` sont déjà correctement définis dans ce fichier.

---

## Task 4: Ajouter `step5Schema` dans `treatment-validation.ts`

**Fichier :** `@libs/treatment-front/src/components/forms/treatment-validation.ts`

**Ajouter les schémas :**
```typescript
export const sensitiveDataItemSchema = object({
  name: string().min(1),
  isSensitive: boolean(),
});

export const draftSensitiveDataItemSchema = object({
  name: string().optional(),
  isSensitive: boolean().optional(),
});

export const dataGroupSchema = object({
  data: object({
    name: array(sensitiveDataItemSchema).optional(),
  }),
  conservationDuration: string().optional(),
});

export const step5Schema = () =>
  object({
    personalDataGroup: object({
      data: object({ name: array(draftSensitiveDataItemSchema).optional() }),
      conservationDuration: string().optional(),
    }).optional(),
    financialDataGroup: object({
      data: object({ name: array(draftSensitiveDataItemSchema).optional() }),
      conservationDuration: string().optional(),
    }).optional(),
    dataSources: array(object({
      name: string().optional(),
      additionalInformation: string().optional(),
    })).optional(),
  });
```

**Mettre à jour** `draftTreatmentSchema` et `treatmentSchema` :
- Remplacer `personalData`, `financialData`, `dataSource` par les nouveaux champs
- Mettre à jour `DraftTreatmentData` et `TreatmentData` types exportés

---

## Task 5: Créer le composant `Step5Data`

**Fichier :** `@libs/treatment-front/src/components/forms/treatment-form/step-5-data.gts`

**Structure du composant :**

```typescript
const PREDEFINED_PERSONAL_DATA = [
  'Nom', 'Prénom', 'Email', 'Téléphone',
  'Données financières', 'Données de santé', 'Photographie',
];

const PREDEFINED_FINANCIAL_DATA = [
  'Comptes bancaires', 'IBAN ou RIB', 'Titulaire du compte',
  'Salaire', 'Dépenses', 'Prêts en cours',
  'Informations fiscales', 'Chiffre d\'affaires', 'Bilan financier',
];

const PREDEFINED_DATA_SOURCES = [
  'Employé', 'Agence intérim', 'Formulaire en ligne',
  'Fichiers clients', 'Réseaux sociaux', 'Cookies et trackers',
];
```

**Getters/Actions par section :**

*Section 1 — Données personnelles :*
- `get selectedPersonalData()` → `changeset.get('personalDataGroup')?.data?.name ?? []`
- `selectPersonalData(name: string)` → ajoute `{ name, isSensitive: false }` si absent
- `removePersonalData(name: string)` → filtre l'item
- `togglePersonalDataSensitivity(name: string)` → inverse `isSensitive`
- `get personalConservationDuration()` → `changeset.get('personalDataGroup')?.conservationDuration ?? ''`
- `updatePersonalConservationDuration(value: string)` → met à jour `personalDataGroup.conservationDuration`

*Section 2 — Données financières :*
- Idem mais avec `financialDataGroup`
- `selectFinancialData(name: string)` → ajoute `{ name, isSensitive: true }` (auto-sensible)
- `toggleFinancialDataSensitivity` reste disponible (déconseillé mais possible)

*Section 3 — Sources des données :*
- `get selectedSources()` → array de noms `string[]` depuis `dataSources`
- `get sourcesPrecisions()` → `dataSources` array complet
- `selectSource(name: string)` → ajoute `{ name, additionalInformation: '' }`
- `removeSource(name: string)` → filtre par nom
- `updateSourcesPrecisions(updated: ...)` → met à jour `dataSources`
- `@tracked isSourcesModalOpen = false`

**Template — Layout 3 colonnes :**
```hbs
<h4>{{t "treatments.form.step5.title"}}</h4>
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="card bg-base-100 shadow p-4 flex flex-col">
    <h5>{{t "treatments.form.step5.labels.firstQuestion"}}</h5>
    <SearchableOptionsGroupData ... />
    <div class="mt-auto pt-4">
      <!-- Champ durée de conservation -->
    </div>
  </div>
  <div class="card bg-base-100 shadow p-4 flex flex-col">
    <h5>{{t "treatments.form.step5.labels.secondQuestion"}}</h5>
    <SearchableOptionsGroupData @isAutoSensitive={{true}} ... />
    <div class="mt-auto pt-4">
      <!-- Champ durée de conservation -->
    </div>
  </div>
  <div class="card bg-base-100 shadow p-4 flex flex-col">
    <h5>{{t "treatments.form.step5.labels.thirdQuestion"}}</h5>
    <SearchableOptionsGroup ... />
    <TpkButtonPrefabComponent @label={{t "..."}} @onClick={{this.openSourcesModal}} />
    <PrecisionsModal ... />
  </div>
</div>
```

**Pour les champs durée de conservation**, utiliser une `<input type="text">` native ou `TpkInput` standalone (le champ est optionnel, pas de validation requise).

---

## Task 6: Mettre à jour `treatment-form.gts` pour intégrer l'étape 5

**Fichier :** `@libs/treatment-front/src/components/forms/treatment-form.gts`

**Changements :**
1. Importer `Step5Data` et `step5Schema`
2. Mettre à jour le constructor URL param range : `stepFromQP >= 1 && stepFromQP <= 5`
3. Ajouter dans `get steps()` :
   ```typescript
   { number: 5, label: this.intl.t('treatments.form.progress.step5'), status: this.getStepStatus(5) }
   ```
4. Ajouter getter `get isStep5() { return this.currentStep === 5; }`
5. Mettre à jour `get isLastStep() { return this.currentStep === 5; }`
6. Mettre à jour `get canGoNext() { return this.currentStep < 5; }`
7. Ajouter `get step5ValidationSchema() { return step5Schema(); }`
8. Mettre à jour `get currentValidationSchema()` : ajouter `case 5: return this.step5ValidationSchema`
9. Mettre à jour `validateCurrentStep()` : ajouter le bloc `else if (this.currentStep === 5)`
10. Ajouter dans le template : `{{#if this.isStep5}}<Step5Data @changeset={{@changeset}} />{{/if}}`

---

## Task 7: Mettre à jour les fichiers de traductions

**Fichiers :**
- `@apps/front/translations/treatments/fr-fr.yaml`
- `@apps/front/translations/treatments/en-us.yaml`

**Ajouts dans `form:`** :

```yaml
# fr-fr.yaml
  step5:
    title: 'Étape 5 - Données'
    labels:
      firstQuestion: 'Quelles données personnelles collectez-vous ?'
      secondQuestion: "Quelles informations d'ordre économique et financier récoltez-vous ?"
      thirdQuestion: 'Quelle est la source des données ?'
      conservationDuration: 'Durée de conservation'
      conservationDurationPlaceholder: 'Ex: 2 ans'
      showPrecisions: 'Précisions'
      precisionDetails: 'Précisions sur les éléments sélectionnés'
      searchPersonalPlaceholder: 'Rechercher une donnée personnelle...'
      searchFinancialPlaceholder: 'Rechercher une donnée financière...'
      searchSourcePlaceholder: 'Rechercher ou ajouter une source...'
      noSourcesSelected: 'Aucune source sélectionnée. Ajoutez des sources pour ajouter des précisions.'
      markAsSensitive: 'Marquer comme sensible'
      markAsNotSensitive: 'Marquer comme non sensible'
      delete: 'Supprimer'
      save: 'Enregistrer'
      cancel: 'Annuler'

# Dans form.progress:
  step5: 'Données'
```

---

## Séquence d'exécution recommandée

```
Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7
```

Tasks 2, 3 et 4 sont indépendantes et peuvent être faites en parallèle.
Task 5 dépend de 2, 3, 4.
Tasks 6 et 7 dépendent de 5.

---

## Fichiers touchés

| Fichier | Type de changement |
|---|---|
| `@libs/treatment-front/src/components/ui/searchable-options-group-data.gts` | Nouveau |
| `@libs/treatment-front/src/components/forms/treatment-form/step-5-data.gts` | Nouveau |
| `@libs/treatment-front/src/changesets/treatment.ts` | Mise à jour |
| `@libs/treatment-front/src/schemas/treatments.ts` | Mise à jour |
| `@libs/treatment-front/src/components/forms/treatment-validation.ts` | Mise à jour |
| `@libs/treatment-front/src/components/forms/treatment-form.gts` | Mise à jour |
| `@apps/front/translations/treatments/fr-fr.yaml` | Mise à jour |
| `@apps/front/translations/treatments/en-us.yaml` | Mise à jour |
