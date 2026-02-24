# Étape 6 Base légale — Shaping Notes

## Scope

Ajout de l'étape 6 "Base légale" au formulaire de traitement RGPD.
L'étape permet de sélectionner une ou plusieurs des 6 bases légales du GDPR (Article 6).

## Decisions

- Réutiliser `SearchableOptionsGroup` (identique aux étapes 3 et 4)
- Pas de `@form` / `TpkInputPrefab` (aucun champ texte dans cette étape)
- Pas d'intégration settings (reportée)
- 5 options prédéfinies : toutes les bases RGPD sauf "intérêt légitime" (peut être ajouté comme valeur custom)
- `legalBase` stocke des objets `{ name, additionalInformation }` — conversion via getter `selectedLegalBaseNames`
- Layout carte unique centrée (pas de grille 3 colonnes comme step 5)

## Context

- **Visuals:** None
- **References:** step-3-purposes.gts, step-4-categories.gts, searchable-options-group.gts
- **Product alignment:** N/A

## Standards Applied

- frontend/form-pattern — pattern étapes du formulaire
- frontend/translations — structure i18n YAML
- frontend/schema-changeset — step schema Zod
