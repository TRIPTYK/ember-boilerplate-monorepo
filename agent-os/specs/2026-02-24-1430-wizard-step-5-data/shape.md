# Wizard Step 5 — Données (Data) — Shaping Notes

## Scope

Implémenter l'étape 5 du formulaire de traitement RGPD : **"Quelles données collectez-vous ?"**

L'étape est divisée en 3 sections disposées côte à côte (layout 3 colonnes) :
1. **Section 1 – Données personnelles** : sélection multi-choix avec marquage de sensibilité par chip
2. **Section 2 – Données financières** : idem, mais toutes les données sont automatiquement marquées comme sensibles
3. **Section 3 – Sources des données** : sélection multi-choix simple + modale de précisions

**Hors périmètre (à faire plus tard)** : intégration des paramètres (settings API) pour les options personnalisées persistantes (`customPersonalData`, `customEconomicInformation`, `customDataSources`). Les valeurs personnalisées restent en état local de session uniquement.

## Decisions

- **Nouveau composant `SearchableOptionsGroupData`** : variante de `SearchableOptionsGroup` gérant `{ name: string; isSensitive: boolean }[]` au lieu de `string[]`, avec chips colorés (bleu = non sensible, or = sensible) et bascule de sensibilité
- **Réutilisation de `PrecisionsModal`** pour la section 3 (identique à l'étape 4)
- **Layout 3 colonnes** avec le même gabarit que step-2-general-info (flexbox row)
- **Durée de conservation** : champ texte libre en bas de chaque section (sections 1 et 2 uniquement)
- **`dataSources`** remplace `dataSource: string[]` dans le changeset — passage d'objets `{ name, additionalInformation? }` comme `subjectCategoryPrecisions`
- **Alignement du changeset** : `personalDataGroup` et `financialDataGroup` remplacent `personalData` et `financialData` qui ne correspondaient pas encore à la spec finale
- **step5Schema** : validation optionnelle (brouillon = tout optionnel), pas de règle stricte côté client

## Context

- **Visuals:** Wireframes ASCII dans SPECIFICATIONS_ETAPE_5_FORMULAIRE.md (sections 15.1 à 15.5)
- **References:** Steps 3 & 4 (SearchableOptionsGroup + modales), Step 2 (layout 3 colonnes)
- **Product alignment:** Application Registr RGPD — conformité Article 5.1.c et 5.1.e

## Standards Applied

- `frontend/form-pattern` — pattern multi-étapes avec TpkForm + ImmerChangeset + Zod
- `frontend/schema-changeset` — mise à jour du changeset DraftTreatment et des schémas WarpDrive
- `frontend/translations` — ajout des clés `treatments.form.step5.*` dans les fichiers YAML
- `frontend/ember-input-composition` — composition des composants Triptyk pour le champ durée
