# Documentation des packages Ember Common UI

> Ce document décrit les composants disponibles dans les trois packages partagés et explique comment les utiliser.
> Tous les composants de base s'utilisent **obligatoirement** en mode composition (`as |X|`).

## Sommaire

- [Concepts clés](#concepts-clés)
- [Package `@triptyk/ember-input`](#package-triptykember-input)
- [Package `@triptyk/ember-input-validation`](#package-triptykember-input-validation)
- [Package `@triptyk/ember-ui`](#package-triptykember-ui)

---

## Concepts clés

### ImmerChangeset

Tous les composants de formulaire s'appuient sur `ImmerChangeset` (de `ember-immer-changeset`) pour gérer l'état du formulaire de manière immutable.

```ts
import { ImmerChangeset } from 'ember-immer-changeset';

this.changeset = new ImmerChangeset({
  firstName: '',
  email: '',
  birthDate: null,
});
```

### Zod (validation)

Les schémas de validation sont définis avec [Zod](https://zod.dev) et passés à `TpkForm` ou aux composants autonomes.

```ts
import { object, string, z } from 'zod';

const schema = object({
  firstName: string().min(1),
  email:     string().email(),
});
```

### Pattern de composition

Les composants de base yieldent des sous-composants pré-configurés que vous assemblez :

```hbs
{{! OBLIGATOIRE : utiliser la composition }}
<TpkInput @label="Prénom" @value={{this.value}} as |I|>
  <I.Label />
  <I.Input />
</TpkInput>
```

Les **prefabs** (`TpkValidationInputPrefab`, `TpkDashboard`, etc.) sont des versions pré-assemblées pour les cas courants — ils ne nécessitent pas de composition.

---

## Package `@triptyk/ember-input`

Composants UI de base, sans logique de validation ni de formulaire.

---

### `TpkInput`

```ts
import TpkInput from '@triptyk/ember-input/components/tpk-input';
```

Champ texte générique avec support de masque (IMask).

```hbs
<TpkInput
  @label="Prénom"
  @value={{this.firstName}}
  @onChange={{this.onFirstNameChange}}
  as |I|
>
  <I.Label />
  <I.Input />
</TpkInput>

{{! Avec masque }}
<TpkInput
  @label="IBAN"
  @value={{this.iban}}
  @mask="AA99 9999 9999 9999"
  @unmaskValue={{true}}
  @onChange={{this.onIbanChange}}
  as |I|
>
  <I.Label />
  <I.Input class="my-input" />
</TpkInput>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Label du champ |
| `@value` | `string \| number \| boolean \| null` | Non | Valeur courante |
| `@type` | `string` | Non | Type HTML (`text`, `email`, `password`…) |
| `@mask` | `string` | Non | Masque IMask |
| `@maskOptions` | `Record<string, unknown>` | Non | Options avancées IMask |
| `@unmaskValue` | `boolean` | Non | Retourner la valeur sans masque |
| `@placeholder` | `string` | Non | Placeholder |
| `@disabled` | `boolean` | Non | Désactiver le champ |
| `@min` / `@max` / `@step` | `number` | Non | Contraintes pour type `number` |
| `@onChange` | `(value, e) => void` | Non | Callback de changement |

**Yields :** `Input`, `Label`, `guid`, `changeEvent`

---

### `TpkTextarea`

```ts
import TpkTextarea from '@triptyk/ember-input/components/tpk-textarea';
```

Zone de texte avec compteur de caractères.

```hbs
<TpkTextarea
  @label="Description"
  @value={{this.description}}
  @maxLength={{500}}
  @onChange={{this.onDescriptionChange}}
  as |T|
>
  <T.Label />
  <T.Input />
  <span>{{T.charCount}} / {{T.maxLength}}</span>
</TpkTextarea>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Label |
| `@value` | `string` | Non | Valeur |
| `@placeholder` | `string` | Non | Placeholder |
| `@disabled` | `boolean` | Non | Désactiver |
| `@maxLength` | `number` | Non | Limite de caractères |
| `@onChange` | `(value, e) => void` | Non | Callback |

**Yields :** `Input`, `Label`, `guid`, `changeEvent`, `onChange`, `charCount`, `maxLength`

---

### `TpkSelect`

```ts
import TpkSelect from '@triptyk/ember-input/components/tpk-select';
```

Dropdown basé sur Ember Power Select. Supporte la recherche, la multi-sélection et le chargement asynchrone.

```hbs
<TpkSelect
  @label="Pays"
  @options={{this.countries}}
  @selected={{this.selectedCountry}}
  @searchEnabled={{true}}
  @searchField="name"
  @onChange={{this.onCountryChange}}
  as |S|
>
  <S.Option as |O|>
    {{O.option.name}}
  </S.Option>
</TpkSelect>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Label |
| `@options` | `unknown[]` | Oui | Liste des options |
| `@selected` | `unknown` | Non | Valeur sélectionnée |
| `@multiple` | `boolean` | Non | Multi-sélection |
| `@placeholder` | `string` | Non | Placeholder |
| `@searchEnabled` | `boolean` | Non | Activer la recherche |
| `@searchField` | `string` | Non | Propriété sur laquelle chercher |
| `@searchPlaceholder` | `string` | Non | Placeholder de recherche |
| `@search` | `(term, select) => unknown[]` | Non | Recherche asynchrone |
| `@allowClear` | `boolean` | Non | Bouton effacer |
| `@disabled` | `boolean` | Non | Désactiver |
| `@renderInPlace` | `boolean` | Non | Rendu en place (pas en portail) |
| `@onChange` | `(value, select, e) => void` | Oui | Callback |

**Yields :** `Option`

---

### `TpkSelectCreate`

```ts
import TpkSelectCreate from '@triptyk/ember-input/components/tpk-select-create';
```

Identique à `TpkSelect` mais permet de créer une nouvelle option si elle n'existe pas.

```hbs
<TpkSelectCreate
  @label="Tags"
  @options={{this.tags}}
  @selected={{this.selectedTags}}
  @multiple={{true}}
  @onChange={{this.onTagsChange}}
  @onCreate={{this.createTag}}
  @buildSuggestion={{this.buildSuggestion}}
  as |S|
>
  <S.Option as |O|>{{O.option.label}}</S.Option>
</TpkSelectCreate>
```

| Argument supplémentaire | Type | Requis | Description |
|---|---|---|---|
| `@onCreate` | `(value, select, e) => void` | Oui | Callback création |
| `@buildSuggestion` | `(term) => string` | Non | Texte de suggestion |
| `@showCreateWhen` | `(term) => boolean` | Non | Condition d'affichage |

---

### `TpkCheckbox`

```ts
import TpkCheckbox from '@triptyk/ember-input/components/tpk-checkbox';
```

Case à cocher avec label.

```hbs
<TpkCheckbox
  @label="J'accepte les CGU"
  @checked={{this.accepted}}
  @onChange={{this.onAcceptedChange}}
  as |C|
>
  <C.Input />
  <C.Label />
</TpkCheckbox>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Label |
| `@checked` | `boolean` | Oui | État coché |
| `@disabled` | `boolean` | Non | Désactiver |
| `@onChange` | `(isChecked, value, e) => void` | Non | Callback |

**Yields :** `Label`, `Input`, `onChange`, `changeEvent`, `guid`

---

### `TpkRadio`

```ts
import TpkRadio from '@triptyk/ember-input/components/tpk-radio';
```

Bouton radio individuel. Chaque radio d'un groupe partage le même `@name`.

```hbs
<TpkRadio
  @label="Option A"
  @name="myGroup"
  @value="a"
  @selected={{this.selectedOption}}
  @onChange={{this.onOptionChange}}
  as |R|
>
  <R.Input />
  <R.Label />
</TpkRadio>
<TpkRadio
  @label="Option B"
  @name="myGroup"
  @value="b"
  @selected={{this.selectedOption}}
  @onChange={{this.onOptionChange}}
  as |R|
>
  <R.Input />
  <R.Label />
</TpkRadio>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Label |
| `@name` | `string` | Oui | Nom du groupe radio |
| `@value` | `string` | Oui | Valeur de ce bouton |
| `@selected` | `string` | Non | Valeur sélectionnée dans le groupe |
| `@disabled` | `boolean` | Non | Désactiver |
| `@onChange` | `(value, e) => void` | Non | Callback |

**Yields :** `Label`, `Input`, `onChange`, `changeEvent`, `guid`

---

### `TpkDatepicker`

```ts
import TpkDatepicker from '@triptyk/ember-input/components/tpk-datepicker';
```

Sélecteur de date/heure basé sur Tempus Dominus avec masque IMask.

```hbs
{{! Date simple }}
<TpkDatepicker
  @label="Date de naissance"
  @value={{this.birthDate}}
  @dateFormat="dd/MM/yyyy"
  @onChange={{this.onBirthDateChange}}
  as |D|
>
  <D.Label />
  <D.Input />
</TpkDatepicker>

{{! Plage de dates }}
<TpkDatepicker
  @label="Période"
  @value={{this.dateRange}}
  @mode="range"
  @onChange={{this.onDateRangeChange}}
  as |D|
>
  <D.Label />
  <D.Input />
</TpkDatepicker>

{{! Avec heure }}
<TpkDatepicker
  @label="Rendez-vous"
  @value={{this.appointment}}
  @enableTime={{true}}
  @dateFormat="dd/MM/yyyy HH:mm"
  @onChange={{this.onAppointmentChange}}
  as |D|
>
  <D.Label />
  <D.Input />
</TpkDatepicker>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Label |
| `@value` | `Date \| string \| null \| [Date, Date]` | Non | Valeur |
| `@mode` | `'single' \| 'range'` | Non | Mode de sélection |
| `@enableTime` | `boolean` | Non | Activer la sélection d'heure |
| `@dateFormat` | `string` | Non | Format de date (défaut : `dd/MM/yyyy`) |
| `@locale` | `string` | Non | Locale (défaut : `fr`) |
| `@minDate` | `Date` | Non | Date minimum |
| `@maxDate` | `Date` | Non | Date maximum |
| `@disabled` | `boolean` | Non | Désactiver |
| `@onChange` | `(dates: Date[]) => void` | Non | Callback |
| `@onClose` | `() => void` | Non | Callback fermeture |

**Yields :** `Input`, `Label`, `guid`

---

### `TpkFile`

```ts
import TpkFile from '@triptyk/ember-input/components/tpk-file';
```

Champ de téléversement de fichier(s).

```hbs
<TpkFile
  @label="Pièce jointe"
  @accept=".pdf,.docx"
  @multiple={{true}}
  @onChange={{this.handleFiles}}
  as |F|
>
  <F.Label />
  <F.Input />
  <ul>
    {{#each F.files as |file|}}
      <li>{{file.name}}</li>
    {{/each}}
  </ul>
</TpkFile>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Label |
| `@accept` | `string` | Non | Types MIME acceptés (ex : `.pdf,.docx`) |
| `@multiple` | `boolean` | Non | Fichiers multiples |
| `@disabled` | `boolean` | Non | Désactiver |
| `@onChange` | `(files: File[], e) => void` | Non | Callback |

**Yields :** `Input`, `Label`, `guid`, `changeEvent`, `onChange`, `files`

---

### `TpkButton`

```ts
import TpkButton from '@triptyk/ember-input/components/tpk-button';
```

Bouton avec protection anti-double-clic (ember-concurrency, stratégie `drop`).

```hbs
<TpkButton
  @onClick={{this.save}}
  @disabled={{this.isSaving}}
  as |B|
>
  Sauvegarder
</TpkButton>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@onClick` | `(e) => void \| Promise<void>` | Non | Handler clic |
| `@disabled` | `boolean` | Non | Désactiver |
| `@allowSpam` | `boolean` | Non | Désactiver la protection anti-spam (défaut : `false`) |

**Yields :** contenu du bouton

---

### `TpkSearch` (prefab)

```ts
import TpkSearch from '@triptyk/ember-input/components/prefabs/tpk-search';
```

Champ de recherche avec icône, optimisé pour éviter les requêtes multiples (stratégie `drop`).

```hbs
<TpkSearch
  @label="Rechercher"
  @placeholder="Nom, prénom…"
  @onSearch={{this.handleSearch}}
/>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@onSearch` | `(e, value) => void` | Oui | Callback |
| `@label` | `string` | Non | Label (défaut : `''`) |
| `@placeholder` | `string` | Non | Placeholder |

---

### `TpkToggle` (prefab)

```ts
import TpkToggle from '@triptyk/ember-input/components/prefabs/tpk-toggle';
```

Interrupteur on/off (checkbox stylisée en toggle).

```hbs
<TpkToggle
  @label="Activer les notifications"
  @checked={{this.notifications}}
  @onChange={{this.onNotificationsChange}}
/>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Label |
| `@checked` | `boolean` | Non | État actif |
| `@disabled` | `boolean` | Non | Désactiver |
| `@onChange` | `(isChecked, value, e) => void` | Non | Callback |

---

### `TpkButtonPrefab` (prefab)

```ts
import TpkButtonPrefab from '@triptyk/ember-input/components/prefabs/tpk-prefab-button';
```

Bouton simplifié avec label comme prop.

```hbs
<TpkButtonPrefab
  @label="Valider"
  @onClick={{this.submit}}
  @disabled={{this.isSubmitting}}
/>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Texte du bouton |
| `@onClick` | `(e) => void \| Promise<void>` | Oui | Callback |
| `@disabled` | `boolean` | Non | Désactiver |

---

## Package `@triptyk/ember-input-validation`

Composants de formulaire avec validation Zod et gestion d'état via `ImmerChangeset`.

---

### `TpkForm`

```ts
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
```

Point d'entrée principal. Fournit le contexte de validation et yielde tous les composants pré-configurés avec le changeset et le schéma.

```ts
// my-form.ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { ImmerChangeset } from 'ember-immer-changeset';
import { object, string, z } from 'zod';

export default class MyForm extends Component {
  @tracked changeset = new ImmerChangeset({
    firstName: '',
    lastName: '',
    email: '',
    role: null,
  });

  schema = object({
    firstName: string().min(1, 'Requis'),
    lastName:  string().min(1, 'Requis'),
    email:     string().email('Email invalide'),
    role:      string(),
  });

  handleSubmit = async (data: z.infer<typeof this.schema>) => {
    await this.myService.save(data);
  };
}
```

```hbs
{{! my-form.hbs }}
<TpkForm
  @changeset={{this.changeset}}
  @validationSchema={{this.schema}}
  @onSubmit={{this.handleSubmit}}
  as |F|
>
  <F.TpkInputPrefab
    @label="Prénom"
    @validationField="firstName"
  />
  <F.TpkInputPrefab
    @label="Nom"
    @validationField="lastName"
  />
  <F.TpkEmailPrefab
    @label="Email"
    @validationField="email"
  />
  <F.TpkSelectPrefab
    @label="Rôle"
    @validationField="role"
    @options={{this.roles}}
    @onChange={{this.onRoleChange}}
  />
  <button type="submit">Enregistrer</button>
</TpkForm>
```

#### Arguments de `TpkForm`

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@changeset` | `ImmerChangeset` | Oui | Instance du changeset |
| `@validationSchema` | `ZodObject` | Oui | Schéma de validation Zod |
| `@onSubmit` | `(data, changeset) => Promise<void>` | Oui | Handler de soumission |
| `@reactive` | `boolean` | Non | Valider à chaque changement (défaut : `true`) |
| `@disabled` | `boolean` | Non | Désactiver tout le formulaire |
| `@removeErrorsOnSubmit` | `boolean` | Non | Effacer erreurs avant validation (défaut : `true`) |
| `@autoScrollOnError` | `boolean` | Non | Scroller vers la première erreur (défaut : `true`) |
| `@executeOnValid` | `boolean` | Non | Exécuter le changeset si valide (défaut : `true`) |

#### Composants yieldés par `TpkForm`

Tous héritent automatiquement du `@changeset` et des `@requiredFields` inférés depuis le schéma Zod. Il suffit de passer `@validationField` et `@label`.

| Composant yieldé | Import direct si besoin |
|---|---|
| `F.TpkInputPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-input` |
| `F.TpkEmailPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-email` |
| `F.TpkPasswordPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-password` |
| `F.TpkTextareaPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-textarea` |
| `F.TpkSelectPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-select` |
| `F.TpkSelectCreatePrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-select-create` |
| `F.TpkSelectSearchPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-select-search` |
| `F.TpkCheckboxPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-checkbox` |
| `F.TpkRadioGroupPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-radio-group` |
| `F.TpkDatepickerPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-datepicker` |
| `F.TpkDatepickerRangePrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-datepicker-range` |
| `F.TpkTimepickerPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-timepicker` |
| `F.TpkFilePrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-file` |
| `F.TpkFileListPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-file-list` |
| `F.TpkNumberPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-number` |
| `F.TpkIntegerPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-integer` |
| `F.TpkCurrencyPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-currency` |
| `F.TpkIbanPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-iban` |
| `F.TpkBicPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-bic` |
| `F.TpkVatPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-vat` |
| `F.TpkMobilePrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-mobile` |
| `F.TpkNationalNumberPrefab` | `@triptyk/ember-input-validation/components/prefabs/tpk-validation-national-number` |

---

### Arguments communs à tous les prefabs de validation

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@label` | `string` | Oui | Label affiché |
| `@changeset` | `ImmerChangeset` | Oui | Auto-injecté via `TpkForm` |
| `@validationField` | `string` | Oui | Nom du champ dans le changeset |
| `@mandatory` | `boolean` | Non | Afficher `*` (déduit du schéma Zod si via `TpkForm`) |
| `@disabled` | `boolean` | Non | Désactiver le champ |
| `@onChange` | `(value, e) => void` | Non | Callback optionnel |

---

### `TpkValidationInput` (base, sans prefab)

```ts
import TpkValidationInput from '@triptyk/ember-input-validation/components/tpk-validation-input';
```

Version composition du champ texte avec validation. Permet de personnaliser le rendu des erreurs et du label.

```hbs
<TpkValidationInput
  @label="Nom"
  @changeset={{this.changeset}}
  @validationField="lastName"
  @mandatory={{true}}
  as |V|
>
  <V.Label />
  <V.Input />
  {{#if V.hasError}}
    <p class="error">{{V.firstError.message}}</p>
  {{/if}}
</TpkValidationInput>
```

**Yields :** `Input`, `Label`, `errors`, `hasError`, `firstError`, `mandatory`

> Les composants de base `TpkValidationCheckbox`, `TpkValidationDatepicker`, `TpkValidationFile`, `TpkValidationSelect`, `TpkValidationTextarea` suivent le même pattern.

---

### `TpkValidationRadioGroup` + `TpkValidationRadio`

```ts
import TpkValidationRadioGroup from '@triptyk/ember-input-validation/components/tpk-validation-radio-group';
import TpkValidationRadio from '@triptyk/ember-input-validation/components/tpk-validation-radio';
```

Groupe de boutons radio avec validation.

```hbs
{{! Via TpkForm (recommandé) }}
<F.TpkRadioGroupPrefab
  @label="Civilité"
  @validationField="civility"
  as |G|
>
  <G.Radio @label="Monsieur" @value="mr" />
  <G.Radio @label="Madame"   @value="mrs" />
</F.TpkRadioGroupPrefab>

{{! Standalone (base) }}
<TpkValidationRadioGroup
  @changeset={{this.changeset}}
  @validationField="civility"
  as |G|
>
  <G.Radio @label="Monsieur" @value="mr" />
  <G.Radio @label="Madame"   @value="mrs" />
  {{#if G.hasError}}
    <p class="error">{{G.firstError.message}}</p>
  {{/if}}
</TpkValidationRadioGroup>
```

**`TpkValidationRadioGroup` yields :** `Radio` (pré-lié), `selected`, `onChange`, `errors`, `hasError`, `firstError`, `mandatory`

---

### Utilisation des prefabs sans `TpkForm`

Il est possible d'utiliser les prefabs de manière autonome en passant le changeset directement :

```ts
import TpkValidationInputPrefab from '@triptyk/ember-input-validation/components/prefabs/tpk-validation-input';
```

```hbs
<TpkValidationInputPrefab
  @label="Nom"
  @changeset={{this.changeset}}
  @validationField="lastName"
  @mandatory={{true}}
/>
```

---

## Package `@triptyk/ember-ui`

Composants d'interface avancés : layout, tableaux, modales, navigation.

---

### `TpkDashboard` (prefab)

```ts
import TpkDashboard from '@triptyk/ember-ui/components/prefabs/tpk-dashboard';
import type { SidebarItem } from '@triptyk/ember-ui/components/prefabs/tpk-sidebar';
import type { NavbarItem, Language } from '@triptyk/ember-ui/components/prefabs/tpk-navbar';
```

Layout principal complet avec navbar et sidebar.

```hbs
<TpkDashboard
  @title="Mon Application"
  @navbarItems={{this.navItems}}
  @sidebarItems={{this.sidebarItems}}
  @currentUser={{this.currentUser}}
  @onLogout={{this.logout}}
  @logoutLabel="Déconnexion"
  @profileRoute="profile"
  @profileLabel="Mon profil"
  @languages={{this.languages}}
  @onLocaleChange={{this.changeLocale}}
  @collapsed={{this.sidebarCollapsed}}
  @onCollapsedChange={{this.onCollapsedChange}}
  as |D|
>
  <:header>
    <img src="/logo.svg" alt="Logo" />
  </:header>
  <:content>
    {{outlet}}
  </:content>
  <:footer>
    <TpkThemeSelector @sidebarCollapsed={{this.sidebarCollapsed}} />
  </:footer>
</TpkDashboard>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@title` | `string` | Non | Titre affiché dans la navbar |
| `@navbarItems` | `NavbarItem[]` | Non | Liens de la barre de navigation |
| `@sidebarItems` | `SidebarItem[]` | Non | Items du menu latéral |
| `@currentUser` | `{ fullName: string }` | Non | Utilisateur connecté |
| `@onLogout` | `() => void` | Non | Callback déconnexion |
| `@logoutLabel` | `string` | Non | Texte du bouton déconnexion |
| `@profileRoute` | `string` | Non | Route du profil |
| `@profileLabel` | `string` | Non | Texte du lien profil |
| `@languages` | `Language[]` | Non | Liste des langues disponibles |
| `@onLocaleChange` | `(locale: string) => void` | Non | Callback changement de langue |
| `@collapsed` | `boolean` | Non | Sidebar repliée |
| `@onCollapsedChange` | `(collapsed: boolean) => void` | Non | Callback toggle sidebar |

**Blocks yieldés :** `:content`, `:header`, `:footer`, `:menu`

#### Types exportés

```ts
// NavbarItem
interface NavbarItem {
  label: string;
  onClick?: (event: PointerEvent) => void;
  href?: string;
}

// Language
interface Language {
  code: string;  // ex: 'fr', 'en'
  label: string; // ex: 'Français'
}

// SidebarItem
type SidebarLink = {
  type: 'link';
  label: string;
  route?: string;
  onClick?: (event: PointerEvent) => void;
  icon?: Component;
  tooltip?: string;
};

type SidebarGroup = {
  type: 'group';
  label: string;
  icon?: Component;
  isOpen?: boolean;
  tooltip?: string;
  items: SidebarItem[];
};

type SidebarItem = SidebarLink | SidebarGroup;
```

#### Exemple de configuration de la sidebar

```ts
import HomeIcon from './icons/home.gts';
import SettingsIcon from './icons/settings.gts';

sidebarItems: SidebarItem[] = [
  {
    type: 'link',
    label: 'Tableau de bord',
    route: 'dashboard',
    icon: HomeIcon,
  },
  {
    type: 'group',
    label: 'Administration',
    icon: SettingsIcon,
    isOpen: true,
    items: [
      { type: 'link', label: 'Utilisateurs', route: 'admin.users' },
      { type: 'link', label: 'Rôles',        route: 'admin.roles' },
    ],
  },
];
```

---

### `TpkThemeSelector` (prefab)

```ts
import TpkThemeSelector from '@triptyk/ember-ui/components/prefabs/tpk-theme-selector';
```

Sélecteur de thème visuel (stocké en localStorage). Thèmes disponibles : `nord`, `dracula`, `cupcake`, `corporate`, `lemonade`.

```hbs
<TpkThemeSelector
  @sidebarCollapsed={{this.sidebarCollapsed}}
  @localStorageKey="mon-app-theme"
/>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@sidebarCollapsed` | `boolean` | Non | Masquer le label si sidebar repliée |
| `@localStorageKey` | `string` | Non | Clé localStorage (défaut : `tpk-theme`) |

---

### `TpkTableGenericPrefab` (prefab)

```ts
import TpkTableGenericPrefab from '@triptyk/ember-ui/components/prefabs/tpk-table-generic-prefab';
```

Tableau paginé, trié et filtrable connecté à WarpDrive (EmberData).

```hbs
<TpkTableGenericPrefab
  @tableParams={{hash
    entity="user"
    defaultSortColumn="lastName"
    pageSizes=(array 10 25 50 100)
    additionalFilters=(hash status="active")
    registerApi=(fn this.registerTableApi)
    rowClick=(fn this.onRowClick)
    columns=(array
      (hash field="lastName"  headerName="Nom"    sortable=true)
      (hash field="firstName" headerName="Prénom" sortable=true)
      (hash field="email"     headerName="Email"  sortable=false)
      (hash field="role"      headerName="Rôle"   sortable=true component="roleCell")
    )
    actionMenu=(array
      (hash icon=EditIcon  action=(fn this.edit)   name="Modifier")
      (hash icon=TrashIcon action=(fn this.delete) name="Supprimer")
    )
  }}
  @columnsComponent={{hash
    roleCell=(component MyRoleCellComponent)
  }}
/>
```

#### `@tableParams`

| Propriété | Type | Requis | Description |
|---|---|---|---|
| `entity` | `string` | Oui | Nom du modèle EmberData (ex : `"user"`) |
| `columns` | `Column[]` | Oui | Définition des colonnes |
| `defaultSortColumn` | `string` | Non | Colonne triée par défaut |
| `pageSizes` | `number[]` | Non | Options de taille de page |
| `additionalFilters` | `Record<string, string>` | Non | Filtres API supplémentaires |
| `relationships` | `string` | Non | Relations à inclure (JSON:API `include`) |
| `registerApi` | `(api: TableApi) => void` | Non | Accès à l'API du tableau |
| `rowClick` | `(element, e) => void` | Non | Clic sur une ligne |
| `actionMenu` | `ActionMenuItem[]` | Non | Actions dans le menu par ligne |

#### `Column`

```ts
interface Column {
  field: string;            // Propriété du modèle
  headerName: string;       // Titre de colonne
  sortable: boolean;        // Tri activé
  component?: string;       // Clé dans @columnsComponent pour rendu custom
  renderElement?: (element: unknown) => string; // Transformateur de valeur
}
```

#### `ActionMenuItem`

```ts
interface ActionMenuItem {
  name: string;
  action: (...args: unknown[]) => void;
  icon?: Component;
}
```

#### `TableApi` (via `registerApi`)

```ts
interface TableApi {
  reloadData: () => void;
}

// Exemple d'utilisation
tableApi: TableApi | null = null;

registerTableApi = (api: TableApi) => {
  this.tableApi = api;
};

// Après une opération (ex: suppression), recharger le tableau
await this.delete(item);
this.tableApi?.reloadData();
```

#### Comportement `rowClick`

- Ne se déclenche **pas** si le clic est sur un élément interactif (`button`, `a`, `input`…)
- Ne se déclenche **pas** si l'élément cliqué (ou un ancêtre) a la classe `.tpk-no-row-click`

---

### `TpkModal`

```ts
import TpkModal from '@triptyk/ember-ui/components/tpk-modal';
```

Modale accessible avec gestion de pile (DialogLayerService) et focus trap.

```hbs
<TpkModal
  @isOpen={{this.showModal}}
  @onClose={{this.closeModal}}
  @title="Confirmer l'action"
  as |M|
>
  <M.Content as |C|>
    <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
    <button {{on "click" this.confirm}}>Oui, supprimer</button>
    <button {{on "click" M.onClose}}>Annuler</button>
  </M.Content>
</TpkModal>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@isOpen` | `boolean` | Oui | Visibilité de la modale |
| `@onClose` | `() => void` | Oui | Callback fermeture |
| `@title` | `string` | Oui | Titre de la modale |
| `@outsideClickHandler` | `(e) => void` | Non | Handler clic extérieur personnalisé |

**Yields :** `Content`, `isOpen`, `isOnTop`, `onClose`, `guid`

---

### `TpkConfirmModalPrefab` (prefab)

```ts
import TpkConfirmModalPrefab from '@triptyk/ember-ui/components/prefabs/tpk-confirm-modal-prefab';
```

Boîte de confirmation prête à l'emploi.

```hbs
<TpkConfirmModalPrefab
  @isOpen={{this.showConfirm}}
  @onClose={{this.cancelDelete}}
  @onConfirm={{this.confirmDelete}}
  @confirmQuestion="Voulez-vous supprimer cet élément ?"
  @confirmText="Supprimer"
  @cancelText="Annuler"
/>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@isOpen` | `boolean` | Oui | Visibilité |
| `@onClose` | `() => void` | Oui | Callback annulation |
| `@onConfirm` | `() => void` | Oui | Callback confirmation |
| `@confirmQuestion` | `string` | Oui | Texte de la question |
| `@confirmText` | `string` | Non | Texte du bouton confirmer |
| `@cancelText` | `string` | Non | Texte du bouton annuler |
| `@outsideClickHandler` | `(e) => void` | Non | Handler clic extérieur |

---

### `TpkStackList`

```ts
import TpkStackList from '@triptyk/ember-ui/components/tpk-stack-list';
```

Liste d'éléments extensibles/collapsibles avec ajout et suppression.

```hbs
<TpkStackList
  @data={{this.contacts}}
  @onAdd={{this.addContact}}
  @onRemove={{this.removeContact}}
  @titleForAdd="Ajouter un contact"
  @readOnly={{false}}
  as |Stack|
>
  <Stack.Title as |T|>
    {{T.item.firstName}} {{T.item.lastName}}
  </Stack.Title>
  <Stack.Content as |C|>
    <TpkValidationInputPrefab
      @label="Téléphone"
      @changeset={{C.item.changeset}}
      @validationField="phone"
    />
  </Stack.Content>
</TpkStackList>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@data` | `unknown[]` | Oui | Tableau de données |
| `@onAdd` | `() => void` | Oui | Callback ajout |
| `@onRemove` | `(item) => void` | Oui | Callback suppression |
| `@titleForAdd` | `string` | Oui | Label du bouton d'ajout |
| `@readOnly` | `boolean` | Non | Masquer boutons add/delete |
| `@key` | `string` | Non | Clé pour le tracking |

**Yields :** `Title` (avec `item`, `index`, `isExpanded`), `Content` (avec `item`, `index`)

---

### `TpkActionsMenu`

```ts
import TpkActionsMenu from '@triptyk/ember-ui/components/tpk-actions-menu';
```

Menu d'actions contextuel (icône `⋯`) avec popover.

```hbs
<TpkActionsMenu as |Menu|>
  <Menu.Element
    @action={{fn this.edit item}}
    @label="Modifier"
    @icon={{EditIcon}}
  />
  <Menu.Element
    @action={{fn this.archive item}}
    @label="Archiver"
    @icon={{ArchiveIcon}}
  />
</TpkActionsMenu>
```

**`Menu.Element` arguments :**

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@action` | `(...args) => void` | Oui | Action à exécuter |
| `@handleAction` | `(action, e) => void` | Auto | Fourni automatiquement par `TpkActionsMenu` |
| `@label` | `string` | Non | Texte de l'action |
| `@icon` | `Component` | Non | Icône SVG |

---

### `TpkLoadingIndicator`

```ts
import TpkLoadingIndicator from '@triptyk/ember-ui/components/tpk-loading-indicator';
```

Overlay de chargement plein écran.

```hbs
{{#if this.isLoading}}
  <TpkLoadingIndicator />
{{/if}}
```

Aucun argument. Accepte `...attributes`.

---

### Formulaires d'authentification (prefabs)

#### `TpkLogin`

```ts
import TpkLogin from '@triptyk/ember-ui/components/prefabs/tpk-login';
```

```hbs
<TpkLogin
  @loginSchema={{this.loginSchema}}
  @onSubmit={{this.handleLogin}}
  @submitButtonText="Se connecter"
/>
```

| Argument | Type | Requis | Description |
|---|---|---|---|
| `@loginSchema` | `ZodObject` | Oui | Schéma Zod avec `email` et `password` |
| `@onSubmit` | `(data, changeset) => void` | Oui | Callback soumission |
| `@initialValues` | `object` | Non | Valeurs initiales |
| `@submitButtonText` | `string` | Non | Texte du bouton (défaut : `Sign in`) |

#### `TpkForgotPassword`

```ts
import TpkForgotPassword from '@triptyk/ember-ui/components/prefabs/tpk-forgot-password';
```

```hbs
<TpkForgotPassword
  @forgotPasswordSchema={{this.schema}}
  @onSubmit={{this.handleForgot}}
  @submitButtonText="Envoyer le lien"
/>
```

#### `TpkResetPassword`

```ts
import TpkResetPassword from '@triptyk/ember-ui/components/prefabs/tpk-reset-password';
```

```hbs
<TpkResetPassword
  @resetPasswordSchema={{this.schema}}
  @onSubmit={{this.handleReset}}
  @submitButtonText="Réinitialiser"
/>
```

---

## Exemple complet : formulaire d'édition utilisateur

```ts
// edit-user.ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { ImmerChangeset } from 'ember-immer-changeset';
import { object, string, boolean, z } from 'zod';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';

export default class EditUser extends Component {
  @tracked changeset = new ImmerChangeset({
    firstName: this.args.user.firstName,
    lastName:  this.args.user.lastName,
    email:     this.args.user.email,
    role:      this.args.user.role,
    birthDate: this.args.user.birthDate,
    notes:     this.args.user.notes,
    active:    this.args.user.active,
  });

  schema = object({
    firstName: string().min(1),
    lastName:  string().min(1),
    email:     string().email(),
    role:      string(),
    birthDate: z.date().optional(),
    notes:     string().optional(),
    active:    boolean(),
  });

  roles = [
    { id: 'admin', label: 'Administrateur' },
    { id: 'user',  label: 'Utilisateur' },
  ];

  handleSubmit = async (data: z.infer<typeof this.schema>) => {
    await this.args.onSave(data);
  };
}
```

```hbs
{{! edit-user.hbs }}
<TpkForm
  @changeset={{this.changeset}}
  @validationSchema={{this.schema}}
  @onSubmit={{this.handleSubmit}}
  as |F|
>
  <F.TpkInputPrefab    @label="Prénom"            @validationField="firstName" />
  <F.TpkInputPrefab    @label="Nom"               @validationField="lastName" />
  <F.TpkEmailPrefab    @label="Email"             @validationField="email" />
  <F.TpkSelectPrefab
    @label="Rôle"
    @validationField="role"
    @options={{this.roles}}
    @searchField="label"
    @onChange={{this.onRoleChange}}
  />
  <F.TpkDatepickerPrefab @label="Date de naissance" @validationField="birthDate" />
  <F.TpkTextareaPrefab   @label="Notes"             @validationField="notes" @maxLength={{500}} />
  <F.TpkCheckboxPrefab   @label="Compte actif"      @validationField="active" />
  <button type="submit">Enregistrer</button>
</TpkForm>
```
