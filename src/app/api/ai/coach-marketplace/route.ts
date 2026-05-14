// Custom feature (batch_09): Coach marketplace with specialization filters.
import { NextResponse } from 'next/server';
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
    const { user_goals, preferences, coaches } = await req.json();
    if (!user_goals) return NextResponse.json({ success: false, error: 'user_goals required' }, { status: 400 });
    if (!Array.isArray(coaches)) return NextResponse.json({ success: false, error: 'coaches array required' }, { status: 400 });

    const messages: any[] = [
      { role: 'system', content: 'You rank coaches against a user\'s goals + preferences. JSON only.' },
      { role: 'user', content: `GOALS: ${JSON.stringify(user_goals)}\nPREFERENCES: ${JSON.stringify(preferences || {})}\nCOACHES: ${JSON.stringify(coaches.slice(0, 30))}\nReturn JSON {"ranked":[{"coach_id":"","name":"","fit_score":0,"specialization_match":[""],"intro_hook":""}],"top_pick_id":"","filters_applied":[""]}` },
    ];

    const content = await callOpenRouter(messages, 1800);
    return NextResponse.json({ success: true, type: 'coach-marketplace', result: parseJSON(content) || { raw: content } });
  } catch (e: any) {
    console.error('coach-marketplace error:', e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
