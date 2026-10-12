'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';

type Credentials = { email: string; password: string };
type LoginAction = 'fill' | 'demo' | 'manual';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState<LoginAction | null>(null);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => { request.current?.abort(); }, []);

  async function configuredCredentials(signal: AbortSignal): Promise<Credentials> {
    const response = await fetch('/api/auth/demo-credentials', { credentials: 'same-origin', cache: 'no-store', signal });
    const credentials = await response.json().catch(() => null);
    if (!response.ok || !credentials || typeof credentials.email !== 'string' || !credentials.email.trim() || typeof credentials.password !== 'string' || !credentials.password) {
      throw new Error('Demo credentials are unavailable. Enter your own credentials or continue with organization SSO.');
    }
    return { email: credentials.email, password: credentials.password };
  }

  async function authenticate(action: LoginAction) {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(action);
    setError('');
    setMessage('');
    try {
      const credentials = action === 'manual' ? { email, password } : await configuredCredentials(controller.signal);
      if (controller.signal.aborted || request.current !== controller) return;
      if (action !== 'manual') {
        setEmail(credentials.email);
        setPassword(credentials.password);
      }
      if (action === 'fill') {
        setMessage('Configured credentials filled. Click Sign In when ready.');
        return;
      }
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(typeof body?.error === 'string' ? body.error : 'Sign in failed. Check your credentials or continue with organization SSO.');
      }
      if (!body?.user || typeof body.user.subject !== 'string' || typeof body.user.tenantId !== 'string') {
        throw new Error('Sign-in returned an invalid response. Try again or continue with organization SSO.');
      }
      if (!controller.signal.aborted && request.current === controller) window.location.assign('/');
    } catch (failure) {
      if (!controller.signal.aborted && request.current === controller) {
        setError(failure instanceof Error ? failure.message : 'Could not reach sign-in. Try again.');
      }
    } finally {
      if (!controller.signal.aborted && request.current === controller) {
        request.current = null;
        setPending(null);
      }
    }
  }

  function signIn(event: FormEvent) {
    event.preventDefault();
    void authenticate('manual');
  }

  return <main className="min-h-screen bg-slate-950 grid place-items-center p-6"><section className="max-w-md bg-white rounded-3xl p-9 shadow-2xl"><p className="text-xs uppercase tracking-[.22em] text-indigo-600 font-bold">Governed coaching</p><h1 className="text-3xl font-bold mt-3">Turn coaching into measurable progress</h1><p className="text-slate-600 mt-3">Secure client–coach engagements, provider-backed sessions, acknowledged action plans, and evidence-based check-ins.</p><form className="mt-7 grid gap-3" onSubmit={signIn} aria-busy={pending !== null}><label>Email<input className="mt-1 w-full rounded-xl border p-3" type="email" required autoComplete="username" disabled={pending !== null} value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input className="mt-1 w-full rounded-xl border p-3" type="password" required autoComplete="current-password" disabled={pending !== null} value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-indigo-700">{message}</p>}<button type="button" disabled={pending !== null} className="w-full rounded-xl border py-3 font-semibold disabled:opacity-60" onClick={() => void authenticate('fill')}>{pending === 'fill' ? 'Filling credentials…' : 'Fill credentials'}</button><button type="button" disabled={pending !== null} className="w-full rounded-xl border border-indigo-600 py-3 font-semibold text-indigo-700 disabled:opacity-60" onClick={() => void authenticate('demo')}>{pending === 'demo' ? 'Signing in as Demo…' : 'Log In as Demo'}</button><button disabled={pending !== null} className="w-full rounded-xl bg-indigo-600 text-white py-3 font-semibold disabled:opacity-60" type="submit">{pending === 'manual' ? 'Signing in…' : 'Sign In'}</button></form><button disabled={pending !== null} className="mt-3 w-full rounded-xl border py-3 font-semibold disabled:opacity-60" onClick={() => window.location.assign('/api/v1/coaching/auth/sso')}>Continue with organization SSO</button><p className="text-xs text-slate-500 mt-4">Your tenant and client, coach, or operator role determine your workspace.</p></section></main>;
}
