# Plan — Étape 7 : Partage des données

## Context

L'étape 7 documente qui accède aux données, avec quels tiers elles sont partagées, et les transferts hors UE.
Patterns identiques aux étapes précédentes — mêmes remarques utilisateur appliquées.

---

## Task 1 : Save spec documentation ✓

Dossier : `agent-os/specs/2026-02-24-1700-wizard-step-7-data-sharing/`

---

## Task 2 : Mise à jour du changeset et des schémas de validation

**Fichier** : `@libs/treatment-front/src/changesets/treatment.ts`
- Ajouter `dataAccess?: Array<{name: string; additionalInformation?: string}>`
- Ajouter `sharedData?: Array<{name: string; additionalInformation?: string}>`
- Corriger `recipient` : `{fullName?, country?, guaranteeTypes?, linkToDoc?}` (remplace ancienne structure)

**Fichier** : `@libs/treatment-front/src/components/forms/treatment-validation.ts`
- Ajouter schéma `draftRecipientStep7Schema` / mettre à jour `recipient` dans `draftTreatmentSchema`
- Ajouter `dataAccess` et `sharedData` dans `treatmentSchema` et `draftTreatmentSchema`
- Exporter `step7Schema()` avec validation conditionnelle via `.superRefine()`

---

## Task 3 : Créer `step-7-data-sharing.gts`

**Fichier** : `@libs/treatment-front/src/components/forms/treatment-form/step-7-data-sharing.gts`

- Signature : `Args: { changeset: TreatmentChangeset; form: WithBoundArgs<...> }` (a des TpkInputPrefab)
- Layout : `grid grid-cols-1 md:grid-cols-3 gap-4`
- **Section 1** (`dataAccess`) :
  - `SearchableOptionsGroup` avec 6 options prédéfinies
  - `TpkButtonComponent` "Précisions" → ouvre `PrecisionsModal`
- **Section 2** (`sharedData`) :
  - Même structure que Section 1 avec 6 options différentes
- **Section 3** (`areDataExportedOutsideEU` + `recipient`) :
  - `<input type="checkbox" class="toggle toggle-primary">` pour le switch
  - `{{#if this.areDataExportedOutsideEU}}` pour le formulaire conditionnel
  - 4 champs `@form.TpkInputPrefab` : `recipient.fullName`, `recipient.country`, `recipient.guaranteeTypes`, `recipient.linkToDoc`
- Pas d'`ember-truth-helpers`, pas de kebab

---

## Task 4 : Étendre `treatment-form.gts` à 7 étapes

**Fichier** : `@libs/treatment-front/src/components/forms/treatment-form.gts`

- Importer `Step7DataSharing`, `step7Schema`
- `stepFromQP <= 7`, `isLastStep === 7`, `canGoNext < 7`
- Ajouter `isStep7`, `step7ValidationSchema`
- Ajouter step 7 dans `steps[]` avec label `treatments.form.progress.step7`
- Template : `{{#if this.isStep7}}<Step7DataSharing @form={{F}} @changeset={{@changeset}} />{{/if}}`
- Validation : data step 7 dans `validateCurrentStep`

---

## Task 5 : Traductions

**Fichiers** : `fr-fr.yaml` et `en-us.yaml`

Ajouter dans `form:` :
```yaml
step7:
  title: 'Étape 7 - Partage des données'
  section1:
    title: 'Accès aux données'
    question: 'Qui a accès aux données collectées ?'
    searchPlaceholder: 'Rechercher ou ajouter un type d''accès...'
    modalTitle: 'Détails de l''accès aux données'
    emptyMessage: 'Aucun accès sélectionné. Ajoutez des types d''accès pour ajouter des précisions.'
  section2:
    title: 'Partage avec des tiers'
    question: 'Les données sont-elles partagées avec des tiers ?'
    searchPlaceholder: 'Rechercher ou ajouter un type de partage...'
    modalTitle: 'Détails du partage des données'
    emptyMessage: 'Aucun partage sélectionné. Ajoutez des types de partage pour ajouter des précisions.'
  section3:
    title: 'Données hors UE'
    switchLabel: 'Les données sont exportées hors UE'
    recipientInfo: 'Informations sur le destinataire'
    recipientName: 'Nom du destinataire'
    recipientCountry: 'Pays du destinataire'
    guaranteeTypes: 'Types de garanties'
    linkToDoc: 'Lien vers le document'
  precisions: 'Précisions'
```

Ajouter dans `form.progress:` :
```yaml
step7: 'Partage des données'
```

---

## Task 6 : Mise à jour des mocks HTTP

**Fichier** : `@libs/treatment-front/src/http-mocks/treatments.ts`

- Ajouter `dataAccess: []`, `sharedData: []` dans les données mock
- Corriger `recipient: {}` avec la nouvelle structure (ou supprimer le champ `recipient` des mocks qui n'en ont pas)

---

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `@libs/treatment-front/src/changesets/treatment.ts` | Modifier (dataAccess, sharedData, fix recipient) |
| `@libs/treatment-front/src/components/forms/treatment-validation.ts` | Modifier (+ step7Schema) |
| `@libs/treatment-front/src/components/forms/treatment-form/step-7-data-sharing.gts` | Créer |
| `@libs/treatment-front/src/components/forms/treatment-form.gts` | Modifier (+ step 7) |
| `@apps/front/translations/treatments/fr-fr.yaml` | Modifier (+ step7) |
| `@apps/front/translations/treatments/en-us.yaml` | Modifier (+ step7) |
| `@libs/treatment-front/src/http-mocks/treatments.ts` | Modifier (dataAccess, sharedData) |
| `agent-os/specs/2026-02-24-1700-wizard-step-7-data-sharing/` | Créer |
