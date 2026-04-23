# References

## Spécification fonctionnelle originale

- `references/SPECIFICATIONS_PAGE_PARAMETRES.md` — spec détaillée (table, filtres, pagination, CRUD, cas d'usage) qui a guidé l'implémentation initiale

## Implémentations similaires

### Treatments index page

- Route : `@libs/treatment-front/src/routes/dashboard/treatments/index.gts`
- Template : `@libs/treatment-front/src/routes/dashboard/treatments/index-template.gts`
- Pattern : Route class vide + template TOC qui instancie le composant de page

### PrecisionsModal (usage TpkModal)

- `@libs/treatment-front/src/components/ui/precisions-modal.gts`
- Montre l'usage de `<TpkModal>` avec le named block `<M.Content>`

### Menu dashboard

- `@apps/front/app/templates/dashboard.gts` — getter `menuItems` avec icônes SVG inline
