# Audit Note — coaching

**Bucket:** A. DETECTOR_FALSE_POSITIVE (verified per batch instructions)

**Date:** 2026-05-06

## Detection Result vs. Reality

The original audit (`/Users/erolakarsu/projects/_AUDIT/reports/batch_09.md`) classified `coaching` as
"Next.js. 15 pages, 19 AI endpoints. Has Prisma. Verdict: Partial-Build" — i.e., the audit already
recognized that AI is wired in. The batch instructions explicitly flagged this project as needing
verification because the per-project detector that drives the apply pipeline missed the AI usage in
`src/lib`.

This verification confirms the audit verdict: AI **is** present and centralized in
`src/lib/openrouter.ts`, with virtually every `app/api/*` route consuming it.

## LLM References Found (whole-project scan)

The repo-wide scan for `openrouter|openai|anthropic|claude|chat/completions` (excluding
`node_modules`/`.next`/`.git`/`dist`) returned:

- `src/lib/openrouter.ts` — central OpenRouter client (model defaults to `anthropic/claude-haiku-4.5`)
- `src/app/dashboard/goal-setter/page.tsx` — UI surface for AI goal-setting
- `src/app/api/moods/route.ts` and `src/app/api/moods/[id]/route.ts`
- `src/app/api/goals/route.ts`, `src/app/api/goals/[id]/route.ts`,
  `src/app/api/goals/suggest/route.ts`
- `src/app/api/habits/route.ts`, `src/app/api/habits/[id]/route.ts`
- `src/app/api/decisions/route.ts`, `src/app/api/decisions/[id]/route.ts`
- `src/app/api/sessions/route.ts`, `src/app/api/sessions/[id]/route.ts`
- `src/app/api/homework/route.ts`, `src/app/api/homework/[id]/route.ts`
- `src/app/api/predictions/route.ts`, `src/app/api/predictions/[id]/route.ts`
- `prisma/seed.ts`

## Source Counts

- 52 `.js`/`.ts`/`.tsx`/`.jsx`/`.py` source files (excluding `node_modules`/`.next`/`.git`).
- 15 page-route entries under `src/app/` (matches audit).
- 19 API route handlers under `src/app/api/`, 17 of which reference the OpenRouter client (matches
  audit's "19 AI endpoints").
- Already targets the required model: `anthropic/claude-haiku-4.5` is the default in
  `src/lib/openrouter.ts`.

## Conclusion

`coaching` is **not** a skeleton and is **not** missing AI integration. No scaffolding is required.
No code changes were made. The user's note that AI lives in `src/lib` is correct and is the reason
the per-batch detector flagged it as a likely false positive.

## Genuinely Missing Audit Recommendations

The original audit reported a list of AI categories ("Goal planning, habit tracking, mood tracking,
session generation, homework generation, decision support, predictions") and gave no concrete gap
list. Defensible follow-ups for the owner (enhancements, not scaffolding gaps):

- Streaming responses from `callOpenRouter` for long-form session/homework generation.
- A `/api/ai/coach-summary` weekly digest endpoint that aggregates moods + goals + habits into a
  single LLM-generated summary.
- Rate limiting on AI endpoints behind authenticated user IDs.

## Apply pass — implemented

Implemented the `/api/ai/coach-summary` weekly digest. Mechanical extension of the existing pattern (helper in `src/lib/openrouter.ts` + thin App-Router POST handler).

1. Added `generateCoachSummary({recentMoods, activeGoals, activeHabits, timeframeDays})` helper to `/Users/erolakarsu/projects/coaching/src/lib/openrouter.ts`. JSON-extracts a `{summary, highlights, suggestions}` object using the same pattern as `analyzeMood` / `predictOutcome`.
2. Created `/Users/erolakarsu/projects/coaching/src/app/api/ai/coach-summary/route.ts`. POST endpoint takes `{userId, timeframeDays?}` (defaults to 7 days), pulls moods/goals/habits from Prisma, and returns the digest. Mirrors the body-validation + prisma + delegate-to-helper pattern from `src/app/api/goals/suggest/route.ts`.

Syntax check: `npx tsc --noEmit` — pass (no new errors from our changes; pre-existing JSX namespace errors unrelated).

## Backlog (prioritized)

1. [PRODUCT-DECISION] Streaming responses from `callOpenRouter` — would require changing the helper signature (Promise<string> vs ReadableStream) and updating every consumer; not mechanical.
2. [PRODUCT-DECISION] Rate limiting — no rate-limiter currently exists in `src/lib`; choosing in-memory vs Redis-backed depends on hosting model.
3. [PRODUCT-DECISION] Auth-bind `coach-summary` — currently trusts `userId` from request body, matching existing pattern in this repo. A real auth integration is a cross-cutting decision.

## Files touched in this pass

- `/Users/erolakarsu/projects/coaching/src/lib/openrouter.ts` (added `generateCoachSummary`).
- `/Users/erolakarsu/projects/coaching/src/app/api/ai/coach-summary/route.ts` (new POST handler).
- `/Users/erolakarsu/projects/coaching/_AUDIT_NOTE.md` (this file).

Syntax: `npx tsc --noEmit` — pass (no new errors from edits).

## Apply pass 3 (frontend)

Minor nav addition — `/dashboard/coach-summary` page already existed and was wired to `POST /api/ai/coach-summary`, but was not exposed in the sidebar. Added a `Coach Summary` entry to `navItems` in `src/app/dashboard/layout.tsx` so the page is discoverable.

- File modified: `/Users/erolakarsu/projects/coaching/src/app/dashboard/layout.tsx` (one navItems entry).
- All other pre-existing AI dashboard pages (Goal Setter, Goals, Habits, Sessions, Decisions, Homework, Moods, Predictions) remain wired through their own App-Router page handlers.
- JWT pattern in this repo: page handlers read `userId` from `localStorage.getItem('user')` (per existing convention; auth-binding is backlog item #3).

## Apply pass 4 (mechanical backlog)

No mechanical items remain. The backlog is composed of:
- Streaming responses from `callOpenRouter` — PRODUCT-DECISION (changes the helper signature `Promise<string>` -> `ReadableStream` and every consumer).
- Rate limiting on AI endpoints — PRODUCT-DECISION (in-memory vs Redis depends on hosting).
- Auth-bind `coach-summary` (and other handlers) — PRODUCT-DECISION (cross-cutting auth rework; current pattern trusts `userId` from request body).

No code changes in this pass.
