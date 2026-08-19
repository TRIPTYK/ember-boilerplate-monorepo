# Introduction du Boilerplate

- Explication de la structure d'une lib avec celle de la "user"

## Règles globales frontend

- Une librairie ne fait pas de tests d'acceptance
- Tous les appels API faits par les tests sont **mockés** : `vi.mock` sur le service pour les tests d'intégration, `mockApi` (chaîne de requêtes WarpDrive) pour les tests unitaires de service. Les appels réels sont faits par les tests e2e.
- Les tests e2e sont implémentés par les users stories.
- Les traductions sont gérées par les apps et pas par les libs. Les libs exportent des clés de traduction et les apps font le lien entre ces clés et les traductions. Elles se trouvent dans le dossier "translations" de l'app et sont organisées par librairie (ex: `@apps/front/app/translations/todos/en-us.yaml` pour les traductions de la librairie "todos" en anglais américain).

## Librairies

- ember common uis: https://github.com/TRIPTYK/ember-common-ui
- immer changeset: https://github.com/TRIPTYK/ember-immer-changeset
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
    
    |> contient une factory `createTestStore(handlers)` qui construit un store basé sur `useLegacyStore` de @warp-drive, en insérant les handlers de mock dans la chaîne de requêtes
    
    |> contient une fonction d'initialisation de l'application de test `export async function initializeTestApp(owner: Owner, locale: string, handlers: Handler[] = [])`
    
    mock-api.ts
    
    |> contient `mockApi(routes)`, qui construit un handler WarpDrive répondant aux requêtes déclarées (`'POST /todos'`, `'PATCH /todos/:id'`, ...). C'est ce qui remplace un serveur de mock HTTP : voir [api-mocking](../agent-os/standards/testing/api-mocking.md)
    
    test-helper.ts
    
    |> contient éventuellement des fonctions à définir dans les hooks globaux (beforeEach, afterEach) pour les tests de la librairie
    
    utils.ts
    
    |> Des éventuels utilitaires pour les tests dans la librairie


3. Création de [src/index.ts](../@libs/todos-front/src/index.ts)
   - Contient la fonction `initialize(owner: Owner)` pour initialiser la librairie
   - Contient la fonction `moduleRegistry()` qui retourne le registre des modules exportés
   - Contient la fonction `forRouter(this: DSL)` qui exporte le router de la librairie avec les routes `todos`, `todos.create` et `todos.edit`

4. Création du schéma pour les "todo" dans [src/schemas/todos.ts](../@libs/todos-front/src/schemas/todos.ts)
   - Définit le schéma Warp Drive pour l'entité "todo"

5. Création des routes et de leur template pour "todo" (create, edit et list)
   - Les routes et leur template sont créées dans le dossier [src/routes/dashboard/todos](../@libs/todos-front/src/routes/dashboard/todos)
   - [src/routes/dashboard/todos/index.gts](../@libs/todos-front/src/routes/dashboard/todos/index.gts) - Route de listing des todos
   - [src/routes/dashboard/todos/index-template.gts](../@libs/todos-front/src/routes/dashboard/todos/index-template.gts) - Template de la route de listing
   - [src/routes/dashboard/todos/create.gts](../@libs/todos-front/src/routes/dashboard/todos/create.gts) - Route de création d'un todo
   - [src/routes/dashboard/todos/create-template.gts](../@libs/todos-front/src/routes/dashboard/todos/create-template.gts) - Template de la route de création
   - [src/routes/dashboard/todos/edit.gts](../@libs/todos-front/src/routes/dashboard/todos/edit.gts) - Route d'édition d'un todo
   - [src/routes/dashboard/todos/edit-template.gts](../@libs/todos-front/src/routes/dashboard/todos/edit-template.gts) - Template de la route d'édition
   - Le nom du template est toujours le même que celui de la route + "-template.gts"

6. Création du changeset pour "todo" dans [src/changesets/todo.ts](../@libs/todos-front/src/changesets/todo.ts)
7. Création du formulaire de création/update de "todo" dans [src/components/forms/todo-form.gts](../@libs/todos-front/src/components/forms/todo-form.gts)
   - Composant Glimmer qui utilise `TpkForm` de `@triptyk/ember-input-validation`
   - Gère la soumission du formulaire via le service `TodoService`
   - Affiche les messages flash de succès/erreur

8. Création de la validation du formulaire de "todo" dans [src/components/forms/todo-validation.ts](../@libs/todos-front/src/components/forms/todo-validation.ts) avec zod et son intégration dans le changeset de "todo"
   - Exporte `createTodoValidationSchema(intl: IntlService)` qui retourne un schéma Zod
   - Définit les règles de validation pour `title`, `description`, `completed` et `id`
   - Utilise les traductions via le service Intl pour les messages d'erreur

9. Création du test d'intégration du formulaire dans [tests/integration/todos-form-test.gts](../@libs/todos-front/tests/integration/todos-form-test.gts)
   - Teste le rendu du formulaire avec `renderingTest` de `ember-vitest`
   - Vérifie la validation des champs et la soumission du formulaire
   - Utilise `initializeTestApp` et `TestApp` pour configurer l'environnement de test

10. Création du service de sauvegarde de "todo" dans [src/services/todo.ts](../@libs/todos-front/src/services/todo.ts)
    - Service Ember qui utilise le Store Warp Drive pour créer, mettre à jour et supprimer des todos
    - Méthodes `createTodo(changeset)`, `updateTodo(changeset)` et `deleteTodo(todo)`
    - Utilise `createRecord`, `updateRecord` et `deleteRecord` de `@warp-drive/utilities/json-api`

11. Création du test unitaire du service de sauvegarde de "todo" dans [tests/unit/todo-test.gts](../@libs/todos-front/tests/unit/todo-test.gts)
    - Teste les méthodes `createTodo`, `updateTodo` et `deleteTodo` du service
    - Utilise `mockApi` de [tests/mock-api.ts](../@libs/todos-front/tests/mock-api.ts) pour répondre aux requêtes depuis la chaîne de requêtes du store, sans réseau
    - Les handlers sont passés à `initializeTestApp(owner, locale, [todosApi])`
    - Vérifie que les appels sont correctement effectués et que les données sont bien sauvegardées dans le store

12. Création du composant todo-table dans [src/components/todo-table.gts](../@libs/todos-front/src/components/todo-table.gts) qui affiche la liste des "todos" et qui est utilisé dans la route de listing des "todos"
    - Utilise `TpkTableGenericPrefab` de `@triptyk/ember-ui` pour afficher un tableau
    - Affiche les colonnes: titre, description, statut (complété/non complété)
    - Contient des actions pour éditer, supprimer et changer le statut d'un todo
    - Utilise `TpkConfirmModalPrefab` pour confirmer la suppression

13. Liaison de la librairie avec l'application frontend
    - Initialisation dans [@apps/front/app/routes/application.ts](../@apps/front/app/routes/application.ts)
      - Import de `initialize` depuis `@libs/todos-front`
      - Appel de `initializeTodoLib(getOwner(this)!)` dans `beforeModel()`
    - Injection du router dans [@apps/front/app/router.ts](../@apps/front/app/router.ts)
      - Import de `forRouter as todosLibRouter` depuis `@libs/todos-front`
      - Appel de `todosLibRouter.call(this)` dans la route `dashboard`
    - Ajout dans les devDependencies de l'application frontend dans [@apps/front/package.json](../@apps/front/package.json)
      - Ajout de `"@libs/todos-front": "workspace:*"` dans les `devDependencies`
    - Ajout du store "todo" dans [@apps/front/app/services/store.ts](../@apps/front/app/services/store.ts)
      - Import de `TodoSchema` depuis `@libs/todos-front/schemas/todos`
      - Ajout de `TodoSchema` dans le tableau `schemas` de `useLegacyStore`
    - Ajout de la librairie "todo" dans [@apps/front/app/styles/app.css](../@apps/front/app/styles/app.css) avec la ligne `@source "../../node_modules/@libs/todos-front";` pour intépréter le CSS.

14. Réalisation d'un test d'acceptance dans `@apps/front/tests/acceptance/todo-acceptance-test.gts` pour tester le parcours de création d'une "todo" jusqu'à son affichage dans la liste des "todos".
    - Teste le flux complet: navigation vers la page de création, remplissage du formulaire, soumission, redirection vers la liste, vérification de l'affichage

15. Réalisation d'un test e2e dans `@apps/e2e/tests/todo-e2e-test.gts` basé sur un user story.
    - Teste le parcours utilisateur complet avec une vraie interaction navigateur
    - Utilise Playwright ou un autre outil e2e pour simuler les actions utilisateur

16. Ingestion d'un Raffaello comme récompense pour ce dur labeur.
