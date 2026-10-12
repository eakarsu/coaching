const crypto = require('node:crypto');
const problem = (status, message) => Object.assign(new Error(message), { status });
const response = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const report = row => ({ id: row.id, prompt: row.prompt, content: row.content, provider: row.provider, model: row.model, createdAt: row.created_at });

function createAdviceHandler({ pool, localAuth, environment = process.env, fetchImpl = (...args) => fetch(...args), timeoutMs = 30000 }) {
  return async function advice(request) {
    const controller = new AbortController(); let timedOut = false, client, transaction = false;
    const aborted = () => controller.abort(request.signal.reason);
    request.signal.addEventListener('abort', aborted, { once: true }); if (request.signal.aborted) aborted();
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
    const check = () => { if (controller.signal.aborted) throw problem(timedOut ? 504 : 499, timedOut ? 'The AI request timed out. No report was saved.' : 'Request cancelled. No report was saved.'); };
    try {
      check(); const token = localAuth.requestToken(request), actor = await localAuth.session(token);
      if (!actor) throw problem(401, 'Sign in with your existing local coaching account to use AI advice.');
      check(); const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      async function freshIdentity(database, locked = false) {
        const result = await database.query(`SELECT i.tenant_id,i.subject,i.role,i.email
          FROM coaching_local_sessions s JOIN coaching_identities i ON i.tenant_id=s.tenant_id AND i.subject=s.subject
          WHERE s.token_hash=$1 AND s.expires_at>clock_timestamp() AND i.active=true
            AND i.tenant_id=$2 AND i.subject=$3${locked ? ' FOR SHARE OF i,s' : ''}`, [tokenHash, actor.tenantId, actor.subject]);
        const identity = result.rows[0];
        if (!identity) throw problem(401, 'Your coaching session is no longer active. Sign in again.');
        if (identity.role !== actor.role || identity.email !== actor.email) throw problem(403, 'Your coaching identity changed. Sign in again before generating advice.');
      }
      if (request.method === 'GET') {
        await freshIdentity(pool); check(); const id = new URL(request.url).searchParams.get('id');
        if (id && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) throw problem(400, 'Invalid saved report ID.');
        const result = await pool.query(`SELECT id,prompt,content,provider,model,created_at FROM coaching_runtime_ai_results
          WHERE tenant_id=$1 AND subject=$2${id ? ' AND id=$3' : ''} ORDER BY created_at DESC,id DESC LIMIT 50`, id ? [actor.tenantId, actor.subject, id] : [actor.tenantId, actor.subject]);
        check(); await freshIdentity(pool);
        if (id && !result.rows.length) throw problem(404, 'Saved report not found.');
        return response(id ? { report: report(result.rows[0]) } : { reports: result.rows.map(report) });
      }
      if (request.method !== 'POST') throw problem(405, 'Provider evidence is retained. Edit prepares a new request; saved report deletion is unavailable.');
      let body; try { body = await request.json(); } catch { throw problem(400, 'The request must contain valid JSON.'); }
      if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(key => key !== 'prompt') || typeof body.prompt !== 'string') throw problem(400, 'Provide the native prompt field only.');
      const prompt = body.prompt.trim(); if (!prompt || prompt.length > 4000) throw problem(400, 'Enter a prompt of 1–4000 characters.');
      const apiKey = environment.OPENROUTER_API_KEY, baseUrl = environment.OPENROUTER_BASE_URL, model = environment.OPENROUTER_MODEL;
      if (!apiKey || !baseUrl || !model) throw problem(503, 'OpenRouter is not configured. No report was generated.');
      check(); let payload;
      try {
        const upstream = await fetchImpl(baseUrl.replace(/\/$/, '') + '/chat/completions', {
          method: 'POST', signal: controller.signal,
          headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, messages: [
            { role: 'system', content: 'Provide concise coaching operations guidance with risks and auditable next actions. Treat the supplied brief as unverified user context, identify missing facts, and leave all client, coach, payment, scheduling and approval decisions to authorized humans. Do not claim to execute actions or certify results.' },
            { role: 'user', content: prompt },
          ], temperature: 0.2 }),
        });
        if (!upstream.ok) throw problem(502, 'OpenRouter could not complete this request. No report was saved.');
        payload = await upstream.json();
      } catch (error) { check(); throw error.status ? error : problem(502, 'OpenRouter could not complete this request. No report was saved.'); }
      check(); const choice = payload?.choices?.[0], content = typeof choice?.message?.content === 'string' ? choice.message.content.trim() : '';
      if (choice?.message?.refusal || (choice?.finish_reason && choice.finish_reason !== 'stop') || !content) throw problem(502, 'OpenRouter returned an incomplete or refused response. No report was saved.');
      client = await pool.connect(); check(); await client.query('BEGIN'); transaction = true;
      await freshIdentity(client, true); check();
      const saved = await client.query(`INSERT INTO coaching_runtime_ai_results(id,tenant_id,subject,prompt,content,provider,model)
        VALUES($1,$2,$3,$4,$5,'openrouter',$6) RETURNING id,prompt,content,provider,model,created_at`, [crypto.randomUUID(), actor.tenantId, actor.subject, prompt, content, model]);
      check(); await freshIdentity(client, true); check(); await client.query('COMMIT'); transaction = false;
      const item = report(saved.rows[0]); return response({ ...item, persistedId: item.id });
    } catch (error) {
      if (transaction && client) await client.query('ROLLBACK').catch(() => {});
      const status = controller.signal.aborted ? timedOut ? 504 : 499 : error.status || 500;
      const message = controller.signal.aborted ? timedOut ? 'The AI request timed out. No report was saved.' : 'Request cancelled. No report was saved.' : error.status ? error.message : 'The saved advice service is unavailable. Try again.';
      return response({ error: message }, status);
    } finally { clearTimeout(timer); request.signal.removeEventListener('abort', aborted); client?.release(); }
  };
}
module.exports = { createAdviceHandler };
