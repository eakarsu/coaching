// Custom feature (batch_09): Voice-journaling with auto-transcript and summary.
// Accepts a transcript (assumed pre-transcribed by client or STT service).
// TODO: configure credentials for VOICE_STT_API_KEY (Whisper / Deepgram) if doing server-side STT.
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
    const { userId, transcript, sessionId } = await req.json();
    if (!userId || !transcript) {
      return NextResponse.json({ success: false, error: 'userId and transcript required' }, { status: 400 });
    }

    const messages: any[] = [
      { role: 'system', content: 'You summarize a voice-journal transcript into themes, emotional tone, and a one-paragraph reflection. JSON only.' },
      { role: 'user', content: `TRANSCRIPT (verbatim):\n${transcript.slice(0, 6000)}\nReturn JSON {"summary":"","key_themes":[""],"emotional_tone":"","action_items":[""],"reflection_prompt":""}` },
    ];

    const content = await callOpenRouter(messages, 2000);
    const parsed = parseJSON(content) || { raw: content };

    // Persist to a session note record if sessionId supplied. Best-effort.
    if (sessionId) {
      try {
        await (prisma as any).session?.update({
          where: { id: sessionId },
          data: { notes: typeof parsed === 'object' ? JSON.stringify(parsed) : String(parsed) },
        }).catch(() => {});
      } catch {}
    }

    return NextResponse.json({
      success: true,
      type: 'voice-journal',
      stt_provider_configured: Boolean(process.env.VOICE_STT_API_KEY),
      result: parsed,
    });
  } catch (e: any) {
    console.error('voice-journal error:', e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
