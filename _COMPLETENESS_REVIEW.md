# Completeness Review: coaching

**Review date:** 2026-07-18

## Assessment basis

Static inspection of project-owned source and configuration only; no dependency installation, build, database migration, external-service call, or runtime launch was performed. The scan considered 99 project files (82 source files), 1 manifest(s), 0 test-like file(s), and 0 CI workflow(s), excluding dependency/generated directories.

## Classification

**Functional but incomplete**

This is a substantive but unfinished application workflow application, not just an empty scaffold. Inspection found 82 source files across `src/`, `prisma/` using Next.js, React, Prisma; however, the checked-in workflow and delivery controls do not yet demonstrate a complete, production-operable product.

## Why it is not complete

- Generated gap/visualization routes describe missing capabilities or simulate recommendations; they do not implement the underlying domain operation.
- Generic LLM calls are used as product behavior without enough typed tools, grounded evidence, deterministic rules, or output evaluation.
- Mock, demo, sample, fixture, or placeholder behavior remains in executable/product paths.
- No recognizable project-owned automated tests were found for the main workflow.
- No checked-in CI workflow proves builds, tests, migrations, and security checks on every change.

## Needed features

1. Define the primary user and acceptance criteria, then complete one end-to-end workflow against persistent data instead of demo fixtures.
2. Replace mocks, placeholders, and generic AI responses with validated domain services and explicit failure/retry behavior.
3. Implement secure identity, role/tenant boundaries, input validation, secrets handling, and auditable state changes.
4. Add representative automated tests, CI quality gates, environment documentation, migrations, observability, backup, and deployment configuration.
5. Add risk-based unit, integration, and end-to-end tests in CI, including migration and failure-path coverage.

## Risks or launch blockers

- Automation contains destructive process, filesystem, or database operations; do not run it on a shared machine without review.
- Startup appears coupled to seed/migration behavior, risking data mutation or non-repeatable launches.
- AI-provider availability, cost, privacy, prompt injection, and unvalidated output are launch risks until bounded and evaluated.
- Regression risk is high because no recognizable project-owned automated tests cover the main path.

## Evidence inspected

- `README.md`
- `src/app/codex/custom-viz/page.tsx:31`
- `start.sh:63`
- `src/app/layout.tsx`
- `package.json`
- `start.sh`

## Recommended next action

Choose one real application workflow journey, define acceptance criteria and external contracts, then close its persistence, permission, integration, failure, and test gaps before expanding features.

## Implementation progress (2026-07-19)

Defined and completed the primary journey: a client selects an available coach, starts an idempotent paid engagement, receives a conflict-checked provider video session, works from coach-authored action items, separately acknowledges/reflection-signs the session, and records measurable evidence against goals. PostgreSQL now persists tenant identities, coach specialty/capacity, engagement and session state machines, typed action ownership, versioned goals/check-ins, deterministic outcome summaries, provider jobs, restore evidence, webhook receipts, and database-enforced append-only audit events.

Short-lived RS256 organization sessions enforce client, coach, and operator roles and tenant boundaries. Billing charge/refund, video meeting, and notification providers use explicit contracts, persisted idempotency keys, bounded retries/backoff, dead letters, and manual recovery states. Billing webhooks are HMAC signed, tenant bound, transactional, and replay safe. Invalid state changes, overlapping sessions, coach over-capacity, cross-role access, and stale goal updates fail closed. The production dashboard exposes the role-specific journey and deterministic evidence rollup; prior plaintext login, caller-supplied user APIs, seeded sample controls, generic AI, generated gaps, and unscoped admin routes are quarantined by production proxy policy.

Startup no longer kills processes, deletes caches, creates/resets/pushes/seeds databases, or prints demo credentials. Added explicit replay-safe migration/check commands, health endpoint, example environment, non-root container, CI, and a runbook for provider recovery, privacy, observability, incident response, encrypted backup, and witnessed restoration.

Verification completed against disposable PostgreSQL database `clinical_codex_coaching_20260719`: migration replayed twice and all 7 tests passed, including the real HTTP/PostgreSQL paid journey with three roles, tenant/capacity isolation, duplicate enrollment, billing decline/retry, schedule conflict, video failure/retry, notification, goal concurrency/evidence, deterministic outcomes, action-plan acknowledgment, refund, signed webhook replay, restore evidence, and audit immutability. The Next.js 16.2.10 production build and TypeScript pass, startup configuration/schema check, npm audit (zero vulnerabilities), shell syntax, and `git diff --check` passed.

External-only launch dependencies remain: production IdP provisioning, coach credentialing/client-consent and retention policy, contracted billing/video/notification providers, PCI-hosted payment tokenization, observability/on-call, backup infrastructure, privacy review, and a witnessed restore drill.

## Runtime acceptance (2026-07-20)

The non-suite validator passed the complete disposable runtime journey on
PostgreSQL `55633`, API `6080`, and UI `6081` at `2026-07-20T20:38:48Z`:
`API_VERIFIED / startup_login_session_api`. One recorded diagnostic attempt
showed that Next.js had fixed `NODE_ENV` at build time; the local auth surface
was changed to require the exact initial-admin acknowledgement and remain
disabled in OIDC mode. The passing run proved startup, scrypt credential login,
opaque PostgreSQL session persistence/revalidation, and authenticated API use.
