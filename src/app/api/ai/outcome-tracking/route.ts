// Custom feature (batch_09): Outcome-tracking with longitudinal dashboards.
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { callOpenRouter } from '@/lib/openrouter';

function parseJSON(t: string) {
  if (!t) return null;
  const c = t.replace(/```(?:json)?/gi, '').replace(/```/g, '');
  const m = c.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch { return null; }
}

export async function POST(req: Request) {
  try {
    const { userId, windowMonths = 6 } = await req.json();
    if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });

    const since = new Date(Date.now() - windowMonths * 30 * 24 * 60 * 60 * 1000);
    const [goals, habits, predictions] = await Promise.all([
      prisma.goal.findMany({
        where: { userId, createdAt: { gte: since } },
        select: { id: true, title: true, status: true, createdAt: true, updatedAt: true },
        take: 50,
      }),
      prisma.habit.findMany({
        where: { userId },
        select: { id: true, name: true, streak: true, status: true, createdAt: true },
        take: 50,
      }),
      (prisma as any).prediction?.findMany?.({
        where: { userId, createdAt: { gte: since } },
        take: 30,
      }).catch(() => []) || [],
    ]);

    const messages: any[] = [
      { role: 'system', content: 'You summarize a coachee\'s outcomes longitudinally: completion rates, habit streaks, prediction accuracy. JSON only.' },
      { role: 'user', content: `WINDOW_MONTHS: ${windowMonths}\nGOALS: ${JSON.stringify(goals)}\nHABITS: ${JSON.stringify(habits)}\nPREDICTIONS: ${JSON.stringify(predictions)}\nReturn JSON {"goal_completion_rate":0,"longest_streak":0,"prediction_accuracy_pct":0,"trend":"up|flat|down","milestones_hit":[""],"areas_to_improve":[""]}` },
    ];

    const content = await callOpenRouter(messages, 1800);
    return NextResponse.json({ success: true, type: 'outcome-tracking', samples: { goals: goals.length, habits: habits.length }, result: parseJSON(content) || { raw: content } });
  } catch (e: any) {
    console.error('outcome-tracking error:', e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
