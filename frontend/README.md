# ASCEOfT UGC Dashboard — Frontend

Web frontend for the ASCEOfT UGC management platform, where creators and clients
manage campaigns, proposals, and contracts.

## 1. Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** (radix-ui primitives)
- **TanStack Query** (server state) + **TanStack Table**
- **TipTap** (rich text editor), **@react-pdf/renderer**, **jszip**, **zod**, **sonner**
- **pnpm** for dependency management

## 2. Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Backend running on `http://localhost:8080` (see `docker-compose.yml` at repo root)

## 3. Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Environment Variables

Create a `.env` file in the frontend root (see `.env` for reference):

| Variable                  | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_API_URL`     | Backend API base URL (e.g. `http://localhost:8080/api`) |
| `WATCHPACK_POLLING`       | Set `true` to enable file-watch polling (Docker) |

## 5. Running with Docker

```bash
docker compose up
```

Frontend on `:3000`, backend on `:8080`. Hot reload works via volume mounts and
polling env vars (`WATCHPACK_POLLING`, `CHOKIDAR_USEPOLLING`).

## 6. Scripts

| Script    | Command            | Description             |
| --------- | ------------------ | ----------------------- |
| `dev`     | `next dev --webpack` | Start dev server      |
| `build`   | `next build`       | Production build        |
| `start`   | `next start`       | Start production server |
| `lint`    | `eslint`           | Lint the codebase       |

## 7. Project Structure

```
src/app/          # App Router routes: login, creator/client register, campaigns,
                  #   contracts, proposals, calendar, dashboard, notifications,
                  #   workspace, settings
src/features/     # auth, client, creator, notifications feature modules
src/components/   # shared/UI components
src/hooks/        # shared hooks
src/lib/          # utilities and shared helpers
src/config/       # app configuration
src/providers/    # React providers (query client, etc.)
src/utils/        # utility functions
```

## 8. Roles

- **Creator** — creator registration, creator dashboard
- **Client** — client registration, client workspace

## 9. Notes

- Uses **webpack** for the dev server (`next dev --webpack`).
- Server state is managed via **TanStack Query**; forms validated with **zod**.
- Part of a monorepo — shared root includes `backend/` and `docker-compose.yml`.
