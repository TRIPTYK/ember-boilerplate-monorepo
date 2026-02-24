# Plan — Étape 8 : Mesures de sécurité

## Context

Dernière étape du wizard. 13 mesures RGPD prédéfinies, carte unique centrée.

---

## Task 1 : Save spec documentation ✓

## Task 2 : Changeset + validation (securitySetup + step8Schema)

- `@libs/treatment-front/src/changesets/treatment.ts` : ajouter `securitySetup`
- `@libs/treatment-front/src/components/forms/treatment-validation.ts` : ajouter `securitySetup` dans schemas + `step8Schema()`

## Task 3 : Créer `step-8-security.gts`

- Carte unique `max-w-2xl mx-auto`
- Titre + bouton info SVG → TpkModal "Cadre légal"
- SearchableOptionsGroup (13 mesures) + PrecisionsModal
- Pas de `@form`

## Task 4 : Étendre `treatment-form.gts` à 8 étapes

- Importer `Step8Security`, `step8Schema`
- `stepFromQP <= 8`, `isLastStep === 8`, `canGoNext < 8`

## Task 5 : Traductions

- `form.step8.*` + `form.progress.step8`

## Task 6 : Mocks HTTP

- Ajouter `securitySetup: []` dans les 4 mocks

## Fichiers

| Fichier | Action |
|---------|--------|
| `changesets/treatment.ts` | + `securitySetup` |
| `forms/treatment-validation.ts` | + `step8Schema` |
| `forms/treatment-form/step-8-security.gts` | Créer |
| `forms/treatment-form.gts` | + step 8 |
| `translations/treatments/fr-fr.yaml` | + step8 |
| `translations/treatments/en-us.yaml` | + step8 |
| `http-mocks/treatments.ts` | + `securitySetup: []` |
