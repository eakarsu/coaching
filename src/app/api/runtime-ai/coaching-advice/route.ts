import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const localAuth = require('@/governance/local-auth.cjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: Request) {
  const user = await localAuth.session(localAuth.requestToken(request));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { prompt } = await request.json().catch(() => ({ prompt: '' })) as { prompt?: string };
  const input = String(prompt || '').trim();
  if (!input) return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  const apiKey = process.env.OPENROUTER_API_KEY, baseUrl = process.env.OPENROUTER_BASE_URL, model = process.env.OPENROUTER_MODEL;
  if (!apiKey || !baseUrl || !model) throw new Error('OpenRouter is not configured');
  const providerResponse = await fetch(baseUrl.replace(/\/$/, '') + '/chat/completions', {
    method: 'POST', headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: 'Provide concise coaching operations guidance with risks and auditable next actions.' }, { role: 'user', content: input }], temperature: 0.2 }),
  });
  if (!providerResponse.ok) throw new Error('OpenRouter returned ' + providerResponse.status);
  const payload = await providerResponse.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('OpenRouter returned empty content');
  const persistedId = crypto.randomUUID();
  await pool.query(`INSERT INTO coaching_runtime_ai_results(id,tenant_id,subject,prompt,content,provider,model) VALUES($1,$2,$3,$4,$5,'openrouter',$6)`, [persistedId, user.tenantId, user.subject, input, content, model]);
  return NextResponse.json({ content, provider: 'openrouter', model, persistedId });
}
