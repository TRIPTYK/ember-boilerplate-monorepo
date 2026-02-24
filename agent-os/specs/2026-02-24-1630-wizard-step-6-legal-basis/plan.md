# Plan — Étape 6 : Base légale

## Context

L'étape 6 du formulaire de traitement RGPD permet de sélectionner les bases légales (Article 6 du RGPD).
Le champ `legalBase` est déjà défini dans le changeset, le schéma Zod, et les mocks HTTP.
L'intégration settings (customLegalBase) est hors scope et reportée.

## Tasks

### Task 1 : Créer `step-6-legal-basis.gts`
- Signature : `Args: { changeset: TreatmentChangeset }` (pas de `@form`)
- Layout : carte unique centrée, `max-w-2xl mx-auto`
- Réutilise `SearchableOptionsGroup`
- 5 options prédéfinies (bases RGPD sans intérêt légitime)
- Conversion `legalBase` objets ↔ noms strings

### Task 2 : Ajouter `step6Schema`
- `treatment-validation.ts` : `export const step6Schema = () => object({ legalBase: array(draftLegalBaseSchema).optional() })`

### Task 3 : Étendre `treatment-form.gts` à 6 étapes
- Étendre validations, steps[], getters isStep6, isLastStep, canGoNext

### Task 4 : Traductions
- `fr-fr.yaml` et `en-us.yaml` : ajouter `form.step6` et `form.progress.step6`
