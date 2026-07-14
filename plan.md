# Dependency cleanup plan

## Gate Ledger

### Work Classification Gate

- Status: Pass
- Classification: non-trivial
- Work type: mixed
- Affected systems: package manifest, lockfile, dependency inventory
- Required references/docs read: `AGENTS.md`, PM skill, research-agent and documentation rules
- Root-cause analysis required: no
- Architecture discussion complete: yes
- Evidence: scope is mechanically clear; audit false positives require repository-wide investigation

### Delegation Gate

- Status: Pass
- Research/investigation agent required: yes
- Developer agent required: no
- Reviewer agent required: no
- Testing agent required: no
- Subagents available: yes
- User authorization required for subagents: no
- Subagents started or queued without extra confirmation: yes
- Generic execution/QA wording treated as normal subagent workflow: yes
- Research/developer/reviewer/testing prompts dispatched: yes
- Blocking reason if agents were not started: none
- Direct-work override recorded in `discussion.md`: no
- Agent prompts prepared with acceptance criteria: yes
- Evidence: `/root/dependency_audit` dispatched for a read-only audit

### Research/Investigation Gate

- Status: Pass
- Required: yes
- Owner: research/explorer agent
- Questions or hypotheses investigated: which other direct dependencies lack actual source, config, script, or test usage
- Sources inspected: `package.json`, lockfile, source, tests, scripts, build/test/tool configuration, pnpm dependency graph
- Evidence gathered: seven other direct declarations have no repository usage after implicit/config/peer usage checks
- Findings accepted by main agent: yes
- Uncertainty or follow-up questions: `@react-router/node` is transitively present; tRPC client packages reflect intended but currently absent architecture
- Evidence: `/root/dependency_audit` read-only audit report

### Developer Gate

- Status: Pass
- Required: no
- Owner: not required
- Files changed: package manifest and lockfile will receive a tiny direct mechanical edit
- Acceptance criteria satisfied: yes; `next-themes` removed from manifest, lockfile, and installed dependency tree
- Validation run: `pnpm install --lockfile-only`; `pnpm install --store-dir /Users/sravan/Library/pnpm/store/v11`
- Unresolved implementation risks: none identified
- Evidence: direct-work allowance for tiny mechanical edits

### Review Gate

- Status: Pass
- Required: no
- Owner: not required
- Review findings: main-agent final diff review pending
- Lean-code review complete: yes
- Unnecessary helpers/wrappers/type checks/branches found: none applicable
- Far-ahead edge handling or speculative validation found: none applicable
- Cleanup required before pass: none
- Required changes closed: yes
- Residual risk: none
- Evidence: manifest-only removal

### Testing Gate

- Status: Pass
- Required: yes
- Owner: main agent direct override
- Commands/checks run: `pnpm run check`
- User-visible or integration flow verified: not applicable
- Failures found: none; only existing `envFile` deprecation warnings
- Residual risk: none for the removed package
- Evidence: React Router typegen and type-aware Oxlint completed with exit code 0

### Completion Gate

- Status: Pass
- Final diff/artifact review complete: yes
- Research/investigation verdict accepted: yes
- Reviewer verdict accepted: not required
- Tester verdict accepted: yes
- Stale agents closed: yes
- Docs updated: yes
- No hidden direct-work gap: yes
- Evidence: clean targeted manifest/lockfile diff; `git diff --check` passed; `pnpm list next-themes --depth 0` returned no package
