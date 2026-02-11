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


3. Création de [src/index.ts](./frontend/src/index.ts)
4. Création du schéma pour les "todo" [src/schemas/todo.ts](./frontend/src/schemas/todo.ts)
5. Création des routes et de leur template pour "todo" (create, edit et list)
   - Les routes et leur template sont créées dans le dossier [src/routes](./frontend/src/routes).
   - Le nom du template est toujours le même que celui de la route + "-template.gts" (ex: pour la route `src/routes/dashboard/todos/index.gts`, le template sera `src/routes/dashboard/todos/index-template.gts`)
6. Création du changeset pour "todo" dans `src/changesets/todo.ts`
7. Création du formulaire de création/update de "todo" dans `src/components/forms/todo-form.gts`
8. Création de la validation du formulaire de "todo" dans `src/components/todo-validation.ts` avec zod et son intégration dans le changeset de "todo"
9. Création du test d'intégration du formulaire dans `tests/integration/components/forms/todo-form-test.gts`
10. Création du service de sauvegarde de "todo" dans `src/services/todo.ts`
11. Création du mock msw pour les appels API de "todo" dans `src/http-mocks/todo.ts`
12. Création du test unitaire du service de sauvegarde de "todo" dans `tests/unit/services/todo-test.gts`
13. Création du composant todo-table dans `src/components/todo-table.gts` qui affiche la liste des "todos" et qui est utilisé dans la route de listing des "todos"
14. (optionel) Création du test d'intégration du composant todo-table dans `tests/integration/components/todo-table-test.gts`
15. Liaison de la librairie avec l'application frontend 
    - Initialisation dans `@apps/front/app/routes/application.gts`
    - Importation des mocks dans `@apps/front/app/routes/application.gts`
    - Injection du router dans `@apps/front/app/routes/router.ts`
    - Ajout dans les devDependencies de l'application frontend dans `@apps/front/package.json`
    - Ajout du store "todo" dans `@apps/front/app/services/store.ts`
    - Ajout du style de la librairie "todo" dans `@apps/front/app/styles/app.css` avec la ligne `@source "../../node_modules/@libs/todos-front";`
16. Réalisation d'un test d'acceptance dans `@apps/front/tests/acceptance/todo-acceptance-test.gts` pour tester le parcours de création d'une "todo" jusqu'à son affichage dans la liste des "todos".
17. Réalisation d'un test e2e dans `@apps/e2e/tests/todo-e2e-test.gts` basé sur un user story.
18. Ingestion d'un Raffaello comme récompense pour ce dur labeur.
