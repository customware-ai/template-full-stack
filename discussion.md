# Dependency cleanup

## Goal

- Remove the confirmed-unused `next-themes` dependency.
- Refresh the pnpm lockfile, verify the repository, commit, and push.
- Report other likely unused direct dependencies without removing them.

## Decisions

- `next-themes` is safe to remove because the application imports its own local theme provider and no source or configuration imports the package.
- Other candidates require evidence-based reporting only; they are outside this change's removal scope.
- Dependency removal is a tiny mechanical edit. The wider dependency audit is non-trivial research and is delegated.

## Gate Context

- Work classification: non-trivial
- Work type: mixed
- Affected systems: package manifest, pnpm lockfile, dependency inventory
- Subagents required: yes
- Research/investigation agents required: yes
- Developer agents required: no
- Reviewer agents required: no
- Testing agents required: no
- Subagents available: yes
- User authorization required for subagents: no
- User authorized subagents: not required
- Subagents started without extra confirmation: yes
- Generic execution/QA instruction received: "remove it, rerun PPM install, commit and push...give me a list"
- Generic execution/QA instruction treated as normal subagent workflow: yes
- Direct-work override: none
- Reason direct work is allowed, if any: dependency removal is a tiny mechanical edit
- Decisions that must be preserved: remove only `next-themes`; report but do not remove other candidates
- Open questions or risks: `@react-router/node` is not imported directly but exists transitively through tooling; the unused tRPC client stack is documented as intended architecture but is not implemented

## Audit findings

- High-confidence unused direct dependencies: `@react-router/node`, `@tanstack/react-query`, `@trpc/client`, `@trpc/react-query`, `isbot`, and `react-is`.
- High-confidence unused direct dev dependency: `@testing-library/user-event`.
- Hidden/configured usage was checked across scripts, build/test configuration, TypeScript configuration, tests, and pnpm's dependency graph.
- No additional package was removed because the user requested a list, not broader cleanup.
