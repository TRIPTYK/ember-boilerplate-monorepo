# Étape 7 – Partage des données — Shaping Notes

## Scope

Étape 7 du wizard de création/édition d'un traitement RGPD.
Permet de documenter qui a accès aux données, avec quels tiers elles sont partagées, et les transferts hors UE.

**3 sections côte à côte** :
1. **Accès aux données** (`dataAccess`) — SearchableOptionsGroup + PrecisionsModal
2. **Partage avec des tiers** (`sharedData`) — SearchableOptionsGroup + PrecisionsModal
3. **Transferts hors UE** — Switch + 4 champs `recipient.*` (TpkInputPrefab)

## Decisions

- Sections 1 & 2 : même pattern que steps 3, 4, 6 (SearchableOptionsGroup + PrecisionsModal)
- Section 3 : switch HTML natif `<input type="checkbox" class="toggle">` — pas de `ember-truth-helpers`
- `{{#if this.areDataExportedOutsideEU}}` pour le formulaire conditionnel — pas d'`eq`
- `@form={{F}}` passé depuis TreatmentForm car section 3 a des TpkInputPrefab (`recipient.*`)
- Settings API (`customDataAccess`, `customSharedData`) : **hors scope** — `@allowCustomValues={{true}}` suffit
- `recipient` shape mis à jour : `{fullName, country, guaranteeTypes, linkToDoc}` (remplace ancienne structure adresse)
- Validation conditionnelle avec Zod `.superRefine()` : recipient fields obligatoires si `areDataExportedOutsideEU=true`
- Chips : `badge badge-primary` (standard SearchableOptionsGroup)
- Pas de kebab menu (pas de sensibilité ici)

## Context

- **Visuals:** Wireframes dans SPECIFICATIONS_ETAPE_7_FORMULAIRE.md (sections 14.1–14.4)
- **References:** step-3-purposes.gts, step-4-categories.gts (SearchableOptionsGroup + PrecisionsModal), step-5-data.gts (TpkInputPrefab dot-notation), step-2-general-info.gts (recipient form structure)
- **Product alignment:** Conformité RGPD — Articles 13-14, 28, 44-50

## Standards Applied

- frontend/form-pattern — Zod + ImmerChangeset + TpkForm
- frontend/ember-input-composition — TpkInputPrefab via @form
- frontend/tpk-form-injection — @changeset + @mandatory auto-injectés, @form.TpkInputPrefab pour champs texte
- frontend/ember-input-validation-yields — dot-notation @validationField pour champs imbriqués
