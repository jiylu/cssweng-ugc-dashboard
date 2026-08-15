# ASCEOFT UGC Dashboard

A full-stack management platform for **user-generated content (UGC)** campaigns, where **creators** and **clients** connect to plan, negotiate, and fulfill brand collaborations. The platform handles the entire lifecycle — from campaign briefs and proposals to signed contracts, deliverables, payments, and invoices.

This repository is a monorepo containing the **Next.js frontend**, the **NestJS backend**, and a shared **Docker Compose** setup for local development.

## 1. Monorepo Layout

```
cssweng/
├── backend/              # NestJS 11 REST API (Express + TypeScript)
│   ├── prisma/           # Database schema & migrations (PostgreSQL)
│   └── src/
│       ├── features/     # user, campaign, deliverable, assets modules
│       └── shared/       # prisma, supabase, cloudinary, email, guards, ...
├── frontend/             # Next.js 16 UI (App Router + React 19 + TypeScript)
│   └── src/
│       ├── app/          # routes: login, register, campaigns, contracts,
│       │                 #   proposals, calendar, dashboard, workspace, ...
│       ├── features/     # auth, client, creator, notifications
│       └── components/   # shared/UI components (shadcn/ui)
├── docker-compose.yml    # dev environment (backend :8080, frontend :3000)
└── .github/workflows/    # CI (backend-ci.yml)
```

## 2. Tech Stack

| Layer     | Technologies |
| --------- | ------------ |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, TanStack Query & Table, TipTap, @react-pdf/renderer |
| **Backend**  | NestJS 11, TypeScript, Prisma 7, PostgreSQL, Supabase (Auth + Storage), Cloudinary, JWT, WebSockets, Nodemailer |
| **DevOps**   | Docker Compose, pnpm, GitHub Actions CI |

## 3. Getting Started

### Option A — Docker (recommended)

Create the `.env` files first (see `backend/README.md` and `frontend/README.md` for the required variables), then:

```bash
docker compose up
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Swagger docs: http://localhost:8080/docs

Hot reload works out of the box via volume mounts and polling.

### Option B — Local development

Each app runs independently:

```bash
# Backend (needs PostgreSQL + Supabase config)
cd backend
pnpm install && pnpm prisma generate
cp .env.development .env
pnpm run db:push:dev
pnpm run start:dev

# Frontend (needs the backend on :8080)
cd frontend
pnpm install
pnpm dev
```

See `backend/README.md` and `frontend/README.md` for full setup instructions, environment variable tables, and available scripts.

## 4. Core Features

- **Campaigns & Setup** — campaign briefs, add-ons, gifted products, and drafts
- **Proposals** — proposal creation, history, and negotiation flow
- **Contracts** — contract generation with e-signatures
- **Deliverables** — deliverables with item-level tracking and submissions
- **Assets** — written and media asset management (including drafts)
- **Billing** — payments and invoice generation (PDF via `@react-pdf/renderer`)
- **Collaboration** — WebSocket notifications, activity logging, and a campaign calendar
- **Auth** — registration with OTP verification (PurelyMail), JWT sessions, password reset

## 5. Roles

- **Creator** — creator registration, creator dashboard, campaign and deliverable management
- **Client** — client registration, client workspace, proposal/contract approval, and payments

## 6. Notes

- API endpoints are prefixed with `/api`; Swagger UI is available at `/docs`.
- CORS is restricted to `http://localhost:3000`.
- Dependencies are managed with **pnpm**; each app has its own lockfile.
- Detailed, per-app documentation lives in `backend/README.md` and `frontend/README.md`.
