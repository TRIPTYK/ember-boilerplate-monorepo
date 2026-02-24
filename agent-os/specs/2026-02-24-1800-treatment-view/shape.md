# Vue d'un traitement — Shaping Notes

## Scope

Page de consultation read-only d'un traitement RGPD.
Accessible depuis la liste des traitements (bouton "Visualiser").
URL : `/dashboard/treatments/:treatment_id/view`

## Decisions

- Route `view.gts` déjà existante — fetche via `findRecord`
- Pas de `TableGenericPrefab` — tables DaisyUI natives
- `TpkButton` pour boutons Retour et Modifier
- Sections masquées si données vides (sauf Section 1 et Section 2 toujours affichées)
- `subjectCategoriesRows` : merge `dataSubjectCategories` (strings) + `subjectCategoryPrecisions` (objets)
- `schemas/treatments.ts` à mettre à jour (dataAccess, sharedData, securitySetup, recipient shape)
- Boutons : Retour + Modifier uniquement (export/archive hors scope)
- Titres de section : `# TITRE` uppercase avec trait horizontal DaisyUI

## Context

- **Visuals:** Wireframes dans SPECIFICATIONS_VUE_TRAITEMENT.md
- **References:** edit-template.gts, treatment-form.gts, status-chip.gts
- **Product alignment:** Article 30 RGPD — vue = preuve de conformité
