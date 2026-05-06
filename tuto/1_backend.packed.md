<!-- Packed from tuto/1_backend.md on 2026-05-06T13:34:48.468Z -->
<!-- 18 referenced file(s) inlined below -->

> **READ-THIS-FILE-ONLY.** Every link to a project file in this document has been
> rewritten to an in-document anchor (e.g. `#ref-libs-todos-front-src-index-ts`)
> that resolves to a section under `## Referenced files` at the bottom.
> Do **not** open, fetch, or read any external file path mentioned in this document —
> the canonical content of every referenced file is already inlined here. If something
> appears missing, scroll to `## Referenced files` and search by path.
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


3. Création de l'entité `TodoEntity` dans [src/entities/todo.entity.ts](#ref-libs-todos-backend-src-entities-todo-entity-ts)
   - Utilise `defineEntity` et `p` de `@mikro-orm/core`
   - Définit les propriétés: `id` (string, primary), `title` (string), `description` (string, optionnel), `completed` (boolean, défaut: false), etc.
   - Exporte le type `TodoEntityType` via `InferEntity<typeof TodoEntity>`

4. Création du serializer JSON:API pour "todo" dans [src/serializers/todo.serializer.ts](#ref-libs-todos-backend-src-serializers-todo-serializer-ts)
   - Utilise `makeJsonApiDocumentSchema("todos", ...)` de `@libs/backend-shared`
   - Exporte `SerializedTodoSchema`, `jsonApiSerializeTodo()`, `jsonApiSerializeManyTodos()`, `jsonApiSerializeSingleTodoDocument()`, `jsonApiSerializeManyTodosDocument()`
   - Les champs sensibles ou internes ne doivent pas apparaitre dans le schéma sérialisé

5. Création du context de la librairie dans [src/context.ts](#ref-libs-todos-backend-src-context-ts)
   - Interface `LibraryContext` avec: `em` (EntityManager), `configuration` (contient les éventuels secrets/config spécifiques au module, ex: `jwtSecret`)
   - Le contexte contient tout ce dont la librairie a besoin pour fonctionner, et est passé à la méthode `Module.init(context)`
   - Note: l'instance Fastify n'est PAS incluse dans le context, elle est passée à `setupRoutes(fastify)` lors de l'enregistrement

6. Création de la classe `Module` dans [src/init.ts](#ref-libs-todos-backend-src-init-ts)
   - Implémente `ModuleInterface<FastifyInstanceTypeForModule>`
   - `Module.init(context)` retourne une nouvelle instance
   - `setupRoutes(fastify)` enregistre les routes CRUD groupées sous un préfixe (ex: `/todos`)
   - Applique le middleware JWT auth via `f.addHook("preValidation", ...)` si les routes nécessitent une authentification
   - Gère les erreurs de validation Zod via `f.setErrorHandler(...)` avec des réponses JSON:API

7. Création des routes CRUD pour "todo":
   - [src/routes/create.route.ts](#ref-libs-todos-backend-src-routes-create-route-ts) - `POST /`
     - Schéma body: `makeSingleJsonApiTopDocument(...)` avec les attributs du todo
     - Crée l'entité via `repository.create(...)`, flush, et retourne le document JSON:API
   - [src/routes/list.route.ts](#ref-libs-todos-backend-src-routes-list-route-ts) - `GET /`
     - Support optionnel de `filter[search]` et `sort` via query params
     - Retourne `{ data: [...], meta: { total } }`
   - [src/routes/get.route.ts](#ref-libs-todos-backend-src-routes-get-route-ts) - `GET /:id`
     - Retourne 404 JSON:API si non trouvé
   - [src/routes/update.route.ts](#ref-libs-todos-backend-src-routes-update-route-ts) - `PATCH /:id`
     - Utilise `wrap(entity).assign(...)` de MikroORM pour mettre à jour partiellement
     - Retourne 404 si non trouvé
   - [src/routes/delete.route.ts](#ref-libs-todos-backend-src-routes-delete-route-ts) - `DELETE /:id`
     - Retourne 204 avec `null` en cas de succès
     - Retourne 404 si non trouvé

8. Création du barrel export dans [src/index.ts](#ref-libs-todos-backend-src-index-ts)
   - Re-exporte toutes les entités, routes, serializers, utils
   - Exporte le tableau `entities` contenant toutes les entités du module

9. Création du test unitaire du serializer dans [tests/unit/todo.serializer.test.ts](#ref-libs-todos-backend-tests-unit-todo-serializer-test-ts)
   - Teste `jsonApiSerializeTodo()`, `jsonApiSerializeManyTodos()`, `jsonApiSerializeSingleTodoDocument()`
   - Vérifie que les champs internes ne sont pas exposés

10. Création du `global-setup.ts` pour les tests d'intégration dans [tests/global-setup.ts](#ref-libs-todos-backend-tests-global-setup-ts)
    - Lance un conteneur PostgreSQL
    - Initialise le schéma de la DB avec toutes les entités du module
    - Insère un user de test (seed) si les routes nécessitent une authentification
    - Exporte `setup()` et `teardown()`

11. Création du `TestModule` dans [tests/utils/setup-module.ts](#ref-libs-todos-backend-tests-utils-setup-module-ts)
    - Méthode statique `TestModule.init()` qui:
      - Crée une connexion MikroORM vers la DB de test via `process.env.TEST_DATABASE_URL`
      - Initialise une instance Fastify avec `ZodTypeProvider`, `validatorCompiler`, `serializerCompiler`
      - Crée et initialise le `Module` avec `setupRoutes()`
    - Expose: `em`, `fastifyInstance`, `generateBearerToken(userId)`, `createTodo(data)`, `close()`
    - Constantes statiques: `JWT_SECRET`, `TEST_USER_ID` (correspond au user seedé dans `global-setup.ts`)
    - Pattern d'isolation: `aroundEach` avec `em.begin()` / `em.rollback()`

12. Création des tests d'intégration pour chaque route CRUD:
    - [tests/integration/create.route.test.ts](#ref-libs-todos-backend-tests-integration-create-route-test-ts)
    - [tests/integration/list.route.test.ts](#ref-libs-todos-backend-tests-integration-list-route-test-ts)
    - [tests/integration/get.route.test.ts](#ref-libs-todos-backend-tests-integration-get-route-test-ts)
    - [tests/integration/update.route.test.ts](#ref-libs-todos-backend-tests-integration-update-route-test-ts)
    - [tests/integration/delete.route.test.ts](#ref-libs-todos-backend-tests-integration-delete-route-test-ts)
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

---

## Referenced files

<a id="ref-libs-todos-backend-src-entities-todo-entity-ts"></a>
### `@libs/todos-backend/src/entities/todo.entity.ts`

```ts
import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

export const TodoEntity = defineEntity({
  name: "Todo",
  properties: {
    id: p.string().primary(),
    title: p.string(),
    description: p.string().nullable(),
    completed: p.boolean().default(false),
    userId: p.string(),
    createdAt: p.string().onCreate(() => new Date().toISOString()),
    updatedAt: p.string().onCreate(() => new Date().toISOString()),
  },
});

export type TodoEntityType = InferEntity<typeof TodoEntity>;
```

<a id="ref-libs-todos-backend-src-serializers-todo-serializer-ts"></a>
### `@libs/todos-backend/src/serializers/todo.serializer.ts`

```ts
import type { TodoEntityType } from "#src/entities/todo.entity.js";
import { boolean, object, string } from "zod";
import { z } from "zod";
import { makeJsonApiDocumentSchema } from "@libs/backend-shared";

export const SerializedTodoSchema = makeJsonApiDocumentSchema(
  "todos",
  object({
    title: string(),
    description: string().nullable(),
    completed: boolean(),
    createdAt: string(),
    updatedAt: string(),
  }),
);

export function jsonApiSerializeTodo(todo: TodoEntityType): z.infer<typeof SerializedTodoSchema> {
  return {
    id: todo.id,
    type: "todos" as const,
    attributes: {
      title: todo.title,
      description: todo.description ?? null,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    },
  };
}

export function jsonApiSerializeManyTodos(todos: TodoEntityType[]) {
  return todos.map(jsonApiSerializeTodo);
}

export function jsonApiSerializeSingleTodoDocument(todo: TodoEntityType) {
  return {
    data: jsonApiSerializeTodo(todo),
  };
}

export function jsonApiSerializeManyTodosDocument(todos: TodoEntityType[]) {
  return {
    data: jsonApiSerializeManyTodos(todos),
  };
}
```

<a id="ref-libs-todos-backend-src-context-ts"></a>
### `@libs/todos-backend/src/context.ts`

```ts
import type { EntityManager } from "@mikro-orm/core";

export interface LibraryContext {
  em: EntityManager;
  configuration: {
    jwtSecret: string;
  };
}
```

<a id="ref-libs-todos-backend-src-init-ts"></a>
### `@libs/todos-backend/src/init.ts`

```ts
import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import type { LibraryContext } from "./context.js";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { CreateRoute } from "#src/routes/create.route.js";
import { ListRoute } from "#src/routes/list.route.js";
import { GetRoute } from "#src/routes/get.route.js";
import { UpdateRoute } from "#src/routes/update.route.js";
import { DeleteRoute } from "#src/routes/delete.route.js";
import { TodoEntity } from "./entities/todo.entity.js";
import { handleJsonApiErrors, type ModuleInterface, type Route } from "@libs/backend-shared";
import { createJwtAuthMiddleware } from "@libs/users-backend";

export type FastifyInstanceTypeForModule = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export class Module implements ModuleInterface<FastifyInstanceTypeForModule> {
  private constructor(private context: LibraryContext) {}

  public static init(context: LibraryContext): Module {
    return new Module(context);
  }

  public async setupRoutes(fastify: FastifyInstanceTypeForModule): Promise<void> {
    const repository = this.context.em.getRepository(TodoEntity);

    await fastify.register(
      async (f) => {
        const todoRoutes: Route<FastifyInstanceTypeForModule>[] = [
          new CreateRoute(repository),
          new ListRoute(this.context.em),
          new GetRoute(repository),
          new UpdateRoute(repository),
          new DeleteRoute(repository),
        ];

        const jwtAuthMiddleware = createJwtAuthMiddleware(
          this.context.em,
          this.context.configuration.jwtSecret,
        );

        f.setErrorHandler((error, request, reply) => {
          handleJsonApiErrors(error, request, reply);
        });

        f.addHook("preValidation", jwtAuthMiddleware);

        for (const route of todoRoutes) {
          route.routeDefinition(f);
        }
      },
      { prefix: "/todos" },
    );
  }
}
```

<a id="ref-libs-todos-backend-src-routes-create-route-ts"></a>
### `@libs/todos-backend/src/routes/create.route.ts`

```ts
import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { TodoEntityType } from "#src/entities/todo.entity.js";
import type { EntityRepository } from "@mikro-orm/core";
import { randomUUID } from "crypto";
import {
  jsonApiSerializeSingleTodoDocument,
  SerializedTodoSchema,
} from "#src/serializers/todo.serializer.js";
import { boolean, object, string } from "zod";
import { makeSingleJsonApiTopDocument, type Route } from "@libs/backend-shared";

export class CreateRoute implements Route {
  public constructor(private todoRepository: EntityRepository<TodoEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/",
      {
        schema: {
          body: makeSingleJsonApiTopDocument(
            object({
              id: string().optional().nullable(),
              attributes: object({
                title: string(),
                description: string().optional().nullable(),
                completed: boolean().optional(),
              }),
            }),
          ),
          response: {
            200: makeSingleJsonApiTopDocument(SerializedTodoSchema),
          },
        },
      },
      async (request, reply) => {
        const body = request.body.data.attributes;
        const currentUser = request.user!;

        const todo = this.todoRepository.create({
          id: request.body.data.id || randomUUID(),
          title: body.title,
          description: body.description ?? null,
          completed: body.completed ?? false,
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        await this.todoRepository.getEntityManager().flush();

        return reply.send(jsonApiSerializeSingleTodoDocument(todo));
      },
    );
  }
}
```

<a id="ref-libs-todos-backend-src-routes-list-route-ts"></a>
### `@libs/todos-backend/src/routes/list.route.ts`

```ts
import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { TodoEntity } from "#src/entities/todo.entity.js";
import type { EntityManager } from "@mikro-orm/core";
import { array, number, object } from "zod";
import {
  jsonApiSerializeManyTodos,
  SerializedTodoSchema,
} from "#src/serializers/todo.serializer.js";
import type { Route } from "@libs/backend-shared";

export class ListRoute implements Route {
  public constructor(private em: EntityManager) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.get(
      "/",
      {
        schema: {
          response: {
            200: object({
              data: array(SerializedTodoSchema),
              meta: object({
                total: number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const currentUser = request.user!;
        const queryParams = request.query as Record<string, any>;
        const searchQuery = queryParams["filter[search]"] as string | undefined;
        const sortParam = queryParams["sort"] as string | undefined;

        const where: any = { userId: currentUser.id };

        if (searchQuery) {
          where.title = { $like: `%${searchQuery}%` };
        }

        let orderBy: any = {};
        if (sortParam) {
          const isDescending = sortParam.startsWith("-");
          const field = isDescending ? sortParam.slice(1) : sortParam;

          if (["title", "completed", "createdAt", "updatedAt"].includes(field)) {
            orderBy = { [field]: isDescending ? "DESC" : "ASC" };
          }
        }

        const todoRepository = this.em.getRepository(TodoEntity);
        const [todos, total] = await todoRepository.findAndCount(where, { orderBy });

        return reply.send({
          data: jsonApiSerializeManyTodos(todos),
          meta: {
            total,
          },
        });
      },
    );
  }
}
```

<a id="ref-libs-todos-backend-src-routes-get-route-ts"></a>
### `@libs/todos-backend/src/routes/get.route.ts`

```ts
import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { object, string } from "zod";
import {
  jsonApiSerializeSingleTodoDocument,
  SerializedTodoSchema,
} from "#src/serializers/todo.serializer.js";
import type { TodoEntityType } from "#src/entities/todo.entity.js";
import { jsonApiErrorDocumentSchema, makeJsonApiError, type Route } from "@libs/backend-shared";

export class GetRoute implements Route {
  public constructor(private todoRepository: EntityRepository<TodoEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.get(
      "/:id",
      {
        schema: {
          params: object({
            id: string(),
          }),
          response: {
            200: object({
              data: SerializedTodoSchema,
            }),
            404: jsonApiErrorDocumentSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };
        const currentUser = request.user!;

        const todo = await this.todoRepository.findOne({ id, userId: currentUser.id });

        if (!todo) {
          return reply.code(404).send(
            makeJsonApiError(404, "Not Found", {
              code: "TODO_NOT_FOUND",
              detail: `Todo with id ${id} not found`,
            }),
          );
        }

        return reply.send(jsonApiSerializeSingleTodoDocument(todo));
      },
    );
  }
}
```

<a id="ref-libs-todos-backend-src-routes-update-route-ts"></a>
### `@libs/todos-backend/src/routes/update.route.ts`

```ts
import type { FastifyInstanceTypeForModule } from "#src/init.js";
import { wrap, type EntityRepository } from "@mikro-orm/core";
import { object, string } from "zod";
import {
  jsonApiSerializeSingleTodoDocument,
  SerializedTodoSchema,
} from "#src/serializers/todo.serializer.js";
import type { TodoEntityType } from "#src/entities/todo.entity.js";
import {
  jsonApiErrorDocumentSchema,
  makeJsonApiError,
  makeSingleJsonApiTopDocument,
  type Route,
} from "@libs/backend-shared";

export class UpdateRoute implements Route {
  public constructor(private todoRepository: EntityRepository<TodoEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.patch(
      "/:id",
      {
        schema: {
          params: object({
            id: string(),
          }),
          body: makeSingleJsonApiTopDocument(SerializedTodoSchema),
          response: {
            200: makeSingleJsonApiTopDocument(SerializedTodoSchema),
            404: jsonApiErrorDocumentSchema,
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body;
        const currentUser = request.user!;

        const todo = await this.todoRepository.findOne({ id, userId: currentUser.id });

        if (!todo) {
          return reply.code(404).send(
            makeJsonApiError(404, "Not Found", {
              code: "TODO_NOT_FOUND",
              detail: `Todo with id ${id} not found`,
            }),
          );
        }

        wrap(todo).assign(body.data.attributes);

        await this.todoRepository.getEntityManager().flush();

        return reply.send(jsonApiSerializeSingleTodoDocument(todo));
      },
    );
  }
}
```

<a id="ref-libs-todos-backend-src-routes-delete-route-ts"></a>
### `@libs/todos-backend/src/routes/delete.route.ts`

```ts
import type { FastifyInstanceTypeForModule } from "#src/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { literal, object, string } from "zod";
import type { TodoEntityType } from "#src/entities/todo.entity.js";
import {
  jsonApiErrorDocumentSchema,
  makeJsonApiError,
  makeSingleJsonApiTopDocument,
  type Route,
} from "@libs/backend-shared";

export class DeleteRoute implements Route {
  public constructor(private todoRepository: EntityRepository<TodoEntityType>) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.delete(
      "/:id",
      {
        schema: {
          params: object({
            id: string(),
          }),
          response: {
            404: jsonApiErrorDocumentSchema,
            204: makeSingleJsonApiTopDocument(literal(null)),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as { id: string };
        const currentUser = request.user!;

        const todo = await this.todoRepository.findOne({ id, userId: currentUser.id });

        if (!todo) {
          return reply.code(404).send(
            makeJsonApiError(404, "Not Found", {
              code: "TODO_NOT_FOUND",
              detail: `Todo with id ${id} not found`,
            }),
          );
        }

        await this.todoRepository.getEntityManager().remove(todo).flush();

        return reply.code(204).send({
          data: null,
        });
      },
    );
  }
}
```

<a id="ref-libs-todos-backend-src-index-ts"></a>
### `@libs/todos-backend/src/index.ts`

```ts
import { TodoEntity } from "#src/entities/todo.entity.js";

export * from "#src/entities/todo.entity.js";
export * from "#src/routes/create.route.js";
export * from "#src/routes/delete.route.js";
export * from "#src/routes/get.route.js";
export * from "#src/routes/list.route.js";
export * from "#src/routes/update.route.js";
export * from "#src/serializers/todo.serializer.js";
export * from "#src/init.js";

export const entities = [TodoEntity];
```

<a id="ref-libs-todos-backend-tests-unit-todo-serializer-test-ts"></a>
### `@libs/todos-backend/tests/unit/todo.serializer.test.ts`

```ts
import { describe, it, expect } from "vitest";
import {
  jsonApiSerializeTodo,
  jsonApiSerializeManyTodos,
  jsonApiSerializeSingleTodoDocument,
  jsonApiSerializeManyTodosDocument,
} from "#src/serializers/todo.serializer.js";
import type { TodoEntityType } from "#src/entities/todo.entity.js";

describe("todo.serializer", () => {
  const mockTodo: TodoEntityType = {
    id: "todo-1",
    title: "Test Todo",
    description: "A test description",
    completed: false,
    userId: "user-1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  const mockTodos: TodoEntityType[] = [
    mockTodo,
    {
      id: "todo-2",
      title: "Another Todo",
      description: null,
      completed: true,
      userId: "user-1",
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
  ];

  describe("jsonApiSerializeTodo", () => {
    it("should serialize a todo to JSON:API format", () => {
      const result = jsonApiSerializeTodo(mockTodo);

      expect(result).toEqual({
        id: "todo-1",
        type: "todos",
        attributes: {
          title: "Test Todo",
          description: "A test description",
          completed: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      });
    });

    it("should not include userId in serialized output", () => {
      const result = jsonApiSerializeTodo(mockTodo);

      expect(result).not.toHaveProperty("userId");
      expect(result.attributes).not.toHaveProperty("userId");
    });

    it("should handle null description", () => {
      const todoWithNullDesc: TodoEntityType = { ...mockTodo, description: null };
      const result = jsonApiSerializeTodo(todoWithNullDesc);

      expect(result.attributes.description).toBeNull();
    });
  });

  describe("jsonApiSerializeManyTodos", () => {
    it("should serialize multiple todos to JSON:API format", () => {
      const result = jsonApiSerializeManyTodos(mockTodos);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: "todo-1",
        type: "todos",
      });
      expect(result[1]).toMatchObject({
        id: "todo-2",
        type: "todos",
      });
    });

    it("should return empty array for empty input", () => {
      const result = jsonApiSerializeManyTodos([]);

      expect(result).toEqual([]);
    });
  });

  describe("jsonApiSerializeSingleTodoDocument", () => {
    it("should wrap serialized todo in data property", () => {
      const result = jsonApiSerializeSingleTodoDocument(mockTodo);

      expect(result).toHaveProperty("data");
      expect(result.data).toMatchObject({
        id: "todo-1",
        type: "todos",
        attributes: {
          title: "Test Todo",
          description: "A test description",
          completed: false,
        },
      });
    });
  });

  describe("jsonApiSerializeManyTodosDocument", () => {
    it("should wrap serialized todos array in data property", () => {
      const result = jsonApiSerializeManyTodosDocument(mockTodos);

      expect(result).toHaveProperty("data");
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it("should return empty data array for empty input", () => {
      const result = jsonApiSerializeManyTodosDocument([]);

      expect(result).toEqual({ data: [] });
    });
  });
});
```

<a id="ref-libs-todos-backend-tests-global-setup-ts"></a>
### `@libs/todos-backend/tests/global-setup.ts`

```ts
import { entities as todoEntities } from "#src/index.js";
import { entities as userEntities, UserEntity } from "@libs/users-backend";
import { MikroORM } from "@mikro-orm/postgresql";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { TestModule } from "./utils/setup-module.ts";

let container: StartedPostgreSqlContainer;

export async function setup() {
  container = await new PostgreSqlContainer("postgres:16-alpine")
    .withDatabase("test_db")
    .withUsername("test_user")
    .withPassword("test_password")
    .start();

  process.env.TEST_DATABASE_URL = container.getConnectionUri();

  const orm = await MikroORM.init({
    entities: [...todoEntities, ...userEntities],
    clientUrl: process.env.TEST_DATABASE_URL,
  });

  await orm.schema.refresh();

  const hashedPassword =
    "$argon2id$v=19$m=65536,t=3,p=4$ETHkx8pEQN6qQwlIR+vUTQ$+QC4JBKJCQUL1dyCHzRMBNjbk+QaJi3PV+HkPY00kcc";
  await orm.em.getRepository(UserEntity).insert({
    id: TestModule.TEST_USER_ID,
    email: "a@test.com",
    firstName: "Test",
    lastName: "User",
    password: hashedPassword,
  });

  await orm.close();
}

export async function teardown() {
  if (container) {
    await container.stop();
  }
}
```

<a id="ref-libs-todos-backend-tests-utils-setup-module-ts"></a>
### `@libs/todos-backend/tests/utils/setup-module.ts`

```ts
import {
  entities as todoEntities,
  Module,
  TodoEntity,
  type FastifyInstanceTypeForModule,
} from "#src/index.js";
import { entities as userEntities } from "@libs/users-backend";
import { MikroORM } from "@mikro-orm/core";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { sign } from "jsonwebtoken";
import { randomUUID } from "crypto";

export class TestModule {
  public static JWT_SECRET = "testSecret";
  public static TEST_USER_ID = "test-user-id";

  declare public fastifyInstance: FastifyInstanceTypeForModule;

  private constructor(
    public module: Module,
    private orm: MikroORM,
  ) {}

  public static async init() {
    const connectionUrl = process.env.TEST_DATABASE_URL;
    if (!connectionUrl) {
      throw new Error(
        "TEST_DATABASE_URL environment variable is not set. Make sure global-setup.ts ran.",
      );
    }

    const orm = await MikroORM.init({
      entities: [...todoEntities, ...userEntities],
      clientUrl: connectionUrl,
    });

    const fastifyInstance = fastify().withTypeProvider<ZodTypeProvider>();
    fastifyInstance.setValidatorCompiler(validatorCompiler);
    fastifyInstance.setSerializerCompiler(serializerCompiler);

    const module = Module.init({
      em: orm.em.fork(),
      configuration: {
        jwtSecret: TestModule.JWT_SECRET,
      },
    });

    const testModule = new TestModule(module, orm);
    testModule.fastifyInstance = fastifyInstance;

    await module.setupRoutes(fastifyInstance);

    return testModule;
  }

  get em() {
    return this.module["context"].em;
  }

  public generateBearerToken(userId: string) {
    return "Bearer " + sign({ userId }, TestModule.JWT_SECRET);
  }

  public async createTodo(data: {
    id?: string;
    title: string;
    description?: string | null;
    completed?: boolean;
    userId: string;
  }) {
    await this.em.getRepository(TodoEntity).insert({
      id: data.id || randomUUID(),
      title: data.title,
      description: data.description ?? null,
      completed: data.completed ?? false,
      userId: data.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  public async close() {
    await this.orm.close(true);
  }
}
```

<a id="ref-libs-todos-backend-tests-integration-create-route-test-ts"></a>
### `@libs/todos-backend/tests/integration/create.route.test.ts`

```ts
import { afterAll, aroundEach, beforeAll, expect, test } from "vitest";
import { TestModule } from "#tests/utils/setup-module.js";

let module: TestModule;

beforeAll(async () => {
  module = await TestModule.init();
});

afterAll(async () => {
  await module.close();
});

aroundEach(async (runTest) => {
  await module.em.begin();
  await runTest();
  await module.em.rollback();
});

test("CreateRoute creates a todo and returns JSON:API format", async () => {
  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/todos",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
    payload: {
      data: {
        type: "todos",
        attributes: {
          title: "My new todo",
          description: "A description",
        },
      },
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toMatchObject({
    type: "todos",
    id: expect.any(String),
    attributes: {
      title: "My new todo",
      description: "A description",
      completed: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});

test("CreateRoute returns JSON:API error on validation failure", async () => {
  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/todos",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
    payload: {
      data: {
        type: "todos",
        attributes: {},
      },
    },
  });

  expect(response.statusCode).toBe(400);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(Array.isArray(body.errors)).toBe(true);
  expect(body.errors.length).toBeGreaterThan(0);
  expect(body.errors[0]).toMatchObject({
    status: "400",
    title: "Validation Error",
    detail: expect.any(String),
    source: {
      pointer: expect.any(String),
    },
  });
});

test("CreateRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "POST",
    url: "/todos",
    payload: {
      data: {
        type: "todos",
        attributes: {
          title: "My new todo",
        },
      },
    },
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Unauthorized",
    code: "UNAUTHORIZED",
  });
});
```

<a id="ref-libs-todos-backend-tests-integration-list-route-test-ts"></a>
### `@libs/todos-backend/tests/integration/list.route.test.ts`

```ts
import { afterAll, aroundEach, beforeAll, expect as hardExpect } from "vitest";
import { test } from "vitest";
import { TestModule } from "#tests/utils/setup-module.js";

const expect = hardExpect.soft;

let module: TestModule;

beforeAll(async () => {
  module = await TestModule.init();
});

afterAll(async () => {
  await module.close();
});

aroundEach(async (runTest) => {
  await module.em.begin();
  await runTest();
  await module.em.rollback();
});

test("ListRoute returns todos in JSON:API format with meta", async () => {
  await module.createTodo({
    title: "Test todo",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body).toHaveProperty("meta");
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.meta).toMatchObject({
    total: 1,
  });
  expect(body.data[0]).toMatchObject({
    type: "todos",
    attributes: {
      title: "Test todo",
    },
  });
});

test("ListRoute only returns todos for the current user", async () => {
  await module.createTodo({
    title: "My todo",
    userId: TestModule.TEST_USER_ID,
  });

  await module.createTodo({
    title: "Other user todo",
    userId: "other-user-id",
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.meta.total).toBe(1);
  expect(body.data[0].attributes.title).toBe("My todo");
});

test("ListRoute filters todos by search query", async () => {
  await module.createTodo({
    title: "Buy groceries",
    userId: TestModule.TEST_USER_ID,
  });

  await module.createTodo({
    title: "Write code",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos?filter[search]=Buy",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.meta.total).toBe(1);
  expect(body.data[0].attributes.title).toBe("Buy groceries");
});

test("ListRoute sorts todos ascending", async () => {
  await module.createTodo({
    title: "Alpha",
    userId: TestModule.TEST_USER_ID,
  });

  await module.createTodo({
    title: "Zulu",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos?sort=title",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.data[0].attributes.title).toBe("Alpha");
  expect(body.data[body.data.length - 1].attributes.title).toBe("Zulu");
});

test("ListRoute sorts todos descending", async () => {
  await module.createTodo({
    title: "Alpha",
    userId: TestModule.TEST_USER_ID,
  });

  await module.createTodo({
    title: "Zulu",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos?sort=-title",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.data[0].attributes.title).toBe("Zulu");
  expect(body.data[body.data.length - 1].attributes.title).toBe("Alpha");
});

test("ListRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos",
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Unauthorized",
    code: "UNAUTHORIZED",
  });
});

test("ListRoute ignores invalid sort field", async () => {
  await module.createTodo({
    title: "Test todo",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos?sort=invalidField",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data.length).toBeGreaterThan(0);
});
```

<a id="ref-libs-todos-backend-tests-integration-get-route-test-ts"></a>
### `@libs/todos-backend/tests/integration/get.route.test.ts`

```ts
import { afterAll, aroundEach, beforeAll, expect as hardExpect } from "vitest";
import { test } from "vitest";
import { TestModule } from "#tests/utils/setup-module.js";

const expect = hardExpect.soft;

let module: TestModule;

beforeAll(async () => {
  module = await TestModule.init();
});

afterAll(async () => {
  await module.close();
});

aroundEach(async (runTest) => {
  await module.em.begin();
  await runTest();
  await module.em.rollback();
});

test("GetRoute returns todo in JSON:API format", async () => {
  await module.createTodo({
    id: "todo-1",
    title: "Test todo",
    description: "A description",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos/todo-1",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toMatchObject({
    type: "todos",
    id: "todo-1",
    attributes: {
      title: "Test todo",
      description: "A description",
      completed: false,
    },
  });
});

test("GetRoute returns JSON:API error when todo not found", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos/nonexistent-id",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(Array.isArray(body.errors)).toBe(true);
  expect(body.errors[0]).toMatchObject({
    status: "404",
    title: "Not Found",
    code: "TODO_NOT_FOUND",
    detail: "Todo with id nonexistent-id not found",
  });
});

test("GetRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos/todo-1",
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Unauthorized",
    code: "UNAUTHORIZED",
    detail: "Missing or invalid authorization header",
  });
});

test("GetRoute returns 404 when todo belongs to another user", async () => {
  await module.createTodo({
    id: "other-todo",
    title: "Other user todo",
    userId: "other-user-id",
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/todos/other-todo",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "404",
    title: "Not Found",
    code: "TODO_NOT_FOUND",
  });
});
```

<a id="ref-libs-todos-backend-tests-integration-update-route-test-ts"></a>
### `@libs/todos-backend/tests/integration/update.route.test.ts`

```ts
import { afterAll, aroundEach, beforeAll, expect as hardExpect } from "vitest";
import { test } from "vitest";
import { TestModule } from "#tests/utils/setup-module.js";

const expect = hardExpect.soft;

let module: TestModule;

beforeAll(async () => {
  module = await TestModule.init();
});

afterAll(async () => {
  await module.close();
});

aroundEach(async (runTest) => {
  await module.em.begin();
  await runTest();
  await module.em.rollback();
});

test("UpdateRoute updates todo and returns JSON:API format", async () => {
  await module.createTodo({
    id: "todo-1",
    title: "Original title",
    description: "Original description",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "PATCH",
    url: "/todos/todo-1",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
    payload: {
      data: {
        id: "todo-1",
        type: "todos",
        attributes: {
          title: "Updated title",
          description: "Updated description",
          completed: true,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      },
    },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body.data).toMatchObject({
    type: "todos",
    id: "todo-1",
    attributes: {
      title: "Updated title",
      description: "Updated description",
      completed: true,
    },
  });
});

test("UpdateRoute returns JSON:API error when todo not found", async () => {
  const response = await module.fastifyInstance.inject({
    method: "PATCH",
    url: "/todos/nonexistent-id",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
    payload: {
      data: {
        id: "nonexistent-id",
        type: "todos",
        attributes: {
          title: "Updated",
          description: null,
          completed: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      },
    },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "404",
    title: "Not Found",
    code: "TODO_NOT_FOUND",
    detail: "Todo with id nonexistent-id not found",
  });
});

test("UpdateRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "PATCH",
    url: "/todos/todo-1",
    payload: {
      data: {
        id: "todo-1",
        type: "todos",
        attributes: {
          title: "Updated",
          description: null,
          completed: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      },
    },
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Unauthorized",
    code: "UNAUTHORIZED",
  });
});

test("UpdateRoute returns 404 when todo belongs to another user", async () => {
  await module.createTodo({
    id: "other-todo",
    title: "Other user todo",
    userId: "other-user-id",
  });

  const response = await module.fastifyInstance.inject({
    method: "PATCH",
    url: "/todos/other-todo",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
    payload: {
      data: {
        id: "other-todo",
        type: "todos",
        attributes: {
          title: "Hacked",
          description: null,
          completed: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      },
    },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "404",
    title: "Not Found",
    code: "TODO_NOT_FOUND",
  });
});
```

<a id="ref-libs-todos-backend-tests-integration-delete-route-test-ts"></a>
### `@libs/todos-backend/tests/integration/delete.route.test.ts`

```ts
import { afterAll, aroundEach, beforeAll, expect as hardExpect } from "vitest";
import { test } from "vitest";
import { TestModule } from "#tests/utils/setup-module.js";

const expect = hardExpect.soft;

let module: TestModule;

beforeAll(async () => {
  module = await TestModule.init();
});

afterAll(async () => {
  await module.close();
});

aroundEach(async (runTest) => {
  await module.em.begin();
  await runTest();
  await module.em.rollback();
});

test("DeleteRoute deletes a todo and returns 204", async () => {
  await module.createTodo({
    id: "todo-1",
    title: "Todo to delete",
    userId: TestModule.TEST_USER_ID,
  });

  const response = await module.fastifyInstance.inject({
    method: "DELETE",
    url: "/todos/todo-1",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(204);
  expect(response.body).toBe("");
});

test("DeleteRoute returns JSON:API error when todo not found", async () => {
  const response = await module.fastifyInstance.inject({
    method: "DELETE",
    url: "/todos/nonexistent-id",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "404",
    title: "Not Found",
    code: "TODO_NOT_FOUND",
    detail: "Todo with id nonexistent-id not found",
  });
});

test("DeleteRoute returns JSON:API error when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "DELETE",
    url: "/todos/todo-1",
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "401",
    title: "Unauthorized",
    code: "UNAUTHORIZED",
    detail: "Missing or invalid authorization header",
  });
});

test("DeleteRoute returns 404 when todo belongs to another user", async () => {
  await module.createTodo({
    id: "other-todo",
    title: "Other user todo",
    userId: "other-user-id",
  });

  const response = await module.fastifyInstance.inject({
    method: "DELETE",
    url: "/todos/other-todo",
    headers: {
      authorization: module.generateBearerToken(TestModule.TEST_USER_ID),
    },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body).toHaveProperty("errors");
  expect(body.errors[0]).toMatchObject({
    status: "404",
    title: "Not Found",
    code: "TODO_NOT_FOUND",
  });
});
```
