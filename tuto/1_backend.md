# Introduction du Boilerplate

- Explication de la structure d'une lib backend avec celle du "user"

## Règles globales backend

- Chaque librairie backend est un **module Fastify** indépendant qui implémente l'interface `ModuleInterface` de `@libs/backend-shared`.
- Les réponses API suivent le format **JSON:API** (sérialisation via des helpers de `@libs/backend-shared`).
- La validation des requêtes est faite via **Zod** intégré directement dans les schémas de routes Fastify (`fastify-type-provider-zod`).
- Chaque route est une **classe** qui implémente l'interface `Route` de `@libs/backend-shared`.
- Les tests d'intégration utilisent une **vraie base de données PostgreSQL** via `@testcontainers/postgresql` (conteneur Docker éphémère).
- Les tests unitaires sont isolés et ne nécessitent pas de base de données.
- L'isolation des tests d'intégration est assurée par des **transactions rollback** (`em.begin()` / `em.rollback()` autour de chaque test). Avec aroundEach() de Vitest.
- Les entités de chaque librairie sont exportées et enregistrées dans la configuration MikroORM de l'application principale (`@apps/backend/src/app/database.connection.ts`).

## Librairies

- Fastify: https://fastify.dev
- MikroORM: https://mikro-orm.io
- Zod: https://zod.dev
- fastify-type-provider-zod: https://github.com/turkerdev/fastify-type-provider-zod
- Vitest: https://vitest.dev
- Testcontainers: https://testcontainers.com
- Argon2: https://github.com/ranisalt/node-argon2
- JSON Web Token: https://github.com/auth0/node-jsonwebtoken
- @libs/backend-shared: librairie interne contenant les interfaces (`Route`, `ModuleInterface`) et les helpers JSON:API

## Backend

1. Création du package de la librairie dans le dossier `@libs` avec comme nom: `@libs/todos-backend`
2. Mettre en place la structure de base d'une lib avec les dossiers/fichiers suivants:
  - src/
    - index.ts

    |> barrel d'export de tous les modules publics de la librairie (entités, routes, serializers, utils)

    |> exporte un tableau `entities` contenant toutes les entités MikroORM de la librairie
    - init.ts

    |> contient la classe `Module` qui implémente `ModuleInterface<FastifyInstanceTypeForModule>` de `@libs/backend-shared`

    |> contient la méthode statique `Module.init(context: LibraryContext)` pour créer une instance du module

    |> contient la méthode `setupRoutes(fastify)` qui enregistre les routes (groupées par préfixe) avec les middlewares appropriés

    |> exporte le type `FastifyInstanceTypeForModule` (instance Fastify typée avec ZodTypeProvider)
    - context.ts

    |> contient l'interface `LibraryContext` qui définit les dépendances du module (em, configuration)
    - types.ts

    |> contient les augmentations de types Fastify (`declare module "fastify"`) si nécessaire
    - entities/

    |> les entités MikroORM définies avec `defineEntity` de `@mikro-orm/core`

    |> chaque entité exporte aussi son type inféré via `InferEntity`
    - routes/

    |> les classes de routes, chacune implémentant l'interface `Route` de `@libs/backend-shared`

    |> chaque route est un fichier séparé (ex: `create.route.ts`, `list.route.ts`, `get.route.ts`, `update.route.ts`, `delete.route.ts`)

    |> chaque classe reçoit ses dépendances (repository, em, config) via le constructeur

    |> la méthode `routeDefinition(f)` enregistre la route sur l'instance Fastify avec son schéma Zod et son handler
    - serializers/

    |> les fonctions de sérialisation JSON:API pour chaque entité

    |> utilise `makeJsonApiDocumentSchema` de `@libs/backend-shared` pour définir le schéma Zod de la réponse

    |> exporte les fonctions `jsonApiSerialize<Entity>`, `jsonApiSerializeMany<Entity>s`, `jsonApiSerializeSingle<Entity>Document`, `jsonApiSerializeMany<Entity>sDocument`
    - middlewares/

    |> les middlewares Fastify spécifiques à la librairie (ex: authentification JWT)

    |> un middleware est une fonction factory qui retourne un hook `preValidation`
    - utils/
  
    |> les fonctions utilitaires de la librairie (hashing, JWT, etc.)
  - tests/
    - integration/

    |> les tests d'intégration des routes (HTTP + vraie base de données)

    |> chaque fichier de test correspond à une route (ex: `create.route.test.ts`)

    |> utilise `fastify.inject()` pour simuler des requêtes HTTP
    - unit/

    |> les tests unitaires des utils, serializers et logique métier isolée
    - utils/

    |> contient `setup-module.ts` avec la classe `TestModule` qui initialise Fastify + le Module + la DB de test

    |> `TestModule` fournit des helpers: `generateBearerToken(userId)`, `createTodo(data)`, `close()`, etc.

    global-setup.ts

    |> lance un conteneur PostgreSQL via `@testcontainers/postgresql`

    |> initialise le schéma de la DB et insère les données de seed pour les tests

    |> stocke l'URL de connexion dans `process.env.TEST_DATABASE_URL`

  package.json

  |> `name`: `@libs/todos-backend`

  |> `type`: `module`

  |> exports via `dist/` (build tsdown)

  |> dépendance vers `@libs/backend-shared` (workspace)

  tsconfig.json

  tsdown.config.mts

  |> configuration tsdown avec `dts: true`

  vitest.config.mts

  |> deux projets de test: "Unit Tests" (pool: threads) et "Integration Tests" (pool: forks, globalSetup)


3. Création de l'entité `TodoEntity` dans [src/entities/todo.entity.ts](../@libs/todos-backend/src/entities/todo.entity.ts)
   - Utilise `defineEntity` et `p` de `@mikro-orm/core`
   - Définit les propriétés: `id` (string, primary), `title` (string), `description` (string, optionnel), `completed` (boolean, défaut: false), etc.
   - Exporte le type `TodoEntityType` via `InferEntity<typeof TodoEntity>`

4. Création du serializer JSON:API pour "todo" dans [src/serializers/todo.serializer.ts](../@libs/todos-backend/src/serializers/todo.serializer.ts)
   - Utilise `makeJsonApiDocumentSchema("todos", ...)` de `@libs/backend-shared`
   - Exporte `SerializedTodoSchema`, `jsonApiSerializeTodo()`, `jsonApiSerializeManyTodos()`, `jsonApiSerializeSingleTodoDocument()`, `jsonApiSerializeManyTodosDocument()`
   - Les champs sensibles ou internes ne doivent pas apparaitre dans le schéma sérialisé

5. Création du context de la librairie dans [src/context.ts](../@libs/todos-backend/src/context.ts)
   - Interface `LibraryContext` avec: `em` (EntityManager), `configuration` (contient les éventuels secrets/config spécifiques au module, ex: `jwtSecret`)
   - Le contexte contient tout ce dont la librairie a besoin pour fonctionner, et est passé à la méthode `Module.init(context)`
   - Note: l'instance Fastify n'est PAS incluse dans le context, elle est passée à `setupRoutes(fastify)` lors de l'enregistrement

6. Création de la classe `Module` dans [src/init.ts](../@libs/todos-backend/src/init.ts)
   - Implémente `ModuleInterface<FastifyInstanceTypeForModule>`
   - `Module.init(context)` retourne une nouvelle instance
   - `setupRoutes(fastify)` enregistre les routes CRUD groupées sous un préfixe (ex: `/todos`)
   - Applique le middleware JWT auth via `f.addHook("preValidation", ...)` si les routes nécessitent une authentification
   - Gère les erreurs de validation Zod via `f.setErrorHandler(...)` avec des réponses JSON:API

7. Création des routes CRUD pour "todo":
   - [src/routes/create.route.ts](../@libs/todos-backend/src/routes/create.route.ts) - `POST /`
     - Schéma body: `makeSingleJsonApiTopDocument(...)` avec les attributs du todo
     - Crée l'entité via `repository.create(...)`, flush, et retourne le document JSON:API
   - [src/routes/list.route.ts](../@libs/todos-backend/src/routes/list.route.ts) - `GET /`
     - Support optionnel de `filter[search]` et `sort` via query params
     - Retourne `{ data: [...], meta: { total } }`
   - [src/routes/get.route.ts](../@libs/todos-backend/src/routes/get.route.ts) - `GET /:id`
     - Retourne 404 JSON:API si non trouvé
   - [src/routes/update.route.ts](../@libs/todos-backend/src/routes/update.route.ts) - `PATCH /:id`
     - Utilise `wrap(entity).assign(...)` de MikroORM pour mettre à jour partiellement
     - Retourne 404 si non trouvé
   - [src/routes/delete.route.ts](../@libs/todos-backend/src/routes/delete.route.ts) - `DELETE /:id`
     - Retourne 204 avec `null` en cas de succès
     - Retourne 404 si non trouvé

8. Création du barrel export dans [src/index.ts](../@libs/todos-backend/src/index.ts)
   - Re-exporte toutes les entités, routes, serializers, utils
   - Exporte le tableau `entities` contenant toutes les entités du module

9. Création du test unitaire du serializer dans [tests/unit/todo.serializer.test.ts](../@libs/todos-backend/tests/unit/todo.serializer.test.ts)
   - Teste `jsonApiSerializeTodo()`, `jsonApiSerializeManyTodos()`, `jsonApiSerializeSingleTodoDocument()`
   - Vérifie que les champs internes ne sont pas exposés

10. Création du `global-setup.ts` pour les tests d'intégration dans [tests/global-setup.ts](../@libs/todos-backend/tests/global-setup.ts)
    - Lance un conteneur PostgreSQL
    - Initialise le schéma de la DB avec toutes les entités du module
    - Insère un user de test (seed) si les routes nécessitent une authentification
    - Exporte `setup()` et `teardown()`

11. Création du `TestModule` dans [tests/utils/setup-module.ts](../@libs/todos-backend/tests/utils/setup-module.ts)
    - Méthode statique `TestModule.init()` qui:
      - Crée une connexion MikroORM vers la DB de test via `process.env.TEST_DATABASE_URL`
      - Initialise une instance Fastify avec `ZodTypeProvider`, `validatorCompiler`, `serializerCompiler`
      - Crée et initialise le `Module` avec `setupRoutes()`
    - Expose: `em`, `fastifyInstance`, `generateBearerToken(userId)`, `createTodo(data)`, `close()`
    - Constantes statiques: `JWT_SECRET`, `TEST_USER_ID` (correspond au user seedé dans `global-setup.ts`)
    - Pattern d'isolation: `aroundEach` avec `em.begin()` / `em.rollback()`

12. Création des tests d'intégration pour chaque route CRUD:
    - [tests/integration/create.route.test.ts](../@libs/todos-backend/tests/integration/create.route.test.ts)
    - [tests/integration/list.route.test.ts](../@libs/todos-backend/tests/integration/list.route.test.ts)
    - [tests/integration/get.route.test.ts](../@libs/todos-backend/tests/integration/get.route.test.ts)
    - [tests/integration/update.route.test.ts](../@libs/todos-backend/tests/integration/update.route.test.ts)
    - [tests/integration/delete.route.test.ts](../@libs/todos-backend/tests/integration/delete.route.test.ts)
    - Chaque test utilise `module.fastifyInstance.inject(...)` pour envoyer des requêtes HTTP
    - Vérifie les status codes, le format JSON:API des réponses, et les cas d'erreur (validation, 404, 403)

13. Liaison de la librairie avec l'application backend
    - Enregistrement des entités dans `@apps/backend/src/app/database.connection.ts`:
      ```typescript
      import { TodoEntity } from "@libs/todos-backend";
      // Ajouter TodoEntity au tableau entities de defineConfig
      ```
    - Initialisation du module dans `@apps/backend/src/app/app.ts`:
      ```typescript
      import { Module as TodoModule } from "@libs/todos-backend";

      const todosModule = TodoModule.init({
        em: context.orm.em.fork(),
        configuration: {
          jwtSecret: this.context.configuration.JWT_SECRET,
        },
      });
      ```
    - Enregistrement des routes via `appRouter` dans `@apps/backend/src/app/app.router.ts`:
      ```typescript
      await todosModule.setupRoutes(fastify);
      ```
    - Mise à jour du seeder de développement dans `@apps/backend/src/seeders/development.seeder.ts` si nécessaire

14. Création de la configuration MikroORM locale (optionnel, pour les migrations en dev) dans `@libs/todos-backend/src/mikro-orm.config.ts`

15. Vérification que les tests passent:
    - `pnpm test` dans `@libs/todos-backend` (unit + integration)
    - `pnpm lint` pour la vérification du code (oxlint + oxfmt)

16. Génération des types apis avec openapi-typescript en utilisant `pnpm run api:types` pour générer les types openapi.

17. Ingestion d'un Raffaello comme récompense pour ce dur labeur.
