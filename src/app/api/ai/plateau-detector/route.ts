import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const goalProgressDelta = Number(body.goalProgressDelta ?? 0);
  const missedHabits = Number(body.missedHabits ?? 0);
  const sessionsSinceBreakthrough = Number(body.sessionsSinceBreakthrough ?? 0);
  const moodTrend = Number(body.moodTrend ?? 0);

  const score = Math.min(100, Math.round(
    Math.max(0, 10 - goalProgressDelta) * 4 +
    missedHabits * 8 +
    sessionsSinceBreakthrough * 5 +
    Math.max(0, -moodTrend) * 6
  ));

  return NextResponse.json({
    feature: 'coaching_plateau_detector',
    score,
    level: score >= 70 ? 'reset-plan' : score >= 40 ? 'watch' : 'progressing',
    actions: [
      score >= 70 && 'Reset the coaching plan with one smaller near-term goal.',
      missedHabits > 2 && 'Replace missed habits with lower-friction commitments.',
      sessionsSinceBreakthrough > 4 && 'Run a values and blocker review in the next session.',
      moodTrend < 0 && 'Add mood stabilization work before new performance goals.',
    ].filter(Boolean),
  });
}
