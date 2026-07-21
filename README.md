# Governed Coaching Platform

The production workflow serves one primary user journey: a client selects an available coach, pays for an engagement, receives a provider-backed session, works from a coach-authored action plan, acknowledges the session, and records measurable evidence against goals.

## What is implemented

- Short-lived RS256 organization identity with tenant-scoped `client`, `coach`, and `operator` roles.
- Coach specialty/capacity control and idempotent paid engagement enrollment.
- Durable billing charge/refund, video meeting, and notification jobs with retries, dead letters, signed webhook replay protection, and explicit recovery commands.
- Scheduling conflict prevention, coach-only completion notes/action items, separate client acknowledgment/reflection, measurable goals, optimistic check-ins, and deterministic outcome summaries.
- Append-only audit history, restore-drill evidence, safe migrations/startup, health check, non-root container, and CI.
- A focused production dashboard. Legacy demo fixtures, plaintext login, generic AI, caller-supplied user IDs, generated gaps, and unscoped admin routes are quarantined by production proxy policy.

## Verify

```bash
npm ci
cp .env.example .env
# Replace every placeholder and use a disposable PostgreSQL database.
ALLOW_SCHEMA_MIGRATION=1 ./start.sh migrate
./start.sh check
TEST_DATABASE_URL=postgres:///coaching_test npm test
npm run build
./start.sh start
```

The real HTTP/PostgreSQL test applies the migration twice and covers tenant and role isolation, coach capacity, duplicate enrollment, payment failure/retry, scheduling collision, video failure/retry, notification delivery, goal concurrency, deterministic progress evidence, action-plan acknowledgment, refund, webhook replay, restore evidence, and audit immutability.

See [RUNBOOK.md](RUNBOOK.md) for release, privacy, provider recovery, backup/restore, incident response, and external dependencies.
