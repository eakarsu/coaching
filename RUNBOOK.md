# Governed coaching runbook

## Production boundary

The supported production journey is the `/api/v1/coaching` service and `/dashboard` workspace. Proxy policy returns 404 for the prior caller-supplied-user APIs, generic AI routes, generated gap pages, and unscoped admin page. Keep `ENABLE_LEGACY_DEMOS=0` in production.

## Release

1. Provision `coaching_tenants` and configure the organization identity provider to issue its UUID as `tenant_id`, plus exactly one `client`, `coach`, or `operator` role.
2. Source `.env.example` values from managed secrets. Billing tokens must be hosted-payment/PCI tokens; never send card data through this application.
3. Run `ALLOW_SCHEMA_MIGRATION=1 ./start.sh migrate` from the controlled release job. The migration is replay-safe; application startup never migrates, seeds, resets, deletes cache, or kills processes.
4. Run `./start.sh check`, then `./start.sh start`. Monitor `/api/v1/coaching/health`, provider dead letters, webhook signature failures, engagement capacity conflicts, and audit write failures.

## Provider recovery and privacy

Billing, video, and notification jobs retain original idempotency keys, attempt counts, retry timing, status, and error code. Transient 429/5xx errors use exponential delay; terminal and fifth failures dead-letter. A failed billing or video operation requires the explicit client/coach retry command before a new provider job is created.

Webhooks require HMAC-SHA256 `X-Signature`, tenant UUID, and unique delivery ID. Preserve delivery bodies in the provider’s secure event archive, but do not log session notes, reflections, payment tokens, or webhook bodies in application logs. Coaching notes are tenant and engagement scoped; client acknowledgment is separate from coach completion.

## Backup and incident response

Use encrypted PostgreSQL point-in-time backups. Quarterly, restore into an isolated account and verify tenant/role isolation, engagement/session states, meeting references, goal versions, action ownership, provider idempotency, receipt uniqueness, and append-only audit continuity. Record the result through `POST /api/v1/coaching/restore-drills` with durable evidence.

For a provider incident, stop only job execution, rotate the scoped provider credential, reconcile provider references, then retry using the persisted idempotency key. For a privacy incident, preserve audit sequences, revoke identity access, follow contractual notification timelines, and avoid altering coaching records.

## External blockers

Launch still requires a real IdP, coach credentialing and client-consent policy, contracted billing/video/notification providers, PCI-hosted payment tokenization, privacy and records-retention review, observability/on-call integration, backup infrastructure, and a witnessed restore drill. Repository code cannot provide those accounts, policies, or approvals.
