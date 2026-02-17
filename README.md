# Boilerplate

Monorepo Ember (front) + Fastify (backend), géré avec pnpm et Turbo.

## Prérequis

- Node 24 (Volta : `volta install node@24`)
- pnpm 10.28.1
- Docker

## Installation

À la racine du projet :

```bash
pnpm install
```

## Démarrage

### Base de données

```bash
docker compose up -d
```

PostgreSQL via Docker.
- Host: localhost
- Port : 5432
- User : backend_user
- Password : backend_user
- Database : database_dev

### Backend

Dans `@apps/backend` :

```bash
pnpm schema:fresh
pnpm dev
```

### Frontend

Dans `@apps/front` :

- **Avec API mockée (défaut)** : `pnpm start`
- **Avec le backend réel** : `VITE_MOCK_API=false pnpm start`  
  (les appels `/api` sont alors proxifiés vers `http://localhost:8000`)

### E2E

Dans `@apps/e2e` :

```bash
pnpm setup
pnpm test:ui
```

Ou `pnpm test` pour lancer les tests en ligne de commande.

## Scripts à la racine

- `pnpm lint` / `pnpm lint:fix`
- `pnpm format` / `pnpm lint:format`
