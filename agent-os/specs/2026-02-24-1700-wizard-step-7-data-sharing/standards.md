# Standards — Étape 7 : Partage des données

## frontend/form-pattern
Zod + ImmerChangeset + TpkForm. Chaque étape a son propre schéma Zod (`step7Schema`). La validation est déclenchée dans `validateCurrentStep()` dans TreatmentForm.

## frontend/ember-input-composition
Les champs TpkInputPrefab sont injectés via `@form={{F}}` depuis TreatmentForm. Utilisé pour les champs `recipient.*` dans la section 3.

## frontend/tpk-form-injection
`@changeset` et `@mandatory` sont auto-injectés par TpkForm. Les champs imbriqués (`recipient.fullName`) utilisent la dot-notation dans `@validationField`.

## frontend/ember-input-validation-yields
Base component yields — `hasError`, `firstError`, `errors`, `mandatory`. Utilisé par TpkInputPrefab pour afficher les erreurs de validation.
