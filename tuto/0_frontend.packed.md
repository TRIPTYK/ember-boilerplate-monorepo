<!-- Packed from tuto/0_frontend.md on 2026-05-06T13:34:48.423Z -->
<!-- 21 referenced file(s) inlined below -->

> **READ-THIS-FILE-ONLY.** Every link to a project file in this document has been
> rewritten to an in-document anchor (e.g. `#ref-libs-todos-front-src-index-ts`)
> that resolves to a section under `## Referenced files` at the bottom.
> Do **not** open, fetch, or read any external file path mentioned in this document —
> the canonical content of every referenced file is already inlined here. If something
> appears missing, scroll to `## Referenced files` and search by path.
# Introduction du Boilerplate

- Explication de la structure d'une lib avec celle de la "user"

## Règles globales frontend

- Une librairie ne fait pas de tests d'acceptance
- Tous les appels API faits par les tests sont **mockés** soit par msw soit pas vitest. Les appels réels sont faits par les tests e2e.
- Les tests e2e sont implémentés par les users stories.
- Les traductions sont gérées par les apps et pas par les libs. Les libs exportent des clés de traduction et les apps font le lien entre ces clés et les traductions. Elles se trouvent dans le dossier "translations" de l'app et sont organisées par librairie (ex: `@apps/front/app/translations/todos/en-us.yaml` pour les traductions de la librairie "todos" en anglais américain).

## Librairies

- ember common uis: https://github.com/TRIPTYK/ember-common-ui
- immer changeset: https://github.com/TRIPTYK/ember-immer-changeset
- MSW: https://www.npmjs.com/package/msw
- Warp Drive (anciennement ember-data): https://warp-drive.io
- EmberJS: https://guides.emberjs.com/release/
- Vitest: https://vitest.dev

## Frontend

1. Création du package de la librairie dans le dossier "@libs" avec comme nom: `@libs/todo-frontend`
2. Mettre en place la structure de base d'une lib avec les dossiers/fichiers suivants:
  - src/
    - index.ts
    
    |> contient une fonction d'initialisation de la librairie `export async function initialize(owner: Owner)`
    
    |> contient une fonction retournant le registre des modules exportés par la libraire `export function moduleRegistry()`
    
    |> contient une ou plusieurs fonctions `export function forRouter(this: DSL)` qui exportent le router de la librairie si elle exporte des routes
    - assets/
    
    |> les différents assets de la librairie (images, icones, autres fichiers statiques)
    
    |> les icones seront sous forme de composants .gts qui exportent la balise svg correspondante
    - components/
    
    |> les différents composants de la librairie en format .gts
    - http-mocks/
    
    |> les mocks http msw exportés par la librairie
    - services/
    
    |> les services ember. Notamment les services de sauvegarde de données vers le backend.
    - routes/
    
    |> les routes ember de l'application
    - schemas/
    
    |> les schémas @warp-drive
    - changesets/
    
    |> les changesets des différents formulaires de la librairie
    - styles/
    
    |> les différents styles de la librairie
  - tests/
    - integration/
    
    |> les tests d'intégration de la librairie
    - unit/
    
    |> les tests unitaires de la librairie
    
    app.ts
    
    |> contient une class `TestApp` où on définit les différents modules à importer pour les tests de la librairie
    
    |> contient une class `TestStore` qui étend la classe `useLegacyStore` de @warp-drive et qui est utilisée pour les tests de la librairie
    
    |> contient une fonction d'initialisation de l'application de test `export async function initializeTestApp(owner: Owner, locale: string)`
    
    test-helper.ts
    
    |> contient éventuellement des fonctions à définir dans les hooks globaux (beforeEach, afterEach) pour les tests de la librairie
    
    utils.ts
    
    |> Des éventuels utilitaires pour les tests dans la librairie


3. Création de [src/index.ts](#ref-libs-todos-front-src-index-ts)
   - Contient la fonction `initialize(owner: Owner)` pour initialiser la librairie
   - Contient la fonction `moduleRegistry()` qui retourne le registre des modules exportés
   - Contient la fonction `forRouter(this: DSL)` qui exporte le router de la librairie avec les routes `todos`, `todos.create` et `todos.edit`

4. Création du schéma pour les "todo" dans [src/schemas/todos.ts](#ref-libs-todos-front-src-schemas-todos-ts)
   - Définit le schéma Warp Drive pour l'entité "todo"

5. Création des routes et de leur template pour "todo" (create, edit et list)
   - Les routes et leur template sont créées dans le dossier [src/routes/dashboard/todos](../@libs/todos-front/src/routes/dashboard/todos)
   - [src/routes/dashboard/todos/index.gts](#ref-libs-todos-front-src-routes-dashboard-todos-index-gts) - Route de listing des todos
   - [src/routes/dashboard/todos/index-template.gts](#ref-libs-todos-front-src-routes-dashboard-todos-index-template-gts) - Template de la route de listing
   - [src/routes/dashboard/todos/create.gts](#ref-libs-todos-front-src-routes-dashboard-todos-create-gts) - Route de création d'un todo
   - [src/routes/dashboard/todos/create-template.gts](#ref-libs-todos-front-src-routes-dashboard-todos-create-template-gts) - Template de la route de création
   - [src/routes/dashboard/todos/edit.gts](#ref-libs-todos-front-src-routes-dashboard-todos-edit-gts) - Route d'édition d'un todo
   - [src/routes/dashboard/todos/edit-template.gts](#ref-libs-todos-front-src-routes-dashboard-todos-edit-template-gts) - Template de la route d'édition
   - Le nom du template est toujours le même que celui de la route + "-template.gts"

6. Création du changeset pour "todo" dans [src/changesets/todo.ts](#ref-libs-todos-front-src-changesets-todo-ts)
7. Création du formulaire de création/update de "todo" dans [src/components/forms/todo-form.gts](#ref-libs-todos-front-src-components-forms-todo-form-gts)
   - Composant Glimmer qui utilise `TpkForm` de `@triptyk/ember-input-validation`
   - Gère la soumission du formulaire via le service `TodoService`
   - Affiche les messages flash de succès/erreur

8. Création de la validation du formulaire de "todo" dans [src/components/forms/todo-validation.ts](#ref-libs-todos-front-src-components-forms-todo-validation-ts) avec zod et son intégration dans le changeset de "todo"
   - Exporte `createTodoValidationSchema(intl: IntlService)` qui retourne un schéma Zod
   - Définit les règles de validation pour `title`, `description`, `completed` et `id`
   - Utilise les traductions via le service Intl pour les messages d'erreur

9. Création du test d'intégration du formulaire dans [tests/integration/todos-form-test.gts](#ref-libs-todos-front-tests-integration-todos-form-test-gts)
   - Teste le rendu du formulaire avec `renderingTest` de `ember-vitest`
   - Vérifie la validation des champs et la soumission du formulaire
   - Utilise `initializeTestApp` et `TestApp` pour configurer l'environnement de test

10. Création du service de sauvegarde de "todo" dans [src/services/todo.ts](#ref-libs-todos-front-src-services-todo-ts)
    - Service Ember qui utilise le Store Warp Drive pour créer, mettre à jour et supprimer des todos
    - Méthodes `createTodo(changeset)`, `updateTodo(changeset)` et `deleteTodo(todo)`
    - Utilise `createRecord`, `updateRecord` et `deleteRecord` de `@warp-drive/utilities/json-api`

11. Création du mock msw pour les appels API de "todo" dans [src/http-mocks/todos.ts](#ref-libs-todos-front-src-http-mocks-todos-ts)
    - Définit les handlers MSW pour les routes CRUD des todos
    - Utilise `createOpenApiHttp` de `openapi-msw` pour générer les handlers depuis les types OpenAPI du backend
    - Exporte les handlers pour être utilisés dans les tests et le développement

12. Création du test unitaire du service de sauvegarde de "todo" dans [tests/unit/todo-test.gts](#ref-libs-todos-front-tests-unit-todo-test-gts)
    - Teste les méthodes `createTodo`, `updateTodo` et `deleteTodo` du service
    - Utilise MSW pour mocker les appels API
    - Vérifie que les appels sont correctement effectués et que les données sont bien sauvegardées dans le store

13. Création du composant todo-table dans [src/components/todo-table.gts](#ref-libs-todos-front-src-components-todo-table-gts) qui affiche la liste des "todos" et qui est utilisé dans la route de listing des "todos"
    - Utilise `TpkTableGenericPrefab` de `@triptyk/ember-ui` pour afficher un tableau
    - Affiche les colonnes: titre, description, statut (complété/non complété)
    - Contient des actions pour éditer, supprimer et changer le statut d'un todo
    - Utilise `TpkConfirmModalPrefab` pour confirmer la suppression

14. Liaison de la librairie avec l'application frontend
    - Initialisation dans [@apps/front/app/routes/application.ts](#ref-apps-front-app-routes-application-ts)
      - Import de `initialize` depuis `@libs/todos-front`
      - Appel de `initializeTodoLib(getOwner(this)!)` dans `beforeModel()`
    - Importation des mocks dans [@apps/front/app/routes/application.ts](#ref-apps-front-app-routes-application-ts)
      - Import de `allTodosHandlers` depuis `@libs/todos-front/http-mocks/all`
      - Ajout des handlers dans `setupWorker(...allUsersHandlers, ...allTodosHandlers)`
    - Injection du router dans [@apps/front/app/router.ts](#ref-apps-front-app-router-ts)
      - Import de `forRouter as todosLibRouter` depuis `@libs/todos-front`
      - Appel de `todosLibRouter.call(this)` dans la route `dashboard`
    - Ajout dans les devDependencies de l'application frontend dans [@apps/front/package.json](#ref-apps-front-package-json)
      - Ajout de `"@libs/todos-front": "workspace:*"` dans les `devDependencies`
    - Ajout du store "todo" dans [@apps/front/app/services/store.ts](#ref-apps-front-app-services-store-ts)
      - Import de `TodoSchema` depuis `@libs/todos-front/schemas/todos`
      - Ajout de `TodoSchema` dans le tableau `schemas` de `useLegacyStore`
    - Ajout de la librairie "todo" dans [@apps/front/app/styles/app.css](#ref-apps-front-app-styles-app-css) avec la ligne `@source "../../node_modules/@libs/todos-front";` pour intépréter le CSS.

15. Réalisation d'un test d'acceptance dans `@apps/front/tests/acceptance/todo-acceptance-test.gts` pour tester le parcours de création d'une "todo" jusqu'à son affichage dans la liste des "todos".
    - Teste le flux complet: navigation vers la page de création, remplissage du formulaire, soumission, redirection vers la liste, vérification de l'affichage

16. Réalisation d'un test e2e dans `@apps/e2e/tests/todo-e2e-test.gts` basé sur un user story.
    - Teste le parcours utilisateur complet avec une vraie interaction navigateur
    - Utilise Playwright ou un autre outil e2e pour simuler les actions utilisateur

17. Ingestion d'un Raffaello comme récompense pour ce dur labeur.

---

## Referenced files

<a id="ref-libs-todos-front-src-index-ts"></a>
### `@libs/todos-front/src/index.ts`

```ts
import { assert } from '@ember/debug';
import type Owner from '@ember/owner';
import type { DSL } from '@ember/routing/lib/dsl';
import { buildRegistry } from 'ember-strict-application-resolver/build-registry';
import IntlService from 'ember-intl/services/intl';
import type { Store } from '@warp-drive/core';
import { moduleRegistry as sharedModuleRegistry } from '@libs/shared-front';

export function moduleRegistry() {
  return buildRegistry({
    ...import.meta.glob('./routes/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./templates/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./helpers/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./components/**/*.{js,ts}', { eager: true }),
    ...import.meta.glob('./services/**/*.{js,ts}', { eager: true }),
    ...sharedModuleRegistry(),
    './services/intl': {
      default: IntlService,
    },
  })();
}

export function initialize(owner: Owner) {
  const intlService = owner.lookup('service:intl') as IntlService | undefined;
  const storeService = owner.lookup('service:store') as Store | undefined;
  assert('Store service must be available', storeService);
  assert('Intl service must be available', intlService);
}

export function forRouter(this: DSL) {
  this.route('todos', function () {
    this.route('create');
    this.route('edit', { path: '/:todo_id/edit' });
  });
}
```

<a id="ref-libs-todos-front-src-schemas-todos-ts"></a>
### `@libs/todos-front/src/schemas/todos.ts`

```ts
import {
  withDefaults,
  type WithLegacy,
} from '@warp-drive/legacy/model/migration-support';
import type { Type } from '@warp-drive/core/types/symbols';

const TodoSchema = withDefaults({
  type: 'todos',
  fields: [
    { name: 'createdAt', kind: 'attribute' },
    { name: 'updatedAt', kind: 'attribute' },
    { name: 'title', kind: 'attribute' },
    { name: 'description', kind: 'attribute' },
    { name: 'completed', kind: 'attribute' },
  ],
});

export default TodoSchema;

export type Todo = WithLegacy<{
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  completed: boolean;
  [Type]: 'todos';
}>;
```

<a id="ref-libs-todos-front-src-routes-dashboard-todos-index-gts"></a>
### `@libs/todos-front/src/routes/dashboard/todos/index.gts`

```gts
import Route from '@ember/routing/route';

export default class TodosIndexRoute extends Route {}
```

<a id="ref-libs-todos-front-src-routes-dashboard-todos-index-template-gts"></a>
### `@libs/todos-front/src/routes/dashboard/todos/index-template.gts`

```gts
import type { TOC } from '@ember/component/template-only';
import type TodosIndexRoute from './index.gts';
import TodosTable from '#src/components/todo-table.gts';

export default <template><TodosTable /></template> as TOC<{
  model: Awaited<ReturnType<TodosIndexRoute['model']>>;
  controller: undefined;
}>
```

<a id="ref-libs-todos-front-src-routes-dashboard-todos-create-gts"></a>
### `@libs/todos-front/src/routes/dashboard/todos/create.gts`

```gts
import Route from '@ember/routing/route';

export type TodosCreateRouteSignature = {
  model: Awaited<ReturnType<TodosCreateRoute['model']>>;
  controller: undefined;
};

export default class TodosCreateRoute extends Route {}
```

<a id="ref-libs-todos-front-src-routes-dashboard-todos-create-template-gts"></a>
### `@libs/todos-front/src/routes/dashboard/todos/create-template.gts`

```gts
import { TodoChangeset } from '#src/changesets/todo.ts';
import TodosForm from '#src/components/forms/todo-form.gts';
import Component from '@glimmer/component';
import type { TodosCreateRouteSignature } from './create.gts';
import type Owner from '@ember/owner';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import { createTodoValidationSchema } from '#src/components/forms/todo-validation.ts';

export default class TodosCreateRouteTemplate extends Component<TodosCreateRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof createTodoValidationSchema>;
  changeset = new TodoChangeset({});

  constructor(owner: Owner, args: TodosCreateRouteSignature) {
    super(owner, args);
    this.validationSchema = createTodoValidationSchema(this.intl);
  }

  <template>
    <TodosForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
```

<a id="ref-libs-todos-front-src-routes-dashboard-todos-edit-gts"></a>
### `@libs/todos-front/src/routes/dashboard/todos/edit.gts`

```gts
import type { Todo } from '#src/schemas/todos.ts';
import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { Store } from '@warp-drive/core';
import { findRecord } from '@warp-drive/utilities/json-api';

export type TodosEditRouteSignature = {
  model: Awaited<ReturnType<TodosEditRoute['model']>>;
  controller: undefined;
};

export default class TodosEditRoute extends Route {
  @service declare store: Store;

  async model({ todo_id }: { todo_id: string }) {
    const todo = await this.store.request(
      findRecord<Todo>('todos', todo_id, {
        include: [],
      })
    );

    assert('Todo must not be null', todo.content.data !== null);
    const data = todo.content.data;

    return {
      todo: data,
    };
  }
}
```

<a id="ref-libs-todos-front-src-routes-dashboard-todos-edit-template-gts"></a>
### `@libs/todos-front/src/routes/dashboard/todos/edit-template.gts`

```gts
import { TodoChangeset } from '#src/changesets/todo.ts';
import TodosForm from '#src/components/forms/todo-form.gts';
import Component from '@glimmer/component';
import type { TodosEditRouteSignature } from './edit.gts';
import { editTodoValidationSchema } from '#src/components/forms/todo-validation.ts';
import type { IntlService } from 'ember-intl';
import { service } from '@ember/service';
import type Owner from '@ember/owner';

export default class TodosEditRouteTemplate extends Component<TodosEditRouteSignature> {
  @service declare intl: IntlService;
  validationSchema: ReturnType<typeof editTodoValidationSchema>;

  constructor(owner: Owner, args: TodosEditRouteSignature) {
    super(owner, args);
    this.validationSchema = editTodoValidationSchema(this.intl);
  }

  changeset = new TodoChangeset({
    id: this.args.model.todo.id,
    title: this.args.model.todo.title,
    description: this.args.model.todo.description,
    completed: this.args.model.todo.completed,
  });

  <template>
    <TodosForm
      @changeset={{this.changeset}}
      @validationSchema={{this.validationSchema}}
    />
  </template>
}
```

<a id="ref-libs-todos-front-src-changesets-todo-ts"></a>
### `@libs/todos-front/src/changesets/todo.ts`

```ts
import ImmerChangeset from 'ember-immer-changeset';

export interface DraftTodo {
  id?: string | null;
  title?: string;
  description?: string;
  completed?: boolean;
}

export class TodoChangeset extends ImmerChangeset<DraftTodo> {}
```

<a id="ref-libs-todos-front-src-components-forms-todo-form-gts"></a>
### `@libs/todos-front/src/components/forms/todo-form.gts`

```gts
import Component from '@glimmer/component';
import TpkForm from '@triptyk/ember-input-validation/components/tpk-form';
import { service } from '@ember/service';
import type TodoService from '#src/services/todo.ts';
import type { TodoChangeset } from '#src/changesets/todo.ts';
import {
  createTodoValidationSchema,
  editTodoValidationSchema,
  type UpdatedTodo,
  type ValidatedTodo,
} from '#src/components/forms/todo-validation.ts';
import type RouterService from '@ember/routing/router-service';
import { create, fillable, clickable } from 'ember-cli-page-object';
import type FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { t, type IntlService } from 'ember-intl';
import { LinkTo } from '@ember/routing';
import type ImmerChangeset from 'ember-immer-changeset';
import HandleSaveService from '@libs/shared-front/services/handle-save';

interface TodosFormArgs {
  changeset: TodoChangeset;
  validationSchema:
    | ReturnType<typeof createTodoValidationSchema>
    | ReturnType<typeof editTodoValidationSchema>;
}

export default class TodosForm extends Component<TodosFormArgs> {
  @service declare todo: TodoService;
  @service declare router: RouterService;
  @service declare flashMessages: FlashMessageService;
  @service declare intl: IntlService;
  @service declare handleSave: HandleSaveService;

  onSubmit = async (
    data: ValidatedTodo | UpdatedTodo,
    c: ImmerChangeset<ValidatedTodo | UpdatedTodo>
  ) => {
    await this.handleSave.handleSave({
      saveAction: () => this.todo.save(data),
      changeset: c,
      successMessage: 'todos.forms.todo.messages.saveSuccess',
      transitionOnSuccess: 'dashboard.todos',
    });
  };

  tpkButton = () => {};

  <template>
    <TpkForm
      @changeset={{@changeset}}
      @onSubmit={{this.onSubmit}}
      @validationSchema={{@validationSchema}}
      data-test-todos-form
      as |F|
    >
      <div class="grid grid-cols-12 gap-x-6 gap-y-3 max-w-4xl">
        <F.TpkInputPrefab
          @label={{t "todos.forms.todo.labels.title"}}
          @validationField="title"
          class="col-span-12 md:col-span-4"
        />
        <F.TpkTextareaPrefab
          @label={{t "todos.forms.todo.labels.description"}}
          @validationField="description"
          class="col-span-12 md:col-span-5"
        />
        <F.TpkCheckboxPrefab
          @label={{t "todos.forms.todo.labels.completed"}}
          @validationField="completed"
          class="col-span-12 md:col-span-3"
        />
        <div class="col-span-12 flex items-center justify-between gap-2">
          <button type="submit" class="btn btn-primary">
            {{t "todos.forms.todo.actions.submit"}}
          </button>
          <LinkTo
            @route="dashboard.todos"
            class="text-sm text-primary underline text-center mt-2"
          >
            {{t "todos.forms.todo.actions.back"}}
          </LinkTo>
        </div>
      </div>
    </TpkForm>
  </template>
}

export const pageObject = create({
  scope: '[data-test-todos-form]',
  title: fillable('[data-test-tpk-prefab-input-container="title"] input'),
  description: fillable(
    '[data-test-tpk-prefab-textarea-container="description"] textarea'
  ),
  completed: clickable(
    '[data-test-tpk-prefab-checkbox-container="completed"] input'
  ),
  submit: clickable('button[type="submit"]'),
});
```

<a id="ref-libs-todos-front-src-components-forms-todo-validation-ts"></a>
### `@libs/todos-front/src/components/forms/todo-validation.ts`

```ts
import { boolean, object, string } from 'zod';
import type z from 'zod';
import type { IntlService } from 'ember-intl';

export const createTodoValidationSchema = (intl: IntlService) =>
  object({
    title: string(intl.t('todos.forms.todo.validation.titleRequired')).min(
      1,
      intl.t('todos.forms.todo.validation.titleRequired')
    ),
    description: string(
      intl.t('todos.forms.todo.validation.descriptionRequired')
    ).min(1, intl.t('todos.forms.todo.validation.descriptionRequired')),
    completed: boolean(
      intl.t('todos.forms.todo.validation.completedRequired')
    ).optional(),
    id: string().optional().nullable(),
  });

export const editTodoValidationSchema = (intl: IntlService) =>
  object({
    title: string(intl.t('todos.forms.todo.validation.titleRequired')).min(
      1,
      intl.t('todos.forms.todo.validation.titleRequired')
    ),
    description: string(
      intl.t('todos.forms.todo.validation.descriptionRequired')
    ).min(1, intl.t('todos.forms.todo.validation.descriptionRequired')),
    completed: boolean(
      intl.t('todos.forms.todo.validation.completedRequired')
    ).optional(),
    id: string(),
  });

export type ValidatedTodo = z.infer<
  ReturnType<typeof createTodoValidationSchema>
>;

export type UpdatedTodo = z.infer<ReturnType<typeof editTodoValidationSchema>>;
```

<a id="ref-libs-todos-front-tests-integration-todos-form-test-gts"></a>
### `@libs/todos-front/tests/integration/todos-form-test.gts`

```gts
import { describe, expect as hardExpect, vi } from 'vitest';
import { renderingTest } from 'ember-vitest';
import { render } from '@ember/test-helpers';
import { TodoChangeset } from '#src/changesets/todo.ts';
import TodoForm, { pageObject } from '#src/components/forms/todo-form.gts';
import { initializeTestApp, TestApp } from '../app.ts';
import { stubRouter } from '../utils.ts';
import type TodoService from '#src/services/todo.ts';
import { createTodoValidationSchema } from '#src/components/forms/todo-validation.ts';

const expect = hardExpect.soft;

vi.mock('#src/services/todo.ts', async (importActual) => {
  const actual = await importActual<typeof import('#src/services/todo.ts')>();
  return {
    ...actual,
    default: class MockTodoService extends actual.default {
      save = vi.fn();
    },
  };
});

describe('tpk-form', function () {
  // eslint-disable-next-line no-empty-pattern
  renderingTest.scoped({ app: ({}, use) => use(TestApp) });

  renderingTest(
    'Should call todo service when form is valid',
    async function ({ context }) {
      initializeTestApp(context.owner, 'en-us');

      const todoService = context.owner.lookup('service:todo') as TodoService;
      const intl = context.owner.lookup('service:intl');
      const router = stubRouter(context.owner);
      const changeset = new TodoChangeset({});
      const validationSchema = createTodoValidationSchema(intl);

      await render(
        <template>
          <TodoForm
            @changeset={{changeset}}
            @validationSchema={{validationSchema}}
          />
        </template>
      );

      await pageObject.title('Test Todo');
      await pageObject.description('Test Description');
      await pageObject.completed();
      await pageObject.submit();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(todoService.save).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(router.transitionTo).toHaveBeenCalledWith('dashboard.todos');
    }
  );

  renderingTest(
    'Should not call todo service when form is invalid',
    async function ({ context }) {
      initializeTestApp(context.owner, 'en-us');

      const todoService = context.owner.lookup('service:todo') as TodoService;
      const intl = context.owner.lookup('service:intl');
      const router = stubRouter(context.owner);

      router.transitionTo = vi.fn().mockResolvedValue(undefined);

      const changeset = new TodoChangeset({});
      const validationSchema = createTodoValidationSchema(intl);

      await render(
        <template>
          <TodoForm
            @changeset={{changeset}}
            @validationSchema={{validationSchema}}
          />
        </template>
      );

      await pageObject.title('');
      await pageObject.description('');
      await pageObject.completed();
      await pageObject.submit();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(todoService.save).not.toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(router.transitionTo).not.toHaveBeenCalled();
    }
  );
});
```

<a id="ref-libs-todos-front-src-services-todo-ts"></a>
### `@libs/todos-front/src/services/todo.ts`

```ts
import type { Todo } from '#src/schemas/todos.ts';
import {
  type UpdatedTodo,
  type ValidatedTodo,
} from '#src/components/forms/todo-validation.ts';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import { service } from '@ember/service';
import { cacheKeyFor, type Store } from '@warp-drive/core';
import {
  createRecord,
  deleteRecord,
  updateRecord,
} from '@warp-drive/utilities/json-api';
import type ImmerChangeset from 'ember-immer-changeset';

export default class TodoService extends Service {
  @service declare store: Store;

  public async save(data: ValidatedTodo | UpdatedTodo) {
    if (data.id) {
      return this.update(data as UpdatedTodo);
    } else {
      return this.create(data as ValidatedTodo);
    }
  }

  public async create(data: ValidatedTodo) {
    const todo = this.store.createRecord<Todo>('todos', data);
    const request = createRecord(todo);

    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(todo)),
    });

    await this.store.request(request);
  }

  public async update(
    data: UpdatedTodo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changeset?: ImmerChangeset<ValidatedTodo>
  ) {
    const existingTodo = this.store.peekRecord<Todo>({
      id: data.id,
      type: 'todos',
    });
    assert('Todo must exist to be updated', existingTodo);

    Object.assign(existingTodo, {
      title: data.title,
      description: data.description,
      completed: data.completed ?? false,
    });

    const request = updateRecord(existingTodo, { patch: true });
    request.body = JSON.stringify({
      data: this.store.cache.peek(cacheKeyFor(existingTodo)),
    });

    await this.store.request(request);
  }

  public async delete(data: UpdatedTodo) {
    const existingTodo = this.store.peekRecord<Todo>({
      id: data.id,
      type: 'todos',
    });
    assert('Todo must exist to be deleted', existingTodo);
    const request = deleteRecord(existingTodo);
    request.body = JSON.stringify({});
    return this.store.request(request);
  }
}
```

<a id="ref-libs-todos-front-src-http-mocks-todos-ts"></a>
### `@libs/todos-front/src/http-mocks/todos.ts`

```ts
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';

const mockTodos = [
  {
    id: '1',
    type: 'todos' as const,
    attributes: {
      title: 'Eat 100 Raffaello',
      description: 'I need to eat 100 Raffaello to be happy',
      completed: false,
    },
  },
  {
    id: '2',
    type: 'todos' as const,
    attributes: {
      title: 'Eat a Durum with Stephane',
      description: 'Restaurant La Macchina, 18:00',
      completed: true,
    },
  },
  {
    id: '3',
    type: 'todos' as const,
    attributes: {
      title: 'Call my mom',
      description: 'I need to call my mom to wish her happy birthday',
      completed: false,
    },
  },
];

export default [
  http.get('/api/v1/todos/:id', (req) => {
    const { id } = req.params;
    const todo = mockTodos.find((todo) => todo.id === id);
    if (todo) {
      return HttpResponse.json({
        data: todo,
      });
    } else {
      return HttpResponse.json(
        {
          message: 'Not Found',
          code: 'TODO_NOT_FOUND',
        },
        { status: 404 }
      );
    }
  }),
  http.get('/api/v1/todos', ({ request }) => {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('filter[search]');
    const sortParam = url.searchParams.get('sort');

    let results = [...mockTodos];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((todo) => {
        const title = todo.attributes.title.toLowerCase();
        const description = todo.attributes.description.toLowerCase();
        return title.includes(query) || description.includes(query);
      });
    }

    if (sortParam) {
      const isDescending = sortParam.startsWith('-');
      const field = isDescending ? sortParam.slice(1) : sortParam;

      results.sort((a, b) => {
        let aValue: string | undefined;
        let bValue: string | undefined;

        if (field === 'title' || field === 'description') {
          aValue = a.attributes[field];
          bValue = b.attributes[field];
        }

        if (aValue === undefined || bValue === undefined) {
          return 0;
        }

        const comparison = aValue.localeCompare(bValue);
        return isDescending ? -comparison : comparison;
      });
    }

    return HttpResponse.json({
      data: results,
      meta: {
        total: results.length,
      },
    });
  }),
  http.post('/api/v1/todos', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;

    return HttpResponse.json({
      data: {
        id: json.data.lid,
        type: 'todos' as const,
        attributes: json.data.attributes,
      },
    });
  }),
  http.patch('/api/v1/todos/:id', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;

    return HttpResponse.json({
      data: {
        id: json.data.lid,
        type: 'todos' as const,
        attributes: json.data.attributes,
      },
    });
  }),
  http.put('/api/v1/todos/:id', async (req) => {
    const json = (await req.request.json()) as Record<string, any>;

    return HttpResponse.json({
      data: {
        id: json.data.id,
        type: 'todos' as const,
        attributes: json.data.attributes,
      },
    });
  }),
  http.delete('/api/v1/todos/:id', (req) => {
    const { id } = req.params;
    const todo = mockTodos.find((todo) => todo.id === id);
    if (todo) {
      return HttpResponse.json(
        {
          message: 'Todo deleted successfully',
          code: 'TODO_DELETED_SUCCESSFULLY',
        },
        { status: 200 }
      );
    }
  }),
];
```

<a id="ref-libs-todos-front-tests-unit-todo-test-gts"></a>
### `@libs/todos-front/tests/unit/todo-test.gts`

```gts
import { beforeAll, describe } from 'vitest';
import { test } from 'ember-vitest';
import { initializeTestApp, TestApp } from '../app';
import type { Store } from '@warp-drive/core';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';
import type TodoService from '#src/services/todo.ts';
import type { ValidatedTodo } from '#src/components/forms/todo-validation.ts';

const handlers = [
  http.post('/todos', () => {
    return HttpResponse.json({
      data: {
        type: 'todos',
        id: 'new-todo-id',
        attributes: {},
      },
    });
  }),
  http.patch('/todos/:id', (ctx) => {
    return HttpResponse.json({
      data: {
        type: 'todos',
        id: ctx.params['id'],
        attributes: {},
      },
    });
  }),
];

describe('Service | Todo | Unit', () => {
  // eslint-disable-next-line no-empty-pattern
  test.scoped({ app: ({}, use) => use(TestApp) });

  beforeAll(async () => {
    const worker = setupWorker(...handlers);
    await worker.start();
    return () => {
      worker.stop();
    };
  });

  test('if todo does not already exists in store, it creates it with a POST request', async ({
    context,
  }) => {
    initializeTestApp(context.owner, 'en-us');
    const todoService = context.owner.lookup('service:todo') as TodoService;
    const data = {
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
    } as ValidatedTodo;
    await todoService.save(data);
  });

  test('if todo already exists in store, it updates it with a PATCH request', async ({
    context,
  }) => {
    initializeTestApp(context.owner, 'en-us');
    const todoService = context.owner.lookup('service:todo') as TodoService;
    const store = context.owner.lookup('service:store') as Store;
    const data = {
      id: '123',
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
    } as ValidatedTodo;
    store.createRecord('todos', data);

    await todoService.save(data);
  });
});
```

<a id="ref-libs-todos-front-src-components-todo-table-gts"></a>
### `@libs/todos-front/src/components/todo-table.gts`

```gts
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import TableGenericPrefab, {
  type TableParams,
} from '@triptyk/ember-ui/components/prefabs/tpk-table-generic-prefab';
import TpkButton from '@triptyk/ember-input/components/prefabs/tpk-prefab-button';
import TpkConfirmModalPrefab from '@triptyk/ember-ui/components/prefabs/tpk-confirm-modal-prefab';
import { t, type IntlService } from 'ember-intl';
import EditIcon from '#src/assets/icons/edit.gts';
import DeleteIcon from '#src/assets/icons/delete.gts';
import CompletedIcon from '#src/assets/icons/completed.gts';
import type { TOC } from '@ember/component/template-only';
import type TodoService from '#src/services/todo.ts';
import type { UpdatedTodo } from './forms/todo-validation';
import { tracked } from '@glimmer/tracking';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import { hash } from '@ember/helper';
import type { Todo } from '#src/schemas/todos.ts';
import TpkCheckboxComponent from '@triptyk/ember-input/components/tpk-checkbox';

interface TodoCheckboxComponentArgs {
  Args: {
    row: Todo;
  };
  Blocks: {
    default: [];
  };
}

const TodoCheckboxComponent: TOC<TodoCheckboxComponentArgs> = <template>
  <TpkCheckboxComponent @label="123" @checked={{@row.completed}} as |C|>
    <C.Input class="checkbox disabled" />
  </TpkCheckboxComponent>
</template>;

class TodosTable extends Component<object> {
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service declare todo: TodoService;
  @service declare flashMessages: FlashMessagesService;

  @tracked selectedTodoForDelete: UpdatedTodo | null = null;

  get isModalOpen(): boolean {
    return this.selectedTodoForDelete !== null;
  }

  get confirmQuestion(): string {
    return this.intl.t('todos.table.confirmModal.question');
  }

  get tableParams(): TableParams {
    return {
      entity: 'todos',
      pageSizes: [10, 30, 50, 75],
      rowClick: (element) => {
        this.router.transitionTo(
          'dashboard.todos.edit',
          (element as { id: string }).id
        );
      },
      defaultSortColumn: 'title',
      columns: [
        {
          field: 'title',
          headerName: this.intl.t('todos.table.headers.title'),
          sortable: true,
        },
        {
          field: 'description',
          headerName: this.intl.t('todos.table.headers.description'),
          sortable: true,
        },
        {
          field: 'completed',
          headerName: this.intl.t('todos.table.headers.completed'),
          sortable: false,
          component: 'todoCheckbox',
        },
      ],
      actionMenu: [
        {
          icon: <template><EditIcon class="size-4" /></template> as TOC<{
            Element: SVGSVGElement;
          }>,
          action: (element: unknown) => {
            this.router.transitionTo(
              'dashboard.todos.edit',
              (element as { id: string }).id
            );
          },
          name: this.intl.t('todos.table.actions.edit'),
        },
        {
          icon: <template><CompletedIcon class="size-4" /></template> as TOC<{
            Element: SVGSVGElement;
          }>,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          action: async (element: unknown) => {
            await this.onChangeCompleted(element as UpdatedTodo);
          },
          name: this.intl.t('todos.table.actions.changeCompleted'),
        },
        {
          icon: <template><DeleteIcon class="size-4" /></template> as TOC<{
            Element: SVGSVGElement;
          }>,
          action: (element: unknown) => {
            this.openModalOnDelete(element as UpdatedTodo);
          },
          name: this.intl.t('todos.table.actions.delete'),
        },
      ],
    };
  }

  onChangeCompleted = async (element: UpdatedTodo) => {
    element.completed = !element.completed;
    await this.todo.update(element);
  };

  onAddTodo = () => {
    this.router.transitionTo('dashboard.todos.create');
  };

  openModalOnDelete = (element: UpdatedTodo) => {
    this.selectedTodoForDelete = element;
  };

  onCloseModal = () => {
    this.selectedTodoForDelete = null;
  };

  onConfirmDelete = async () => {
    if (this.selectedTodoForDelete) {
      try {
        await this.todo.delete(this.selectedTodoForDelete);
        this.flashMessages.success(
          this.intl.t('todos.forms.todo.messages.deleteSuccess')
        );
      } catch {
        this.flashMessages.danger(
          this.intl.t('todos.forms.todo.messages.deleteError')
        );
      }
      this.onCloseModal();
    }
  };

  <template>
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold">{{t "todos.pages.list.title"}}</h1>
      <TpkButton
        @label={{t "todos.table.actions.addTodo"}}
        @onClick={{this.onAddTodo}}
      />
    </div>
    <TableGenericPrefab
      @tableParams={{this.tableParams}}
      @columnsComponent={{hash todoCheckbox=(component TodoCheckboxComponent)}}
    />
    <TpkConfirmModalPrefab
      @onClose={{this.onCloseModal}}
      @onConfirm={{this.onConfirmDelete}}
      @icon=""
      @cancelText={{t "global.cancel"}}
      @confirmText={{t "global.confirm"}}
      @confirmQuestion={{this.confirmQuestion}}
      @isOpen={{this.isModalOpen}}
    />
  </template>
}

export default TodosTable;
```

<a id="ref-apps-front-app-routes-application-ts"></a>
### `@apps/front/app/routes/application.ts`

```ts
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { IntlService } from 'ember-intl';
import { setupWorker } from 'msw/browser';
import { initialize as initializeUserLib } from '@libs/users-front';
import { initialize as initializeTodoLib } from '@libs/todos-front';
import { getOwner } from '@ember/-internals/owner';
import type SessionService from '@apps/front/services/session';
import allUsersHandlers from '@libs/users-front/http-mocks/all';
import allTodosHandlers from '@libs/todos-front/http-mocks/all';
import setTheme from '../utils/set-theme';
import translationsForFrFr from 'virtual:ember-intl/translations/fr-fr';
import translationsForEnUs from 'virtual:ember-intl/translations/en-us';

export default class ApplicationRoute extends Route {
  @service declare intl: IntlService;
  @service declare session: SessionService;
  worker?: ReturnType<typeof setupWorker>;

  async beforeModel() {
    setTheme();
    this.intl.setLocale('en-us');

    this.intl.addTranslations('fr-fr', translationsForFrFr);
    this.intl.addTranslations('en-us', translationsForEnUs);

    // Skip MSW when running against real backend (e2e tests)
    if (import.meta.env.VITE_MOCK_API !== 'false') {
      const worker = setupWorker(...allUsersHandlers, ...allTodosHandlers);
      this.worker = worker;
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
    }

    await initializeUserLib(getOwner(this)!);
    initializeTodoLib(getOwner(this)!);
  }

  willDestroy() {
    this.worker?.stop();
    return super.willDestroy();
  }
}
```

<a id="ref-apps-front-app-router-ts"></a>
### `@apps/front/app/router.ts`

```ts
import EmberRouter from '@embroider/router';
import config from '@apps/front/config/environment';
import { forRouter as userLibRouter, authRoutes } from '@libs/users-front';
import { forRouter as todosLibRouter } from '@libs/todos-front';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('dashboard', { path: '/' }, function () {
    userLibRouter.call(this);
    todosLibRouter.call(this);
  });
  authRoutes.call(this);
});
```

<a id="ref-apps-front-package-json"></a>
### `@apps/front/package.json`

```json
{
  "name": "@apps/front",
  "version": "0.0.0",
  "private": true,
  "description": "Small description for @apps/front goes here",
  "repository": "",
  "license": "MIT",
  "author": "",
  "directories": {
    "doc": "doc",
    "test": "tests"
  },
  "scripts": {
    "build": "vite build",
    "format": "prettier . --cache --write",
    "lint": "concurrently \"pnpm:lint:*(!fix)\" --names \"lint:\" --prefixColors auto",
    "lint:css": "stylelint \"**/*.css\"",
    "lint:css:fix": "concurrently \"pnpm:lint:css -- --fix\"",
    "lint:fix": "concurrently \"pnpm:lint:*:fix\" --names \"fix:\" --prefixColors auto && pnpm format",
    "lint:format": "prettier . --cache --check",
    "lint:hbs": "ember-template-lint .",
    "lint:hbs:fix": "ember-template-lint . --fix",
    "lint:js": "eslint . --cache",
    "lint:js:fix": "eslint . --fix",
    "lint:types": "ember-tsc",
    "start": "concurrently \"pnpm turbo build:watch --filter=^...\" \"vite dev\"",
    "start:with-back": "VITE_MOCK_API=false concurrently \"pnpm turbo build:watch --filter=^...\" \"vite dev\"",
    "test": "pnpm vitest run",
    "test:watch": "pnpm vitest",
    "test:playwright": "playwright test"
  },
  "exports": {
    "./tests/*": "./tests/*",
    "./*": "./app/*"
  },
  "devDependencies": {
    "@babel/core": "catalog:",
    "@babel/eslint-parser": "~7.28.6",
    "@babel/plugin-transform-runtime": "catalog:",
    "@babel/plugin-transform-typescript": "~7.28.6",
    "@babel/runtime": "~7.29.2",
    "@ember-data/debug": "catalog:",
    "@ember-intl/vite": "catalog:",
    "@ember/app-tsconfig": "^2.0.0",
    "@ember/optional-features": "catalog:",
    "@ember/string": "catalog:",
    "@ember/test-helpers": "^5.4.2",
    "@ember/test-waiters": "catalog:",
    "@embroider/compat": "catalog:",
    "@embroider/config-meta-loader": "catalog:",
    "@embroider/core": "catalog:",
    "@embroider/legacy-inspector-support": "catalog:",
    "@embroider/macros": "catalog:",
    "@embroider/router": "catalog:",
    "@embroider/vite": "catalog:",
    "@eonasdan/tempus-dominus": "catalog:",
    "@eslint/js": "^10.0.1",
    "@glimmer/component": "catalog:",
    "@glint/ember-tsc": "catalog:",
    "@glint/template": "catalog:",
    "@libs/todos-front": "workspace:^",
    "@libs/users-front": "workspace:^",
    "@playwright/test": "catalog:",
    "@rollup/plugin-babel": "^7.0.0",
    "@tailwindcss/vite": "catalog:",
    "@triptyk/ember-input": "catalog:",
    "@triptyk/ember-input-validation": "catalog:",
    "@triptyk/ember-ui": "catalog:",
    "@triptyk/ember-yeti-table": "^3.0.0",
    "@types/node": "^25.6.0",
    "@types/rsvp": "catalog:",
    "@vitest/browser": "^4.1.5",
    "@vitest/browser-playwright": "catalog:",
    "@warp-drive/build-config": "catalog:",
    "@warp-drive/core": "catalog:",
    "@warp-drive/core-types": "catalog:",
    "@warp-drive/ember": "catalog:",
    "@warp-drive/experiments": "catalog:",
    "@warp-drive/json-api": "catalog:",
    "@warp-drive/legacy": "catalog:",
    "@warp-drive/utilities": "catalog:",
    "babel-plugin-ember-template-compilation": "^4.0.0",
    "concurrently": "^9.2.1",
    "daisyui": "catalog:",
    "decorator-transforms": "catalog:",
    "ember-auto-import": "~2.13.1",
    "ember-cli": "catalog:",
    "ember-cli-babel": "catalog:",
    "ember-cli-deprecation-workflow": "catalog:",
    "ember-cli-flash": "catalog:",
    "ember-cli-page-object": "catalog:",
    "ember-concurrency": "catalog:",
    "ember-flatpickr": "catalog:",
    "ember-immer-changeset": "catalog:",
    "ember-intl": "catalog:",
    "ember-load-initializers": "catalog:",
    "ember-modifier": "catalog:",
    "ember-page-title": "catalog:",
    "ember-resolver": "catalog:",
    "ember-simple-auth": "catalog:",
    "ember-simple-auth-token": "catalog:",
    "ember-source": "catalog:",
    "ember-strict-application-resolver": "catalog:",
    "ember-template-lint": "^7.9.3",
    "ember-vitest": "catalog:",
    "eslint": "^10.3.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-ember": "^13.2.1",
    "eslint-plugin-n": "^18.0.0",
    "flatpickr": "catalog:",
    "globals": "catalog:",
    "msw": "2.14.3",
    "openapi-msw": "catalog:",
    "prettier": "^3.8.3",
    "prettier-plugin-ember-template-tag": "^2.1.5",
    "stylelint": "catalog:",
    "stylelint-config-standard": "catalog:",
    "stylelint-config-tailwindcss": "^1.0.1",
    "tailwindcss": "catalog:",
    "testem": "^3.20.0",
    "tracked-built-ins": "catalog:",
    "typescript": "catalog:",
    "typescript-eslint": "~8.59.2",
    "vite": "8.0.10",
    "vitest": "catalog:",
    "zod": "catalog:"
  },
  "engines": {
    "node": ">= 20"
  },
  "ember": {
    "edition": "octane"
  },
  "volta": {
    "extends": "../../package.json"
  },
  "msw": {
    "workerDirectory": [
      "public"
    ]
  }
}
```

<a id="ref-apps-front-app-services-store-ts"></a>
### `@apps/front/app/services/store.ts`

```ts
import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';
import UserSchema from '@libs/users-front/schemas/users';
import { setBuildURLConfig } from '@warp-drive/utilities';
import { CacheHandler, Fetch, RequestManager } from '@warp-drive/core';
import type Owner from '@ember/owner';
import { LegacyNetworkHandler } from '@warp-drive/legacy/compat';
import { setOwner } from '@ember/owner';
import AuthHandler from '@libs/users-front/handlers/auth';
import { getOwner } from '@ember/owner';
import TodoSchema from '@libs/todos-front/schemas/todos';

setBuildURLConfig({
  host: null,
  namespace: 'api/v1',
});

const legacyStore = useLegacyStore({
  linksMode: false,
  legacyRequests: true,
  modelFragments: true,
  cache: JSONAPICache,
  schemas: [UserSchema, TodoSchema],
  handlers: [],
});

export default class MyStore extends legacyStore {
  constructor(owner: Owner) {
    super(owner);

    const authHandler = new AuthHandler();
    setOwner(authHandler, getOwner(this)!);

    const manager = new RequestManager();

    setOwner(this.requestManager, getOwner(this)!);

    this.requestManager = manager
      .use([authHandler, LegacyNetworkHandler, Fetch])
      .useCache(CacheHandler);
  }
}
```

<a id="ref-apps-front-app-styles-app-css"></a>
### `@apps/front/app/styles/app.css`

```css
/* Ember supports plain CSS out of the box. More info: https://cli.emberjs.com/release/advanced-use/stylesheets/ */
@import 'tailwindcss';
@import '@triptyk/ember-input/dist/app.css';
@import '@triptyk/ember-ui/dist/app.css';
@import '@triptyk/ember-input-validation/dist/app.css';
@import './auth.css';
@import './flash.css';

@plugin "daisyui" {
  themes:
    nord --default,
    dracula,
    cupcake,
    corporate,
    lemonade;
}

/* Additional global styles can be added below */
@source "../../node_modules/@triptyk/ember-ui";
@source "../../node_modules/@triptyk/ember-input";
@source "../../node_modules/@triptyk/ember-input-validation";
@source "../../node_modules/@libs/users-front";
@source "../../node_modules/@libs/todos-front";
```
