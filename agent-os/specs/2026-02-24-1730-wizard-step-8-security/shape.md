# Étape 8 – Mesures de sécurité — Shaping Notes

## Scope

Étape 8 et **dernière étape** du wizard. Permet de documenter les mesures de sécurité RGPD (Article 32).
Structure simple : une carte unique centrée (`max-w-2xl mx-auto`).

**Éléments** :
1. Titre avec icône info → ouvre une modale "Cadre légal"
2. `SearchableOptionsGroup` — 13 mesures prédéfinies
3. Bouton "Précisions" → `PrecisionsModal`

## Decisions

- Même pattern que step 6 (carte unique centrée, SearchableOptionsGroup, PrecisionsModal)
- Pas de `@form` (pas de text inputs dans cette étape)
- Info modal inline dans le composant avec `TpkModal` (pas de composant UI séparé)
- Icône info : SVG inline `information-circle` (heroicons)
- Champ : `securitySetup: Array<{name, additionalInformation}>` (nouveau) — `securityMeasures: string[]` existant conservé intact
- Settings API hors scope — `@allowCustomValues={{true}}`
- `isLastStep === 8`, `canGoNext < 8`

## Context

- **Visuals:** Wireframes dans SPECIFICATIONS_ETAPE_8_FORMULAIRE.md (section 15)
- **References:** step-6-legal-basis.gts (SearchableOptionsGroup simple + PrecisionsModal), step-4-categories.gts
- **Product alignment:** Conformité RGPD — Article 32 sécurité du traitement

## Standards Applied

- frontend/form-pattern — Zod + ImmerChangeset + TpkForm
- frontend/ember-input-composition — pas de TpkInputPrefab ici (pas de text inputs)
