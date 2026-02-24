# Standards for Étape 6 Base légale

## frontend/form-pattern

Pattern des étapes de formulaire multi-steps :
- Chaque étape reçoit `@changeset: TreatmentChangeset`
- Les étapes avec champs TpkInput reçoivent aussi `@form={{F}}`
- Le composant `TreatmentForm` orchestre les étapes via `currentStep`
- Validation par `step{N}Schema` Zod au clic "Suivant"

## frontend/schema-changeset

- Chaque step a son propre `step{N}Schema()` dans `treatment-validation.ts`
- Les schémas de brouillon utilisent `.optional()` sur tous les champs
- `draftLegalBaseSchema` est déjà défini et réutilisé

## frontend/translations

- Structure YAML : `form.step{N}.title`, `form.step{N}.labels.*`, `form.progress.step{N}`
- Deux fichiers : `fr-fr.yaml` et `en-us.yaml`
