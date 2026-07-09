# Full-Stack Reference Template for React Router + Hono + tRPC + SQLite

**This is a reusable full-stack template** with a working `app/` shell, backend reference implementation, and tested conventions for TypeScript, contracts, and project boundaries.

It is designed as the baseline for building real applications, not as a shipped product.  
Use the code as copy-ready examples for architecture, conventions, and implementation patterns.

> **⚠️ Important**: This repository is a **template and reference**, not a domain-complete business application.

## 📋 What This Template Is

- **Full-stack starting point** with React Router SPA + Hono + tRPC + Drizzle + better-sqlite3
- **Template codebase** you can copy/adapt for new client projects
- **Pattern-first structure** for contracts, queries, services, routes, and provider wiring
- **Quality standard** baseline with static checks, tests, and migration workflow

## ✅ Use This Template For

- Studying and reusing full-stack architecture
- Copying backend/frontend integration patterns
- Aligning on project organization, package choices, and test strategy
- Adapting typed API contracts and boundary-driven code

## ❌ This Template Does Not Provide

- A complete business solution
- Domain-owned workflows or production-ready application behavior
- A drop-in final application without adaptation

## 🔧 What It Includes

- A client-facing shell in `app/` with reusable UI and route patterns
- A backend reference module in `server/` (contracts, queries, services, tRPC router, and migration wiring)
- Database-first migration flow using Drizzle and SQLite
- Shared quality patterns in tests, linting, and type safety

## 💡 How to Use

- Study the template structure in `app/`, `server/`, and `tests/`
- Copy or adapt the backend and frontend slices needed for your project
- Replace the example domain module with your own contracts and business rules
- Extend existing conventions rather than changing foundational architecture decisions
- Keep the same coding standards described in [AGENTS.md](./AGENTS.md)

## 🔍 Full-Stack Reference Slice

The repository is intentionally compact but complete in pattern:

- `app/` demonstrates typed routing, reusable UI, and layout wiring
- `server/contracts/` provides runtime validation contracts
- `server/db/queries/` provides data access
- `server/services/` provides business orchestration
- `server/trpc/` provides API boundaries
- `tests/` demonstrates how to structure and test core pieces at each boundary

The point is to preserve proven structure and standards while replacing domain logic for real products.

## Template Features

- **Architecture**: React Router v7 SPA mode + Hono API server + tRPC transport
- **Type Safety**: Zod contracts + neverthrow `Result` patterns
- **Data Layer**: SQLite (`better-sqlite3`) with Drizzle migrations
- **Component System**: Tailwind v4 + reusable UI primitives
- **Quality Gates**: static validation, lint, and Vitest test baseline
- **Template Scope**: workflow shell scaffold, not a finished product workflow implementation

## Workflow Shell

This template ships with a neutral workflow UI shell:

- left rail organizes stages and steps
- step routes are route-backed
- navigation advances through stages and steps
- proceed actions support predictable flow transitions

The workflow behavior is intentionally lightweight and data-driven so teams can replace the source data and persistence strategy without changing the shell.

The current state is seeded for development and demonstration. It is not a product-default dataset.

## Tech Stack

| Package               | Version  | Purpose                         |
| --------------------- | -------- | ------------------------------- |
| react-router          | 7.18.0   | Client routing framework        |
| vite                  | 8.0.16   | Build tool                      |
| hono                  | ^4.12.25 | HTTP server                     |
| @trpc/server          | ^11.17.0 | Type-safe API layer             |
| @trpc/react-query     | ^11.17.0 | Typed client hooks              |
| @tanstack/react-query | ^5.101.0 | Query/mutation state management |
| tailwindcss           | 4.3.1    | Styling                         |
| zod                   | 4.4.3    | Runtime validation              |
| neverthrow            | 8.2.0    | Type-safe error handling        |
| vitest                | 4.1.9    | Unit/integration test framework |
| oxlint                | 1.70.0   | Type-aware linting              |
| better-sqlite3        | ^12.11.1 | SQLite runtime                  |
| drizzle-orm           | ^0.45.2  | ORM and query builder           |
| drizzle-kit           | ^0.31.10 | Migration generation            |

## 🎨 Design

- **UI Primitives**: shadcn/ui-style component set
- **Layout**: shared shell in `app/layouts/MainLayout.tsx`
- **Styling**: Tailwind v4 utility patterns with design tokens
- **Direction**: scalable dashboard/workflow styling baseline

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Generate and apply SQL migrations
pnpm run db:generate
pnpm run db:migrate

# Build and run
pnpm run build
pnpm run start
```

## 📁 Project Structure

```text
app/
├── components/
│   └── ui/                    # Reusable UI components
├── hooks/
│   └── use-mobile.tsx
├── layouts/
│   └── MainLayout.tsx         # Shared page shell + header
├── lib/
│   ├── workflow-engine.ts     # Workflow progression engine
│   ├── trpc.ts                # Typed tRPC client
│   ├── trpc-provider.tsx      # Typed provider composition
│   └── utils.ts
├── routes/
│   └── index.tsx              # Default route
├── routes.ts                  # Route definitions
└── root.tsx                   # Root route entry for React Router

server/
├── contracts/
│   ├── estimate.ts            # Reference domain contract
│   └── index.ts
├── db/
│   ├── index.ts               # Drizzle + better-sqlite3 init
│   ├── schemas.ts             # Sample Drizzle schema
│   ├── queries/
│   │   └── estimates.ts       # Sample data-access layer
│   ├── migrations/            # Generated SQL + metadata
│   └── migrate.ts             # Migration runner
├── services/
│   └── estimate.ts            # Reference business orchestration
├── trpc/
│   └── router.ts              # Reference API procedures
├── types/
│   └── errors.ts              # Shared typed error contracts
├── index.ts                   # Hono app setup
└── start.ts                   # Server entrypoint

tests/
├── e2e/                       # Playwright tests and deterministic E2E setup
│   ├── database.ts            # Isolated .dbs/e2e.db path and prepare helper
│   ├── prepare.ts             # CLI entrypoint for pnpm run prepare:e2e
│   ├── seed.ts                # Canonical deterministic seed data
│   └── server-start.mjs       # Built-server startup wired to isolated E2E DB
└── unit/                      # Unit/component/integration tests
    ├── components/            # UI component tests
    ├── db/                    # DB behavior tests
    ├── layouts/               # Layout tests
    ├── routes/                # Route tests
    └── services/              # Service tests
```

## 🗄️ Database Architecture

- **Technology**: SQLite (`better-sqlite3`) + Drizzle ORM
- **Database file path**: `.dbs/database.db`

Migration workflow:

1. Update `server/db/schemas.ts`
2. Run `pnpm run db:generate`
3. Run `pnpm run db:migrate`

### Tables Included

- `estimates`

This keeps one reference domain table for easy adaptation.

## 📝 Scripts

| Script                | Description                           |
| --------------------- | ------------------------------------- |
| `pnpm run build`      | Build client + server                 |
| `pnpm run build:client` | Build client bundle                 |
| `pnpm run build:server` | Compile server TypeScript             |
| `pnpm run start`      | Start production Hono server           |
| `pnpm run start:e2e`  | Start built server against `.dbs/e2e.db` |
| `pnpm run db:generate`| Generate Drizzle SQL migrations       |
| `pnpm run db:migrate` | Run migrations                        |
| `pnpm run lint`       | Type-aware linting with TypeScript diagnostics |
| `pnpm test`           | Run Vitest suite                      |
| `pnpm run check`      | Run React Router typegen and `lint`   |
| `pnpm run prepare:e2e` | Rebuild `.dbs/e2e.db` with migrations and deterministic seed data |
| `pnpm run e2e`        | Build and run Playwright E2E specs    |

## 🧪 Testing

```bash
pnpm test
pnpm run check
pnpm run prepare:e2e
pnpm run e2e
```

- UI/component tests
- Route and route-layout tests
- Database tests
- Service-layer tests

Unit tests use Vitest for core behavior, stable contracts, and meaningful regressions. Playwright e2e is reserved for core or complex user workflows. The included tests are samples of minimal warranted coverage, not a requirement to test every component prop, style, or UI tweak.

Interactive Playwright scripts and E2E specs should share the same deterministic setup. Use `pnpm run prepare:e2e` to rebuild `.dbs/e2e.db` with migrations and canonical seed data, then use `pnpm run start:e2e` when a lifecycle helper owns server startup. When an external lifecycle helper already owns setup and server startup, run Playwright with `PLAYWRIGHT_EXTERNAL_SERVER=1`; that disables Playwright global setup and Playwright `webServer` so the helper remains the lifecycle owner.

## 🏗️ Example Module

The repository includes one cohesive reference backend module:

- **Estimate**
- Contract: `server/contracts/estimate.ts`
- Query: `server/db/queries/estimates.ts`
- Service: `server/services/estimate.ts`
- API route: `server/trpc/router.ts`

Use this module as a pattern to build your own domain modules.

## 📖 Documentation

- [README.md](./README.md) - this overview
- [AGENTS.md](./AGENTS.md) - coding standards and mandatory workflow rules

This template is a reusable starting point for building full-stack products with a consistent architecture, explicit boundaries, and strong conventions. It is intentionally an example and not a finished app.
