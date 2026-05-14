// Custom feature (batch_09): AI accountability nudges based on habit data.
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
    const { userId, lookbackDays = 7 } = await req.json();
    if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });

    const since = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
    const habits = await prisma.habit.findMany({
      where: { userId, status: 'active' },
      orderBy: { streak: 'desc' },
      take: 20,
    });
    const moods = await prisma.mood.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const messages: any[] = [
      { role: 'system', content: 'You produce kind, motivating accountability nudges based on a user\'s recent habit + mood data. JSON only.' },
      { role: 'user', content: `HABITS: ${JSON.stringify(habits)}\nRECENT_MOODS: ${JSON.stringify(moods)}\nReturn JSON {"nudges":[{"habit_id":"","channel":"push|sms|email","tone":"warm|firm|playful","when":"morning|midday|evening","message":""}],"focus_habit":""}` },
    ];

    const content = await callOpenRouter(messages);
    return NextResponse.json({ success: true, type: 'accountability-nudges', result: parseJSON(content) || { raw: content } });
  } catch (e: any) {
    console.error('accountability-nudges error:', e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
