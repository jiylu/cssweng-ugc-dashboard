# ASCEOfT UGC Dashboard — Backend

REST API for the ASCEOfT UGC management platform, where creators and clients
manage campaigns, proposals, contracts, deliverables, payments, and invoices.

## 1. Tech Stack

- **NestJS 11** (Express) + **TypeScript**
- **Prisma 7** + **PostgreSQL**
- **Supabase** (Auth) + **Supabase Storage** + **Cloudinary** (file/media uploads)
- **JWT** (passport-jwt), **class-validator** / **class-transformer**
- **WebSockets** (`ws`), **Nodemailer** (email/OTP), **Swagger UI**
- **Jest** + **Supertest** for testing

## 2. Prerequisites

- Node.js 20+
- npm or pnpm
- A Supabase project (Postgres, Auth, Storage) or a local PostgreSQL instance
- Docker (optional, for containerized dev)
- Frontend running on `http://localhost:3000` (CORS is restricted to this origin)

## 3. Getting Started

```bash
pnpm install
pnpm prisma generate

cp .env.development .env   # or use .env.production for prod-style config
pnpm run db:push:dev
pnpm run start:dev
```

- API: `http://localhost:8080/api`
- Swagger docs: `http://localhost:8080/docs`

Note: the app uses `dotenv-flow`, which loads the matching `.env.<NODE_ENV>`
file automatically based on `NODE_ENV`.

## 4. Environment Variables

Create a `.env` file in the backend root (names listed below; values are kept
out of the repo):

| Variable                   | Description                                     |
| -------------------------- | ----------------------------------------------- |
| `DATABASE_URL`             | PostgreSQL connection string                    |
| `PORT`                     | Server port (default `8080`)                    |
| `SUPABASE_URL`             | Supabase project URL                            |
| `SUPABASE_ANON_KEY`        | Supabase anon (public) key                      |
| `SUPABASE_SERVICE_ROLE`    | Supabase service-role key                       |
| `SUPABASE_SECRET_KEY`      | Supabase secret key                             |
| `SUPABASE_STORAGE_BUCKET`  | Storage bucket name for uploads                 |
| `ZOHO_USER`                | Zoho mail account for outbound email            |
| `ZOHO_APP_PASSWORD`        | Zoho app password                               |
| `OTP_HASH_SECRET`          | Secret used to hash registration OTPs           |
| `CLOUDINARY_URL`           | Cloudinary connection URL                       |
| `CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud name                           |
| `CLOUDINARY_API_KEY`       | Cloudinary API key                              |
| `CLOUDINARY_SECRET_KEY`    | Cloudinary API secret                           |

## 5. Running with Docker

```bash
docker compose up
```

Frontend on `:3000`, backend on `:8080`. Hot reload works via volume mounts and
polling env vars (`WATCHPACK_POLLING`, `CHOKIDAR_USEPOLLING`).

> The backend service loads its config from `./backend/.env`, so create it
> before running.

## 6. Scripts

| Script           | Command                          | Description                |
| ---------------- | -------------------------------- | -------------------------- |
| `start`          | `nest start`                     | Start without watching     |
| `start:dev`      | `nest start --watch`             | Dev mode with hot reload   |
| `start:prod`     | `node dist/main`                 | Run the production build   |
| `build`          | `nest build`                     | Compile to `dist/`         |
| `lint`           | `eslint "src/**/*.ts" --fix`     | Lint (and fix) source      |
| `format`         | `prettier --write`               | Format source files        |
| `test`           | `jest`                           | Run unit tests             |
| `test:e2e`       | `jest --config ./test/jest-e2e.json` | Run e2e tests         |
| `test:cov`       | `jest --coverage`                | Run tests with coverage    |
| `db:push:dev`    | `prisma db push` (dev env)       | Sync schema to dev DB      |
| `db:push:prod`   | `prisma db push` (prod env)      | Sync schema to prod DB     |

## 7. Project Structure

```
src/
  features/            # feature modules
    user/              # users, OTP
    campaign/          # campaigns, proposals, contracts, add-ons, drafts,
                       #   gifted-products, payments, invoices, campaign-setup
    deliverable/       # deliverables, submissions, items
    assets/            # written assets, media assets (+ drafts)
  shared/              # cross-cutting infrastructure
    prisma/            # Prisma client module
    supabase/          # Supabase client
    supabase-storage/  # file uploads to Supabase Storage
    cloudinary/        # media uploads via Cloudinary
    email/             # mailer (Zoho)
    notifications/     # WebSocket notifications
    analytics/         # analytics service
    activity-log/      # user activity logging
    upload/            # upload helpers
    guards/            # auth guards
    decorators/        # custom decorators
prisma/
  schema.prisma        # database schema
  migrations/          # Prisma migrations
test/                  # e2e tests
```

## 8. Roles

- **Creator** — creator registration, creator dashboard
- **Client** — client registration, client workspace

## 9. Notes

- API endpoints are prefixed with `/api`.
- CORS is limited to `http://localhost:3000`.
- Prisma 7 resolves the datasource URL via `prisma.config.ts` (per env file).
- Part of a monorepo — shared root includes `frontend/` and `docker-compose.yml`.
