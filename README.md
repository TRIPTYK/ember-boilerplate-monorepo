Start Up

pnpm install
docker compose up -d

# Backend
pnpm schema:fresh
pnpm dev

# Frontend
pnpm start

# e2e
pnpm setup
pnpm test:ui