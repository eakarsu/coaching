'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import CoachingAIReport from './CoachingAIReport';

type Report = { id: string; prompt: string; content: string; provider: string; model: string; createdAt: string };
const endpoint = '/api/runtime-ai/coaching-advice';
const examples = [
  { label: 'Demo AI · Progress review', prompt: 'Prepare a coaching progress-review checklist. Ask the authorized client and coach to provide the actual engagement, agreed goal, recent check-in evidence, and any acknowledged actions. Separate documented progress from unknowns, identify questions to verify, and suggest the next human review steps. No actual client records or measurements have been supplied; do not invent them, certify an outcome, or change any record.' },
  { label: 'Demo AI · Session preparation', prompt: 'Prepare a coaching session-preparation guide. List the actual agenda, prior acknowledged action plan, current client priorities, source evidence, and scheduling constraints that the authorized participants should review. Explain missing information and propose discussion questions. No actual session, consent, calendar availability, or payment information has been supplied; do not create a booking, claim consent, or invent client facts.' },
  { label: 'Demo AI · Operations handover', prompt: 'Prepare a coaching operations-handover checklist for an authorized operator. Cover engagement status, provider failure and retry evidence, scheduling conflicts, pending acknowledgements, and owner assignment as information to verify in native records. Identify evidence gaps and an ordered human follow-up plan. No actual organization records have been supplied; do not invent incidents, execute retries, approve refunds, or report successful actions.' },
];
async function body(response: Response) {
  if (response.redirected || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Sign in again to access coaching AI advice.');
  const data = await response.json(); if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`); return data;
}
export default function CoachingAIAdvice() {
  const [prompt, setPrompt] = useState(''), [reports, setReports] = useState<Report[]>([]), [result, setResult] = useState<Report | null>(null), [opened, setOpened] = useState<Report | null>(null), [busy, setBusy] = useState(false), [notice, setNotice] = useState(''), [error, setError] = useState(''), [historyError, setHistoryError] = useState('');
  const request = useRef<AbortController | null>(null), historyRequest = useRef<AbortController | null>(null), dialog = useRef<HTMLDialogElement | null>(null);
  async function history() {
    historyRequest.current?.abort(); const controller = new AbortController(); historyRequest.current = controller;
    try { const data = await body(await fetch(endpoint, { credentials: 'same-origin', signal: controller.signal })); if (!Array.isArray(data.reports)) throw new Error('The saved-report response is invalid.'); if (!controller.signal.aborted && historyRequest.current === controller) { setReports(data.reports); setHistoryError(''); } }
    catch (failure) { if (!controller.signal.aborted && historyRequest.current === controller) setHistoryError(failure instanceof Error ? failure.message : 'Saved reports could not be loaded.'); }
  }
  useEffect(() => { void history(); return () => { request.current?.abort(); historyRequest.current?.abort(); }; }, []);
  useEffect(() => { if (opened && !dialog.current?.open) dialog.current?.showModal(); if (!opened && dialog.current?.open) dialog.current.close(); }, [opened]);
  function cancel() { request.current?.abort(); request.current = null; setBusy(false); setNotice('Request cancelled. Your input is preserved.'); }
  async function generate(event: FormEvent) {
    event.preventDefault(); if (request.current) return;
    const input = prompt.trim(); if (!input || input.length > 4000) { setError('Enter a prompt of 1–4000 characters.'); return; }
    const controller = new AbortController(); request.current = controller; setBusy(true); setError(''); setNotice('Generating advice…'); setResult(null);
    try {
      const data = await body(await fetch(endpoint, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: input }), signal: controller.signal }));
      if (controller.signal.aborted || request.current !== controller) return;
      if (typeof data.id !== 'string' || typeof data.content !== 'string' || !data.content.trim()) throw new Error('The provider did not return a saved report.');
      setResult(data); setNotice('Advice received and saved. Review it before acting.'); await history();
    } catch (failure) { if (!controller.signal.aborted && request.current === controller) { setError(failure instanceof Error ? failure.message : 'AI advice could not be generated.'); setNotice(''); } }
    finally { if (request.current === controller) { request.current = null; setBusy(false); } }
  }
  return <section aria-label="Coaching AI advice" className="space-y-6">
    <header><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">AI advice</p><h1 className="mt-2 text-3xl font-bold">Coaching review workspace</h1><p className="mt-3 text-slate-600">Generate advisory checklists with your existing local coaching session. Supply only facts you are authorized to share. Organization SSO and coaching operations keep their separate native authorization.</p></header>
    <form aria-label="Prepare coaching AI request" onSubmit={generate} className="space-y-4 rounded-2xl border bg-white p-6">
      <div className="flex flex-wrap gap-2">{examples.map(example => <button type="button" key={example.label} disabled={busy} className="rounded-lg border border-indigo-300 px-3 py-2 font-medium text-indigo-700" onClick={() => { setPrompt(example.prompt); setError(''); setNotice('Complete request filled. Review it, then generate.'); }}>{example.label}</button>)}</div>
      <p className="text-sm text-slate-500">Each Demo AI button fills the entire native request. Unknown client facts, approvals and source records remain explicitly unverified.</p>
      <label className="block font-medium">Review brief<textarea data-ai-field="prompt" required maxLength={4000} rows={7} disabled={busy} className="mt-2 w-full rounded-lg border p-3 font-normal" value={prompt} onChange={event => setPrompt(event.target.value)} /></label>
      <div className="flex flex-wrap gap-2"><button type="submit" disabled={busy || !prompt.trim()} className="rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white">{busy ? 'Generating…' : 'Generate with OpenRouter'}</button>{busy && <button type="button" className="rounded-lg border px-4 py-3" onClick={cancel}>Cancel</button>}</div>
    </form>
    {notice && <p role="status" aria-live="polite">{notice}</p>}{error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
    {result && <div className="space-y-3"><h2 className="text-xl font-semibold">Your advisory report</h2><p className="text-sm text-slate-500">Model: {result.model} · Saved ID: {result.id}</p><CoachingAIReport value={result.content}/></div>}
    <section className="space-y-3 rounded-2xl border bg-white p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Your saved advice</h2><button type="button" disabled={busy} className="rounded-lg border px-3 py-2" onClick={() => void history()}>Refresh saved advice</button></div><p className="text-sm text-slate-500">Only your own tenant-scoped native provider reports appear. Select a saved row to review or prepare a revised request.</p>{historyError ? <p role="alert" className="text-red-700">{historyError} <a href="/login" className="underline">Sign in</a></p> : reports.length ? <ul className="divide-y">{reports.map(row => <li key={row.id}><button type="button" disabled={busy} className="w-full space-y-1 py-3 text-left" onClick={() => setOpened(row)}><span className="block font-medium">{row.prompt}</span><span className="text-sm text-slate-500">{new Date(row.createdAt).toLocaleString()} · {row.model}</span></button></li>)}</ul> : <p className="text-slate-500">No saved advice yet.</p>}</section>
    <dialog ref={dialog} aria-labelledby="coaching-advice-detail" className="m-auto max-h-[85vh] w-[min(48rem,95vw)] overflow-auto rounded-2xl border p-6 shadow-2xl backdrop:bg-slate-950/40" onCancel={event => { event.preventDefault(); setOpened(null); }} onClose={() => setOpened(null)}>{opened && <div className="space-y-4"><h2 id="coaching-advice-detail" className="text-2xl font-bold">Saved coaching advice</h2><p className="whitespace-pre-wrap">{opened.prompt}</p><p className="text-sm text-slate-500">{opened.model} · {opened.id}</p><CoachingAIReport value={opened.content}/><div className="flex flex-wrap gap-2"><button type="button" className="rounded-lg border px-4 py-2" onClick={() => { setPrompt(opened.prompt); setOpened(null); setNotice('Original input loaded. Edit it and generate a new request.'); }}>Edit</button><button type="button" disabled className="rounded-lg border px-4 py-2 opacity-50" title="The native provider receipt is retained; no deletion contract is available">Delete</button><button type="button" className="rounded-lg border px-4 py-2" onClick={() => setOpened(null)}>Cancel</button></div><p className="text-sm text-slate-500">Edit prepares a new request. The original provider report stays retained.</p></div>}</dialog>
  </section>;
}
