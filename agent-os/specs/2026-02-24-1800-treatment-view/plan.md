# Plan — Vue d'un traitement (Read-only)

## Context

Page de consultation d'un traitement RGPD (mode lecture seule).
Le route `view.gts` existe déjà et charge le traitement via WarpDrive `findRecord`.
Il manque la `view-template.gts` et le composant `TreatmentView`.

Boutons en scope : Retour + Modifier uniquement.

---

## Task 1 : Save spec documentation ✓

`agent-os/specs/2026-02-24-1800-treatment-view/`

---

## Task 2 : Update `schemas/treatments.ts`

Ajouter : `dataAccess`, `sharedData`, `securitySetup`, corriger `recipient`.

---

## Task 3 : Créer `treatment-view.gts`

`@libs/treatment-front/src/components/views/treatment-view.gts`

9 sections, tables DaisyUI, icône SVG pour données sensibles.

---

## Task 4 : Créer `view-template.gts`

`@libs/treatment-front/src/routes/dashboard/treatments/view-template.gts`

---

## Task 5 : Traductions

Ajouter `details.*` dans `fr-fr.yaml` et `en-us.yaml`.

---

## Task 6 : Update HTTP mocks

Enrichir le mock `id:'2'` avec des données complètes.

---

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `@libs/treatment-front/src/schemas/treatments.ts` | Modifier |
| `@libs/treatment-front/src/components/views/treatment-view.gts` | Créer |
| `@libs/treatment-front/src/routes/dashboard/treatments/view-template.gts` | Créer |
| `@apps/front/translations/treatments/fr-fr.yaml` | Modifier |
| `@apps/front/translations/treatments/en-us.yaml` | Modifier |
| `@libs/treatment-front/src/http-mocks/treatments.ts` | Modifier |
