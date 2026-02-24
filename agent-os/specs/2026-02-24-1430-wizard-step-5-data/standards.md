# Standards for Wizard Step 5 — Données

The following standards apply to this work.

---

## frontend/form-pattern

Forms use Zod validation + ImmerChangeset + TpkForm.

**Patterns clés pour step 5 :**
- `step5Schema()` dans `treatment-validation.ts` — factory function sans `IntlService` (validation optionnelle, pas de message d'erreur personnalisé)
- Le composant `Step5Data` reçoit `@changeset` uniquement (pas de `@form` car pas de composants TpkForm yielded directement)
- `treatment-form.gts` orchestre : ajout de step 5 dans le tableau `steps[]`, mise à jour de `currentValidationSchema`, ajout du rendu conditionnel `{{#if this.isStep5}}`

---

## frontend/schema-changeset

**Mises à jour requises dans `changesets/treatment.ts` :**

```typescript
// Remplacer ces champs obsolètes :
personalData?: { name?: string; additionalInformation?: string }[];
financialData?: { name?: string; additionalInformation?: string }[];
dataSource?: string[];

// Par ces champs alignés sur la spec :
personalDataGroup?: {
  data: { name: Array<{ name: string; isSensitive: boolean }> };
  conservationDuration?: string;
};
financialDataGroup?: {
  data: { name: Array<{ name: string; isSensitive: boolean }> };
  conservationDuration?: string;
};
dataSources?: Array<{ name: string; additionalInformation?: string }>;
```

Le schéma WarpDrive (`schemas/treatments.ts`) a déjà `personalDataGroup` et `financialDataGroup` correctement définis. Il faudra aussi ajouter `dataSources` et supprimer `dataSource`.

---

## frontend/translations

**Nouvelles clés à ajouter dans `@apps/front/translations/treatments/{locale}.yaml` :**

```yaml
form:
  step5:
    title: 'Données'
    labels:
      firstQuestion: 'Quelles données personnelles collectez-vous ?'
      secondQuestion: "Quelles informations d'ordre économique et financier récoltez-vous ?"
      thirdQuestion: 'Quelle est la source des données ?'
      conservationDuration: 'Durée de conservation'
      conservationDurationPlaceholder: 'Ex: 2 ans'
      showPrecisions: 'Précisions'
      precisionDetails: 'Précisions sur les éléments sélectionnés'
      searchPlaceholder: 'Rechercher ou ajouter...'
      noSourcesSelected: 'Aucune source sélectionnée.'
      markAsSensitive: 'Marquer comme sensible'
      markAsNotSensitive: 'Marquer comme non sensible'
      delete: 'Supprimer'
      save: 'Enregistrer'
      cancel: 'Annuler'
  progress:
    step5: 'Données'
```

---

## frontend/ember-input-composition

Pour le champ "Durée de conservation" (champ texte simple hors `TpkForm`), utiliser le composant standalone avec `@changeset` explicite :

```hbs
<TpkValidationInputPrefab
  @label={{t "treatments.form.step5.labels.conservationDuration"}}
  @changeset={{@changeset}}
  @validationField="personalDataGroup.conservationDuration"
/>
```

Ou plus simplement `TpkInput` basique si pas de validation required (le champ est optionnel).

---

## frontend/tpk-form-injection

Le composant `Step5Data` n'utilise pas de `@form` yielded car il gère ses propres interactions (chips avec sensibilité, champs de durée). Les champs de durée utiliseront des composants standalone ou du HTML natif simple.
