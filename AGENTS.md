# AGENTS.md

This file provides guidance to LLMs when working with code in this repository.

> **For project overview**: See [README.md](./README.md) for features and documentation.

---

## 📋 Quick Reference

Jump to section:

| Section                                               | Description                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| [Core Principles](#-core-principles)                  | Type safety, architecture, error handling, testing, UX       |
| [Commands](#commands)                                 | pnpm scripts for dev, build, test, lint, e2e                  |
| [Architecture](#architecture)                         | Layered architecture, data flow, type safety                 |
| [Development Requirements](#development-requirements) | Non-negotiable rules, code style, patterns                   |
| [Directory Structure](#directory-structure)           | File organization and structure principles                   |
| [Design System](#design-system)                       | Colors, typography, component patterns                       |
| [UX Requirements](#-user-experience-ux-requirements)  | Loading states, error handling, responsive design, animation |
| [Logging and Debugging](#logging-and-debugging)       | Custom runtime logging and recovery guidance                 |
| [React Component Patterns](#react-component-patterns) | Component structure, route patterns                          |
| [Testing Patterns](#testing-patterns)                 | Component and service testing                                |
| [React Router v7 Reference](#react-router-v7-guide)   | Client routing, `routes.ts` APIs, and tRPC query/mutations   |
| [Autonomous Task Workflow](#autonomous-task-workflow) | Context management, task completion                          |

### Key Import Paths

```typescript
// App-side imports
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/trpc";
import { PageLayout } from "~/components/layout/PageLayout";

// Server-side imports
import { getDatabase } from "../db/index.js";
import { CreateCustomerSchema } from "../contracts/sales.js";
```

---

## 🎯 Core Principles

This codebase follows strict architectural patterns and coding standards:

### 1. **Type Safety First**

- Every function must have explicit return types
- No `any` types allowed - use `unknown` (if absolutely necessary) or proper types (almost always from zod schemas)
- Never use `@ts-nocheck` or any file-level TypeScript disabling directive. If TypeScript reports errors, fix the root cause instead of silencing the compiler.
- Use Zod schemas for runtime validation always, derive TypeScript types from schemas without duplicating types
- Full static validation must pass before committing

### 2. **Clean Architecture**

- **server/db/index.ts** - Database client initialization (better-sqlite3 + Drizzle)
- **server/db/schemas.ts** - Drizzle table schema definitions
- **server/db/queries/** - Database query modules (must use `ResultAsync.fromThrowable`)
- **server/services/** - Business logic orchestration (must return neverthrow `Result`/`ResultAsync`)
- **server/contracts/** - Runtime API contracts (Zod) + inferred TypeScript types
- **server/trpc/router.ts** - API contract and procedure handlers
- **app/routes/** - Page components and route-level UI composition
- **app/lib/trpc.ts** - Type-safe API client binding to server router types
- **app/components/** - UI components only (rendering + local interaction patterns)
- **server/utils/** / **app/lib/utils.ts** - Pure utility functions by runtime boundary

### 3. **Error Handling**

- Use neverthrow's `Result<T, E>` and `ResultAsync<T, E>` for all operations that can fail
- Never throw exceptions in service/query business logic
- Check `.isErr()` / `.isOk()` before accessing values
- Provide meaningful error messages
- **See [Error Handling UX](#error-handling-ux-mandatory) for user-facing error patterns**

### 3.1 **Hard Contract Enforcement (Compile-Time + Runtime)**

These rules repeat the type-safety principles as implementation gates. Treat them as hard constraints, not suggestions.

- **Compile-time contracts**: all function return types must be explicit and type-safe
- **Runtime contracts**: all external/untrusted input must be validated with Zod before use
- **Contract reuse**: derive TypeScript types from Zod schemas (`z.infer<>`), never duplicate shapes manually
- **Boundary-first validation**: validate at tRPC/service entry, then only pass typed data deeper
- **No `any`**: use exact types or `unknown` + refinement
- **No `@ts-nocheck` ever**: do not disable TypeScript for a file. A task is not complete while any new or retained `@ts-nocheck` exists in touched code.

### 4. **Testing Requirements** 🚨 ENFORCED

> **CRITICAL**: Tests are required only when they protect core behavior, a complex flow, a stable contract, or a bug fix that must not regress. Do not add tests for every small change.

Testing order matters:
- `pnpm run check` is the static-analysis gate. Run it near the end to catch obvious type and lint errors before deeper verification.
- Interactive Playwright verification is the user-perspective gate. Use it to confirm the changed flow actually works in the UI the way a user would experience it.
- Targeted unit/component/integration tests and targeted E2E tests are regression gates only when the changed behavior warrants automated coverage. Prefer updating existing tests before adding new ones.

**Minimal Test Coverage Decision:**

- **Frontend changes** (routes, components, hooks, UI behavior) → use interactive Playwright verification for changed user-facing behavior. Add or update unit/component tests only for stable core components, shared behavior, complex state, accessibility contracts, or regressions that need strict protection.
- **Backend changes** (server services, contracts, db queries/operations, tRPC procedures) → add or update unit/integration tests when the change affects core business logic, runtime contracts, persistence behavior, permissions, calculations, or a bug fix.
- **Small UI changes** (copy, color, spacing, one-off layout tweaks, simple button wiring) → normally need no unit or E2E test. Use interactive verification when the UI behavior or layout changed.
- **E2E tests** → add or update only for core user workflows, complex multi-step flows, persistence/navigation boundaries, permission boundaries, or high-risk regressions.
- **Bug fixes** → write or update a test only when the bug is in core behavior or is likely to regress. Otherwise prove the fix with the narrowest relevant check and interactive verification when user-facing.
- **Existing tests** → inspect connected tests first. Remove obsolete, brittle, convoluted, or non-core tests; update connected tests when they can carry the needed coverage; add new tests only when no existing test can.

**Enforcement Rules:**

1. **NO UNNECESSARY TESTS**: Do not add tests unless they protect core behavior, complex flows, stable contracts, or meaningful regressions.
2. **Existing tests first**: Remove, update, or preserve connected existing tests before adding new tests.
3. **Test the behavior, not the implementation**: Tests should verify what the code does, not how it does it
4. **Interactive verification for UI**: Run interactive Playwright verification for changed user-facing flows before deciding whether unit or E2E coverage is warranted.
5. **Targeted commands only**: Run only the unit/component/integration or E2E files relevant to the warranted coverage.
6. **No confidence reruns**: Rerun tests only when code, tests, config, fixtures, or prior output changed, or when a narrower diagnostic is needed.

**What to test:**

| Change Type          | Test decision                                                                 |
| -------------------- | ----------------------------------------------------------------------------- |
| New component        | Test only stable shared behavior, accessibility contracts, or complex state   |
| New service function | Test core business logic, contract validation, persistence, and error paths   |
| Route + API flow     | Prefer interactive verification; add E2E only for core or complex workflows   |
| Bug fix              | Add/update a test when the bug is core or likely to regress                   |
| Refactor             | Run connected existing tests only when behavior or contracts could change     |

- Run the narrowest relevant check based on what changed
- Run `pnpm run check` near the end; if it fails, fix every visible issue group before rerunning the broad command
- Run interactive Playwright verification for changed user-facing behavior; if it fails, fix the issue and rerun the same targeted verification
- If unit/component/integration coverage is warranted, run only the targeted files for the changed behavior
- If E2E coverage is warranted, run only the new, changed, or directly connected E2E spec(s)
- This order is intentional: static analysis first, interactive verification next for real user behavior, then minimal automated tests only when they protect core behavior
- Run broad checks once after targeted fixes are complete; do not rerun broad commands after each tiny fix while known issue groups remain
- If higher-priority task instructions define a stricter or different validation workflow, follow those instructions
- No need to run checks for docs-only/non-code changes

### 5. **Code Quality Standards**

- Write self-documenting code with clear names
- Comment the "why", not the "what"
- Follow the single responsibility principle
- Keep functions small and focused

### 6. **User Experience (UX) Standards** ⭐ NEW

**All user-facing code MUST implement proper UX patterns.** Poor UX is a bug.

- **Loading States**: Every data fetch MUST show loading UI (skeletons, spinners)
- **Pending UI**: Every form submission MUST show pending state
- **Optimistic Updates**: Mutations should update UI immediately where feasible
- **Error Feedback**: Errors must be user-friendly, actionable, and recoverable
- **Responsive Design**: All UI must work on mobile, tablet, and desktop
- **Motion**: Use purposeful animation for feedback and guidance

> **CRITICAL**: See [UX Requirements](#-user-experience-ux-requirements) for detailed patterns and [React Router v7 Reference Guide](#react-router-v7-guide) for implementation details.

## Commands

```bash
pnpm run build         # Build client + compile server TypeScript
pnpm run build:client  # Build React Router client output
pnpm run build:server  # Compile server TypeScript only
pnpm run start         # Run production Hono server
pnpm run start:e2e     # Start built server against .dbs/e2e.db
pnpm run db:generate   # Generate Drizzle SQL migrations from schema changes
pnpm run db:migrate    # Run server database migrations
pnpm run lint          # Type-aware linting with TypeScript diagnostics
pnpm test              # Run all tests with Vitest
pnpm run check         # Full static report check: React Router typegen + lint
pnpm run prepare:e2e   # Rebuild .dbs/e2e.db with migrations and deterministic seed data
pnpm run e2e           # Build and run Playwright E2E with Playwright-owned lifecycle
```

The production server intentionally serves built client assets with cache headers and precompressed asset support; keep hashed assets long-cacheable, keep HTML short-cacheable, and do not remove this static-serving behavior.

To run a single test file:

```bash
pnpm exec vitest run tests/unit/db/db.test.ts

pnpm run build
pnpm exec playwright test tests/e2e/path/spec.ts
```

For helper-owned E2E runs, the helper must build first, run `pnpm run prepare:e2e`, start the server with `pnpm run start:e2e`, then run Playwright with `PLAYWRIGHT_EXTERNAL_SERVER=1 pnpm exec playwright test tests/e2e/path/spec.ts`.

## Architecture

This is a React Router v7 SPA with a dedicated Hono+tRPC backend and SQLite persistence using better-sqlite3 + Drizzle ORM.

### Architectural Flow

The application follows a strict client/server layered architecture:

```
User Interaction
    ↓
React Router Route Component (app/routes/*.tsx)
    ↓
tRPC React Query Client (app/lib/trpc.ts)
    ↓
Hono tRPC Endpoint (/trpc/* in server/index.ts)
    ↓
tRPC Router Procedures (server/trpc/router.ts)
    ↓
Service Layer (server/services/[file].ts)
    ↓
Schema Validation (server/contracts/*.ts)
    ↓
Database Query Layer (server/db/queries/*.ts)
    ↓
Database Client (server/db/index.ts)
    ↓
SQLite (.dbs/database.db)
```

**Key Rules:**

1. **App routes/components** call **tRPC hooks**, never import server db/services directly
2. **tRPC router procedures** call **server services**, not the database directly
3. **Server services** validate with **server/contracts**, then call **server/db/queries**
4. **`server/db/index.ts`** is the ONLY database client initialization module
5. All server-side mutable operations use neverthrow (`Result`/`ResultAsync`) and structured error objects
6. All `server/db/queries/*` functions must use `ResultAsync.fromThrowable(...)`

### Type Safety Flow

Every layer maintains strict end-to-end type safety:

```typescript
// 1. Define schema on the server (server/contracts/sales.ts)
export const CreateCustomerSchema = z.object({
  company_name: z.string().min(1).max(200),
  email: z.string().email().optional(),
});

// 2. Derive server types
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;

// 3. Validate and execute in service layer
export async function createCustomer(
  data: unknown,
): Promise<Result<Customer, DatabaseError>> {
  const validation = CreateCustomerSchema.safeParse(data);
  if (!validation.success) {
    return err({
      type: "VALIDATION_ERROR",
      message: "Invalid customer data",
      details: validation.error.errors,
    });
  }

  return insertCustomer(validation.data);
}

// 4. Expose through tRPC router (server/trpc/router.ts)
export const appRouter = router({
  createCustomer: procedure
    .input(CreateCustomerSchema)
    .mutation(async ({ input }) => createCustomer(input)),
});

// 5. Consume with typed hooks in app routes (app/routes/*.tsx)
const createCustomerMutation = trpc.createCustomer.useMutation();
```

### Database Layer Rules

**CRITICAL**: `server/db/` is the authoritative database boundary. The paths below are hard ownership boundaries and must not be bypassed:

- `server/db/index.ts` initializes and exposes the shared Drizzle client
- `server/db/schemas.ts` defines table schemas
- `server/db/queries/*.ts` performs reads/writes and returns `ResultAsync`
- `server/db/migrations/` stores Drizzle SQL migrations and metadata

**NEVER:**

- Run ad-hoc SQL directly in `server/services/*` or `server/trpc/*`
- Bypass query modules from API handlers
- Return raw thrown errors from query/service functions
- Use `any` in query/service contracts

## Development Requirements

### Non-Negotiable Rules

1. **Strict Type Safety**
   - Every function must have explicit return types
   - No `any` types and no `@ts-nocheck` - use specific types (usually derived from zod schemas) and fix root typing issues
   - If TypeScript reports errors, fix the root cause. Never silence the compiler with file-level disables.
   - The compile-time and runtime contract rules above are non-negotiable: TypeScript strict mode, explicit signatures, Zod at trust boundaries, `z.infer<>`-derived types, and no duplicated shape definitions across layers

2. **Test Coverage** 🚨 MANDATORY WHEN WARRANTED
   - See [Testing Requirements](#4-testing-requirements--enforced) in Core Principles - ALL rules apply
   - A task is not complete until the required test decision is recorded and any warranted targeted tests pass

3. **Validation Before Completion**
   - Run checks only at the very end of the task (right before marking it complete). Use `pnpm run lint` for focused static/backend checks. Use `pnpm run check` for full repo report checks. Skip checks for non-code-only changes (e.g. Markdown/docs, copy, comments, or other non-executable content).
   - `pnpm run lint` runs Oxlint with TypeScript diagnostics.
   - `pnpm run check` runs React Router typegen and then `pnpm run lint`; for full static validation, run only `pnpm run check`.
   - Use `pnpm run check` as the full static-analysis gate so obvious type and lint errors are fixed before deeper verification
   - For any database schema or migration change, run `pnpm run db:generate` before completion and treat any unexpected follow-up migration file as a bug that must be fixed
   - For any database schema or migration change, the repository must end in a state where `pnpm run db:generate` reports no unexpected schema drift; if publish runs a generate step before migrate, a locally healthy `db:migrate` result alone is not sufficient
   - After `pnpm run check` passes for user-facing code changes, run interactive Playwright verification for the changed flow and fix/retry until it passes
   - Interactive Playwright is the user-perspective gate and should be treated as the source of truth for whether the changed flow behaves correctly in the UI
   - After interactive verification passes, create, modify, remove, or skip targeted unit/component/integration tests according to the minimal coverage decision
   - If E2E is warranted, use `pnpm run prepare:e2e`, helper-owned server startup with `pnpm run start:e2e`, and `PLAYWRIGHT_EXTERNAL_SERVER=1 pnpm exec playwright test <spec>` for only the targeted changed flow. `pnpm run e2e` remains the Playwright-owned lifecycle path.
   - If the production build reports chunks over the configured warning limit, inspect whether the warning comes from a large route, component file, or external package that should be behind `import()`/`React.lazy` before accepting the warning
   - Warranted targeted automated tests come after interactive verification so they capture the behavior that was just confirmed from the user perspective
   - ALL checks must pass before considering task complete
   - Fix any errors before moving to next task

4. **Single Source of Truth**
   - These are hard architecture boundaries, not preferences
   - Database client initialization ONLY in `server/db/index.ts`
   - Table definitions ONLY in `server/db/schemas.ts`
   - Database read/write operations ONLY in `server/db/queries/`
   - Business logic ONLY in `server/services/`
   - Validation/contracts ONLY in `server/contracts/`
   - API procedure contracts ONLY in `server/trpc/router.ts`
   - UI route/component logic ONLY in `app/routes/` and `app/components/`
   - Never bypass these layers

5. **Error Handling Pattern**
   - See [Error Handling](#3-error-handling) in Core Principles for Result pattern
   - See [Error Handling UX](#error-handling-ux-mandatory) for user-facing error patterns
   - Query modules in `server/db/queries/` MUST use `ResultAsync.fromThrowable(...)`
   - Service modules in `server/services/` MUST compose query results with neverthrow (`map`, `andThen`, `mapErr`)
   - Do not throw from query/service logic for expected failure paths

### Code Style Requirements

- **Comments**: Always write detailed comments for all code. Use doc tag comments (JSDoc `/** */`) before functions, classes, and logic blocks. Use regular `//` comments inside logic to explain why the code exists or why a non-obvious step is needed, not to restate what the code already says
- **Naming**: Clear, descriptive names for functions and variables
- **Functions**: Keep small and focused (single responsibility)
- **Imports**: Use `~/` path alias for app imports
- **Large frontend imports**: Any route, component file, or external package that is likely to add about 50 kB or more to a client chunk must be loaded behind `import()`/`React.lazy` unless it is required for the first paint. Examples include charting packages (`recharts`), data-grid/table engines (`@tanstack/react-table`), rich editors, maps, PDF viewers, analytics dashboards, and large demo/reference surfaces. Add a short comment at the lazy boundary explaining that the import must stay lazy because the dependency is large.
- **Avoid barrel exports**: Do not add barrel export files or aggregate modules that re-export other modules, especially `export *`. Prefer direct imports from the defining module so tree-shaking and bundle splitting can work at the module boundary. The `oxc/no-barrel-file` Oxlint rule is enabled as an error for large `export *` barrels; treat smaller barrel files as disallowed by project convention as well.
- **Formatting**: Let Prettier handle formatting (configured in project)

### Key Patterns

#### Error Handling with neverthrow

Database queries should return `ResultAsync<T, E>` and service functions should return `Result<T, E>` (or `ResultAsync<T, E>` where composition benefits from it). Check `.isErr()` / `.isOk()` before accessing values. Error types are defined in `server/types/errors.ts`.

```typescript
import { ResultAsync } from "neverthrow";
import type { DatabaseError } from "./types/errors";

export function getRecords(): ResultAsync<MyRow[], DatabaseError> {
  const run = ResultAsync.fromThrowable(
    async () => {
      const db = getDatabase();
      return db.select().from(myTable);
    },
    (error: unknown) => ({
      type: "DATABASE_ERROR",
      message: "Failed to fetch records",
      originalError: error instanceof Error ? error : undefined,
    }),
  );

  return run();
}

// Usage in tRPC procedure handlers
const result = await getRecords();
if (result.isErr()) {
  throw new Error(result.error.message);
}
return result.value;
```

#### Schema Validation with Zod

**Always define schemas first, derive types from them:**

```typescript
// ❌ WRONG - Don't define TypeScript types first
interface User {
  id?: number;
  name: string;
  email: string;
}

// ✅ CORRECT - Define Zod schema, derive type
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format"),
  created_at: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Create/Update schemas for forms
export const CreateUserSchema = UserSchema.omit({ id: true, created_at: true });
export const UpdateUserSchema = UserSchema.partial().required({ id: true });
```

**Schema Validation in Services:**

```typescript
export async function createUser(data: unknown): Promise<Result<User, Error>> {
  // Always validate unknown input
  const validation = CreateUserSchema.safeParse(data);

  if (!validation.success) {
    return err(new Error(`Validation failed: ${validation.error.message}`));
  }

  // validation.data is now typed and safe to use
  const result = await insertUser(validation.data);
  return result;
}
```

#### Database & Migrations

**Database Technology:** better-sqlite3 + Drizzle ORM with file persistence at `.dbs/database.db`

**Fixed Database Paths:**

- The actual app database path is always `.dbs/database.db`. This is the production/user-data database path.
- The Playwright/E2E database path is always controlled by `E2E_DATABASE_FILE_PATH`, as wired in `tests/e2e/database.ts`.
- Unit, integration, interactive Playwright, and E2E verification must never write to, migrate, seed, reset, truncate, delete, or manipulate `.dbs/database.db`.
- Read-only inspection of `.dbs/database.db` is allowed when needed to understand existing data, diagnose current app state, or derive deterministic E2E seed data. Any copied/derived seed data must be written only through isolated E2E setup, never back into `.dbs/database.db`.
- Test and verification code must use `.dbs/e2e.db` through `E2E_DATABASE_FILE_PATH`, `pnpm run prepare:e2e`, the unit-test fallback in `server/db/index.ts`, or a clearly isolated temporary sqlite file created only for that test.
- `.dbs/database.db` is only for actual app runtime data and intentional app database migration commands such as `pnpm run db:migrate`. It is not a verification sandbox.
- Never change these paths, rename them, move them, introduce alternate defaults, or make migrations point somewhere else.
- Drizzle migration scripts are set up to run against `.dbs/database.db` by default. That is intentional and must remain true.
- Changing the production database path can break the app and can cause users to lose data. Treat these paths as hard contracts.

**Critical Rules:**

1. `server/db/index.ts` is the ONLY DB client initialization entrypoint
2. `server/db/queries/*.ts` is the ONLY place for database read/write logic
3. Use Drizzle migrations for all schema changes
4. Never modify the database schema directly in production
5. Never point tests, Playwright, fixture setup, or verification helpers at `.dbs/database.db`
6. Use `pnpm run prepare:e2e` as the shared deterministic setup for interactive Playwright scripts and E2E specs.
7. Use `pnpm run start:e2e` for helper-owned server startup against isolated E2E state.
8. When an external lifecycle helper owns setup and server startup, run Playwright with `PLAYWRIGHT_EXTERNAL_SERVER=1` so Playwright does not rerun global setup or start a second server.

**Migration System:**

```typescript
// server/db/migrations/0001_initial.sql
CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL
);
```

**Migration Workflow:**

When creating a new migration:

1. **Generate** migrations from schema changes (preferred): `pnpm run db:generate`
2. **Review** generated SQL in `server/db/migrations/`
3. **Run** migrations: `pnpm run db:migrate`
4. **Verify** and test
   - Verify the migration command output completed successfully
   - Read-only inspection of `.dbs/database.db` is allowed when needed to confirm the intentional app migration result
   - Verify tables/columns were created correctly
   - Run any warranted tests against `.dbs/e2e.db` or an isolated temporary sqlite database, never against `.dbs/database.db`

**Drizzle Metadata Integrity:**

- Never add or update a migration by editing only `server/db/migrations/00xx_*.sql` and `server/db/migrations/meta/_journal.json`.
- Drizzle migration history is not complete unless the matching `server/db/migrations/meta/00xx_snapshot.json` files are present and chained correctly.
- If a migration is created manually for any reason, you must also create or restore the matching snapshot metadata so `db:generate` has the correct baseline.
- Data-only migrations still need a corresponding snapshot file in `server/db/migrations/meta/`, even when the schema shape is unchanged from the prior snapshot.
- Publish/staging may run `db:generate` before `db:migrate`, so missing snapshot metadata can create bogus follow-up migrations and break deploys even when local `db:migrate` appears healthy.

```bash
# After creating a migration file:
pnpm run db:generate          # Generate SQL migration
pnpm run db:migrate           # Apply the migration
pnpm test                     # Ensure tests pass
```

**CRITICAL**: Always run and verify migrations immediately after creating them. Never commit a migration file without confirming it runs successfully, and never commit a migration/history change unless the SQL file, snapshot file, and journal entry all agree.

**Database Query Pattern:**

```typescript
export function insertUser(
  data: InsertUserInput,
): ResultAsync<User, DatabaseError> {
  const run = ResultAsync.fromThrowable(async () => {
    const db = getDatabase();
    await db.insert(users).values(data);
    const row = await db.select().from(users).orderBy(desc(users.id)).limit(1);
    return row[0];
  }, mapDatabaseError);

  return run();
}
```

### Directory Structure (Example App)

```
app/
├── components/
│   ├── layout/          # Page layout primitives (PageLayout, PageHeader)
│   └── ui/              # Reusable UI components used by active routes
├── hooks/
│   └── use-mobile.tsx   # Shared client hook
├── lib/
│   ├── trpc.ts          # Typed tRPC React client
│   ├── trpc-provider.tsx # QueryClient + tRPC provider composition
│   └── utils.ts         # Client utility helpers
├── routes/
│   ├── index.tsx        # Customers list route
│   ├── customers.new.tsx # Create customer route
│   ├── customers.$id.tsx # Customer detail route
├── utils/
│   └── logger.ts        # Client logging utility
├── routes.ts            # React Router route map
└── root.tsx             # Root layout component

server/
├── contracts/
│   ├── core.ts          # Core Zod contracts
│   ├── sales.ts         # Sales/customer Zod contracts
│   └── index.ts         # Contract exports
├── db/
│   ├── index.ts         # Drizzle client initialization
│   ├── schemas.ts       # Drizzle table definitions
│   ├── queries/         # Query modules (ResultAsync.fromThrowable required)
│   │   ├── customers.ts
│   │   ├── documents.ts
│   │   ├── tasks.ts
│   │   └── users.ts
│   ├── migrations/      # Drizzle SQL migrations + metadata
│   └── migrate.ts       # Migration runner
├── index.ts             # Hono app: CORS, /trpc/*, assets, SPA fallback
├── start.ts             # Node server startup entrypoint
├── trpc/
│   ├── index.ts         # tRPC init/context
│   └── router.ts        # tRPC procedures and API contract
├── services/
│   └── erp.ts           # Business logic
├── types/
│   └── errors.ts        # Typed error contracts
└── utils/
    ├── calculations.ts  # Domain calculations
    └── validate.ts      # Shared validation helper

tests/
├── unit/                # Unit/component/integration tests
│   ├── components/      # UI component tests
│   ├── db/              # Database operation tests
│   └── services/        # Business logic tests
└── e2e/                 # Playwright end-to-end tests and deterministic E2E setup
    ├── database.ts      # Isolated .dbs/e2e.db path and prepare helper
    ├── prepare.ts       # CLI entrypoint for pnpm run prepare:e2e
    ├── seed.ts          # Canonical deterministic seed data
    └── server-start.mjs # Built-server startup wired to isolated E2E DB
```

**Structure Principles:**

- Separate client and server responsibilities (`app/` vs `server/`)
- Keep API boundary explicit through `server/trpc/router.ts` and `app/lib/trpc.ts`
- Keep persistence and migrations exclusively in `server/`
- Keep route files focused on UI composition + tRPC hook orchestration
- Tests mirror behavior-critical boundaries (UI, service, db)

### Design System

**UI Components:** shadcn/ui with Radix primitives

**Color Palette:**

- Primary: Blue (`primary` / `primary-foreground` CSS variables)
- Neutral grays following shadcn default theme
- Status colors: Red (destructive), Amber (warning), Green (success), Blue (info)

**Typography:**

- System fonts with clean, minimal styling (shadcn defaults)
- Professional, clean aesthetic

**Component Patterns:**

- All components in `app/components/ui/` follow shadcn conventions
- Built on Radix UI primitives for accessibility
- Use composition over configuration
- Props interfaces defined with TypeScript
- Consistent styling with Tailwind CSS v4

**Layout Structure:**

- `PageLayout` - Main page wrapper with breadcrumbs
- `PageHeader` - Consistent page titles and actions
- `TopBar` - Top navigation, logo, and theme toggle

---

## 🎨 User Experience (UX) Requirements

**CRITICAL**: This section defines mandatory UX patterns for all user-facing code. Every route, form, and interactive element MUST implement these patterns. Poor UX is a bug - treat it with the same severity as broken functionality.

> **Important**: All UX patterns in this section integrate with React Router v7 navigation plus tRPC React Query state. See the [React Router v7 Reference Guide](#react-router-v7-guide) section for routing, query, and mutation patterns.

---

### Loading States (MANDATORY)

**Every query and mutation MUST have a loading state.** Users should never see blank screens.

#### Skeleton Components

Use the existing `Skeleton` component from `~/components/ui/skeleton`:

| Component  | Use Case                      | Key Props             |
| ---------- | ----------------------------- | --------------------- |
| `Skeleton` | Page/section/row placeholders | `className` sizing    |
| `Button`   | Built-in loading state        | `loading`, `disabled` |

**HydrateFallback Pattern (required for SPA hydration):**

```typescript
export function HydrateFallback(): ReactElement {
  return (
    <PageLayout>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </PageLayout>
  );
}
```

#### Button Loading States

```typescript
// Preferred: Button with built-in loading
<Button loading={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>

// With tRPC mutation
const createCustomer = trpc.createCustomer.useMutation();
const isSubmitting = createCustomer.isPending;
<Button type="submit" loading={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
```

#### 3. Optimistic Updates (REQUIRED for mutations)

**All mutations MUST implement optimistic UI.** Predict the outcome and update UI immediately while the request processes.

> **Full Implementation**: Use the patterns in this section; React Router guidance focuses on client navigation APIs and route boundaries.

**Core Pattern:** Use pending mutation variables or React Query cache updates to render predicted state:

```typescript
const updateTask = trpc.updateTask.useMutation();

// Optimistically determine state from pending mutation variables
let isComplete = task.status === "complete";
if (updateTask.isPending && updateTask.variables?.id === task.id) {
  isComplete = updateTask.variables.status === "complete";
}

// Optimistic delete - filter out items being deleted
const visibleItems = items.filter((item) => {
  if (deleteTask.isPending && deleteTask.variables?.id === item.id) {
    return false;
  }
  return true;
});
```

#### 4. Progressive Disclosure

Use collapsible sections to reduce cognitive load. Show primary fields first, reveal advanced options on demand.

---

### Error Handling UX (MANDATORY)

**Every error state MUST be user-friendly, actionable, and recoverable.** Technical errors should never be shown directly to users.

> **Implementation**: Use route-level `ErrorBoundary` exports for unexpected rendering/runtime failures.

#### Core Principles

- **NEVER show raw error messages** - translate to human-readable messages
- **Always offer retry** for recoverable errors
- **Graceful degradation** - show cached/stale data when fresh data fails
- **Route error boundaries** - every route must handle errors gracefully

#### Error Message Pattern

```typescript
// Map error types to user-friendly messages
const ERROR_MESSAGES: Record<
  string,
  { title: string; description: string; action?: string }
> = {
  NETWORK_ERROR: {
    title: "Connection Problem",
    description: "Check your internet connection.",
    action: "Retry",
  },
  NOT_FOUND: {
    title: "Not Found",
    description: "This item doesn't exist or was removed.",
    action: "Go Back",
  },
  SERVER_ERROR: {
    title: "Something Went Wrong",
    description: "We're working on it.",
    action: "Try Again",
  },
};

export function getUserFriendlyError(errorType: string): {
  title: string;
  description: string;
  action?: string;
} {
  return (
    ERROR_MESSAGES[errorType] || {
      title: "Oops!",
      description: "Please try again.",
      action: "Retry",
    }
  );
}
```

#### ErrorDisplay Component

Use `<ErrorDisplay error={{ type, message }} variant="page|inline" onRetry={fn} />` for consistent error UI.

**Variants:** `page` (full-page centered), `inline` (banner with dismiss), `toast` (notification)

#### Route Error Boundary Pattern

```typescript
export function ErrorBoundary(): ReactElement {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const type = error.status === 404 ? "NOT_FOUND" : error.status === 403 ? "PERMISSION_DENIED" : "SERVER_ERROR";
    return <ErrorDisplay error={{ type, message: error.statusText }} variant="page" />;
  }

  return <ErrorDisplay error={{ type: "SERVER_ERROR", message: "Unexpected error" }} variant="page" />;
}
```

#### Graceful Degradation Pattern

```typescript
// Return cached data when fresh data fails
if (result.isErr()) {
  const cached = getCachedData();
  if (cached)
    return { data: cached, error: "Using cached data", isStale: true };
  return { data: [], error: result.error.message, isStale: false };
}
```

---

### Responsive Design (MANDATORY)

**All UI MUST be fully responsive.** Mobile-first design required.

#### Core Principles

- **Mobile-first**: Write mobile styles first, add breakpoint modifiers for larger screens
- **Touch targets**: Minimum 44x44px (WCAG 2.1 AAA), use `min-w-[44px] min-h-[44px]`
- **Responsive tables**: Show as card lists on mobile (`block md:hidden` / `hidden md:block`)

**Breakpoints:** `sm:640px` `md:768px` `lg:1024px` `xl:1280px` `2xl:1536px`

**Mobile-First Pattern:**

```typescript
// ✅ CORRECT - Mobile-first
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">

// ❌ WRONG - Desktop-first
<div className="flex flex-row gap-8 max-md:flex-col max-md:gap-4">
```

**Responsive Navigation:** Desktop sidebar (`hidden lg:flex`), mobile hamburger menu (`lg:hidden`).

---

### Animation & Motion (MANDATORY)

**Animation must be purposeful** - provide feedback, guide attention, create continuity. Never decorative.

> Use `viewTransition` for page transitions. See [React Router v7 Reference Guide](#react-router-v7-guide).

#### Key Patterns

| Type               | Tailwind Classes                              | Use Case            |
| ------------------ | --------------------------------------------- | ------------------- |
| Micro-interactions | `transition-colors duration-150`              | Hover/active states |
| Scale feedback     | `active:scale-[0.98]`                         | Button press        |
| Page entrance      | `animate-in fade-in slide-in-from-bottom-4`   | Route transitions   |
| Toast/notification | `animate-in slide-in-from-right-full fade-in` | Alerts              |
| Shimmer skeleton   | `animate-shimmer` (custom)                    | Loading states      |

**Motion Accessibility (CRITICAL):**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### React Component Patterns

**Component Structure:**

```typescript
// ✅ CORRECT - Full type safety
interface ButtonProps {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
}: ButtonProps): ReactElement {
  return (
    <button
      className={clsx(
        "font-semibold rounded transition-colors",
        variantStyles[variant],
        sizeStyles[size]
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

**Route Module Structure:**

> **Full Implementation**: See [React Router v7 Reference Guide](#react-router-v7-guide) for comprehensive patterns.

Every route module should export:

1. `default` component - Render route UI (REQUIRED)
2. Optional `ErrorBoundary` - Handle route-level render/runtime errors
3. Optional route metadata exports as needed (`meta`, `links`)
4. Use `trpc.*.useQuery()` for reads and `trpc.*.useMutation()` for writes
5. Use local pending/error UI based on query/mutation state

**Key React Patterns:**

- Functional components with explicit return types (`ReactElement`)
- Props interfaces for all components
- Composition over prop drilling
- Implement pending UI, optimistic UI, and loading skeletons (see React Router v7 Reference)

### Linting Rules

oxlint enforces strict standards. All violations must be fixed before marking complete.

Checkout the [oxlint config](./.oxlintrc.json) for details on rules when needed.

### Testing Patterns

> **CRITICAL**: See [Testing Requirements](#4-testing-requirements--enforced). Add, update, remove, or skip tests according to the minimal coverage decision.

**Tools:** Vitest + React Testing Library + Playwright

**Component Test Pattern:**

```typescript
describe("Button", () => {
  it("shows loading feedback and disables interaction while loading", async () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Saving</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Saving" }));

    expect(screen.getByRole("button", { name: "Saving" })).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

**Service Test Pattern:**

```typescript
describe("User Service", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates user successfully", async () => {
    const result = await createUser({
      name: "Test",
      email: "test@example.com",
    });
    expect(result.isOk()).toBe(true);
  });

  it("returns error for invalid data", async () => {
    const result = await createUser({ name: "", email: "invalid" });
    expect(result.isErr()).toBe(true);
  });
});
```

**Organization:** Unit tests in `tests/unit/` mirror active boundaries only when coverage is warranted (`app/components`, `server/db`, `server/services`). Browser E2E tests live in `tests/e2e/` only for core or complex workflows. Keep sample tests minimal; do not test every prop, class, variant, button click, or incidental UI branch.

### Path Alias

Use `~/` to import from `app/` directory (e.g., `import { Button } from '~/components/ui/button'`).

## Autonomous Task Workflow

You work autonomously on the current task until done.

### Context Management

Re-read files anytime especially when the conversation is compacted:

- README.md for project conventions
- AGENTS.md for rules
- Current task file for task details
- Project-local skills in `.opencode/skills/<skill-name>/SKILL.md` when task instructions reference a skill by name

### Rules

- Always call task_complete - never delete task files manually
- Run checks only at the very end of each task: use `pnpm run lint` for focused static/backend checks, and use `pnpm run check` for full repo report checks
- No need to run checks for docs-only/non-code-only updates (e.g. Markdown/docs, copy, comments, or other non-executable content)
- If you feel the conversation is getting long, do NOT summarize and stop - keep executing task

**Example task_complete usage:**

```bash
node /workspace/builder/task_complete.mjs --projectId "xyz" --taskId "123" --taskFilePath "/workspace/development/.agent/tasks/00_task-name.md" --status completed --summary "Implemented feature X with Y approach"
```

Use `--status failed` if the task cannot be completed, with a summary explaining why.

## Project Context (Do This First)

- Read `README.md` before making decisions so you understand what the app is, how it runs, and the repo conventions
- Read `AGENTS.md` for instructions on how to develop with the system
- If the README points to other sources of truth (e.g. `.env.example`, `package.json`, `docs/`), read those too

## Important: Logging and Debugging

Overview is detailed at the bottom of this document. Make full use of the logging system to debug issues and NEVER remove logging.

---

## React Router v7 Guide

> **CRITICAL**: This section is the authoritative reference for **client-side routing only**. In this codebase, React Router is used only for navigation, route hierarchy, and route module boundaries on client-side (not as a full-stack data framework).

### Overview

This app uses:

- **React Router v7** for client-side URL matching and navigation
- **Route config in `app/routes.ts`** using `@react-router/dev/routes` helpers
- **Route modules in `app/routes/*.tsx`** and layouts in `app/layouts/*.tsx`
- **tRPC + React Query hooks** inside route modules for typed query/mutation flows

**What this means:**

- React Router guidance here is about `routes.ts`, route modules, and navigation APIs
- Keep routing concerns in `app/routes.ts` + route/layout modules
- Route modules orchestrate UI and call `trpc.*.useQuery()` / `trpc.*.useMutation()`

---

### `routes.ts` API (Authoritative)

`app/routes.ts` defines the route tree. Prefer helper functions from `@react-router/dev/routes`:

```typescript
import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/MainLayout.tsx", [
    index("routes/index.tsx"),
    route("customers/new", "routes/customers.new.tsx"),
  ]),
] satisfies RouteConfig;
```

**Primary helpers:**

1. `layout(file, children)` - Defines a layout route that renders an `Outlet`
2. `index(file)` - Defines the default child route at the parent's exact path
3. `route(path, file, children?)` - Defines a path route and optional nested children
4. `prefix(prefixPath, routes)` - Adds a shared URL prefix without a parent route file
5. `relative(directory)` - Builds helper set scoped to another directory when splitting route config

**`routes.ts` rules:**

- Route module file paths are relative to `app/`
- Keep route config declarative; avoid runtime conditionals in route definitions
- Use `satisfies RouteConfig` on default export
- Prefer `layout(...)` for shared shells instead of duplicating wrappers across route files

---

### Layout Route Contract

Layout modules (for example, `app/layouts/MainLayout.tsx`) should provide shared UI and render children with `Outlet`.

```typescript
import type { ReactElement } from "react";
import { Outlet } from "react-router";

export default function MainLayout(): ReactElement {
  return (
    <main>
      {/* shared nav/header/chrome */}
      <Outlet />
    </main>
  );
}
```

---

### Route Module Exports

Every route module should export:

1. `default` route component (`ReactElement` return type)
2. Optional `ErrorBoundary` for unexpected route rendering/runtime failures
3. Optional metadata exports such as `meta` and `links` when needed

Route modules should keep routing concerns local and use `trpc` hooks for data reads/writes.

---

### Client Navigation APIs

Use these hooks/components for routing concerns in client code:

```typescript
// Declarative navigation
<Link to="/" />
<NavLink to="/customers/new" />

// Imperative navigation
const navigate = useNavigate();
navigate("/customers/new");
navigate(-1);

// Route state
const navigation = useNavigation();
const isNavigating = navigation.state !== "idle";
const params = useParams();
const [searchParams, setSearchParams] = useSearchParams();
const location = useLocation();

// Route-level error boundary helpers
const error = useRouteError();
isRouteErrorResponse(error);
```

Use `useNavigation()` for global transition UI in layouts:

```typescript
import { useNavigation } from "react-router";

function LayoutShell(): ReactElement {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  return (
    <div>
      {isNavigating && <div className="h-1 w-full animate-pulse bg-primary" />}
      {/* layout content */}
    </div>
  );
}
```

---

### Essential Hooks Reference

```typescript
// tRPC + React Query (primary data APIs)
trpc.getCustomers.useQuery();
trpc.getCustomerById.useQuery({ id });
trpc.createCustomer.useMutation();
trpc.updateCustomer.useMutation();
trpc.deleteCustomer.useMutation();
trpc.useUtils(); // invalidate/setData/cancel helpers

// React Router hooks (routing/navigation concerns)
useNavigate();
useNavigation();
useParams();
useSearchParams();
useLocation();

// Root/route error handling hooks
useRouteError();
isRouteErrorResponse(error);
```

---

### Data Fetching (Queries)

Use `trpc.*.useQuery()` for route-level reads:

```typescript
import type { ReactElement } from "react";
import { trpc } from "~/lib/trpc";
import { Alert } from "~/components/ui/alert";
import { Skeleton } from "~/components/ui/skeleton";

export default function CustomersPage(): ReactElement {
  const {
    data: customers = [],
    isLoading,
    error,
  } = trpc.getCustomers.useQuery();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (error) {
    return <Alert variant="destructive">{error.message}</Alert>;
  }

  return <div>{customers.length} customer(s)</div>;
}
```

**Query rules:**

- Always render a loading state
- Always render user-facing error feedback
- Keep query logic in route/module UI code, not in `routes.ts`

---

### Mutations (Form Submission)

Use `trpc.*.useMutation()` for route-level writes:

```typescript
import type { FormEvent, ReactElement } from "react";
import { useNavigate } from "react-router";
import { trpc } from "~/lib/trpc";
import { Button } from "~/components/ui/button";
import { Alert } from "~/components/ui/alert";

export default function NewCustomerPage(): ReactElement {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const createCustomer = trpc.createCustomer.useMutation({
    onSuccess: async () => {
      await utils.getCustomers.invalidate();
      void navigate("/");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    createCustomer.mutate({
      company_name: String(formData.get("company_name") || ""),
      email: String(formData.get("email") || "") || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {createCustomer.error && (
        <Alert variant="destructive">{createCustomer.error.message}</Alert>
      )}
      <Button type="submit" loading={createCustomer.isPending}>
        {createCustomer.isPending ? "Creating..." : "Create Customer"}
      </Button>
    </form>
  );
}
```

**Mutation rules:**

- Show pending state on submit controls
- Invalidate related queries on success
- Keep error feedback visible and recoverable

---

### Pending + Optimistic UI

Use query/mutation/navigation state together:

1. Query-level loading: `query.isLoading`
2. Mutation-level pending: `mutation.isPending`
3. Navigation transition: `useNavigation().state`

Optimistic rendering pattern (route-local):

```typescript
const updateTask = trpc.updateTask.useMutation();

let isComplete = task.status === "complete";
if (updateTask.isPending && updateTask.variables?.id === task.id) {
  isComplete = updateTask.variables.status === "complete";
}
```

Robust list-level optimistic update with rollback:

```typescript
const utils = trpc.useUtils();

const deleteCustomer = trpc.deleteCustomer.useMutation({
  onMutate: async ({ id }) => {
    await utils.getCustomers.cancel();
    const previous = utils.getCustomers.getData();

    utils.getCustomers.setData(undefined, (current) =>
      (current ?? []).filter((c) => c.id !== id),
    );

    return { previous };
  },
  onError: (_error, _input, context) => {
    if (context?.previous) {
      utils.getCustomers.setData(undefined, context.previous);
    }
  },
  onSettled: async () => {
    await utils.getCustomers.invalidate();
  },
});
```

---

### Error Boundary Pattern

```typescript
import type { ReactElement } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary(): ReactElement {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <div>{error.status} {error.statusText}</div>;
  }

  const message = error instanceof Error ? error.message : "Unexpected error";
  return <div>{message}</div>;
}
```

---

### Routing Do/Don't

- Do use `layout`, `index`, and `route` helpers in `app/routes.ts`
- Do keep navigation logic in route/layout modules with Router hooks
- Do keep route modules focused on rendering, navigation, and `trpc` hook orchestration
- Don't introduce route tree entries outside `app/routes.ts`
- Don't import server-only modules into client route/layout files

**Config requirements to keep:**

- `react-router.config.ts` enables `future.v8_viteEnvironmentApi: true`
- `vite.config.ts` uses Vite 8-compatible settings

---

## IMPORTANT: Logging and Debugging

- This project uses custom runtime logging for both frontend and backend.
- Frontend errors are captured from browser globals and forwarded to `POST /logs`, then written to the project-root `.runtime.logs`.
- Backend errors (including process-level failures, unhandled app errors, and missing routes) are also written to `.runtime.logs`.
- If users report issues, debug by reading `.runtime.logs` first before any other investigation.
- The following logging pieces are critical and must not be removed:
  - `app/utils/error-logger.ts`
  - `app/routes.ts` logging bootstrap usage
  - `server/services/logging.ts`
  - `server/contracts/logging.ts`
  - `server/index.ts` logging routes and handlers
