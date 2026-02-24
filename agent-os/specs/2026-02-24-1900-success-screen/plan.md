# Plan — Page de succès après finalisation du wizard

## Context

Afficher une page de confirmation visuelle après la finalisation réussie d'un traitement (clic "Terminer" étape 8), au lieu de rediriger directement vers la liste.

## Tasks

### Task 1 — spec docs (ce fichier)

### Task 2 — `success-screen.gts`
Composant standalone `@libs/treatment-front/src/components/views/success-screen.gts`
- Args: `onCreateNewFlow`, `onFinish`
- Fond sombre `bg-neutral`, coche décorative `✓` absolute, titre uppercase, 2 boutons TpkButton

### Task 3 — `create-template.gts`
- `@tracked showSuccessScreen = false`
- `@tracked changeset` (pour reset via nouvelle instance)
- `handleFinish` → save + `showSuccessScreen = true`
- `handleCreateNewFlow` → reset changeset + `showSuccessScreen = false`
- Template conditionnel `{{#if}} SuccessScreen {{else}} TreatmentForm {{/if}}`

### Task 4 — `edit-template.gts`
- Mêmes changements, mais `handleCreateNewFlow` → `router.transitionTo('dashboard.treatments.create')`

### Task 5 — Traductions
Ajouter `successScreen.{title, createNewFlow, finishFlowCreation}` dans fr-fr et en-us.
