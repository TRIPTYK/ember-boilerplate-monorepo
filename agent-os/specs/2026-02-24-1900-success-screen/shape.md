# Page de succès — Shaping Notes

## Scope

Page de confirmation affichée après la finalisation réussie du wizard de traitement (8 étapes). Elle remplace la redirection immédiate vers la liste, pour confirmer visuellement que le traitement a été créé/modifié avec succès.

## Decisions

- **État géré dans les templates de route** (create-template / edit-template), pas dans TreatmentForm — respecte la séparation des responsabilités
- **Remontage du TreatmentForm** : utiliser `@tracked changeset` + bascule `showSuccessScreen` assure un re-mount complet du form (reset step state)
- **Fond sombre** : `bg-neutral text-neutral-content` (DaisyUI Nord theme) — évite les hardcoded colors
- **Coche décorative** : `text-neutral-content/10` pour la semi-transparence
- **"Créer un nouveau flux" depuis edit** → `transitionTo('dashboard.treatments.create')` (nouveau traitement, pas reset de l'existant)
- **Flash message** : le TreatmentForm affiche un flash après `@onFinish`, qui apparaît brièvement sur le success screen — comportement acceptable

## Context

- **Visuals:** Maquette ASCII dans SPECIFICATIONS_PAGE_SUCCES.md
- **References:** `create-template.gts`, `edit-template.gts`, `treatment-view.gts` (pattern TpkButton + DaisyUI)
- **Product alignment:** N/A (aucun fichier product/)
