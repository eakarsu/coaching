'use client';
import { FormEvent, useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function fillDemoCredentials() {
    setError('');
    const response = await fetch('/api/auth/demo-credentials');
    if (!response.ok) return setError('Demo credentials are unavailable.');
    const credentials = await response.json();
    setEmail(credentials.email);
    setPassword(credentials.password);
    const __login = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: credentials.email, password: credentials.password }) });
    if (!__login.ok) { setError('Invalid email or password'); return; }
    window.location.assign('/');
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) return setError('Sign in failed.');
    location.assign('/');
  }

  return <main className="min-h-screen bg-slate-950 grid place-items-center p-6"><section className="max-w-md bg-white rounded-3xl p-9 shadow-2xl"><p className="text-xs uppercase tracking-[.22em] text-indigo-600 font-bold">Governed coaching</p><h1 className="text-3xl font-bold mt-3">Turn coaching into measurable progress</h1><p className="text-slate-600 mt-3">Secure client–coach engagements, provider-backed sessions, acknowledged action plans, and evidence-based check-ins.</p><form className="mt-7 grid gap-3" onSubmit={signIn}><label>Email<input className="mt-1 w-full rounded-xl border p-3" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input className="mt-1 w-full rounded-xl border p-3" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button type="button" className="w-full rounded-xl border border-indigo-600 py-3 font-semibold text-indigo-700" onClick={fillDemoCredentials}>Auto Fill Demo Credentials</button><button className="w-full rounded-xl bg-indigo-600 text-white py-3 font-semibold" type="submit">Sign In</button></form><button className="mt-3 w-full rounded-xl border py-3 font-semibold" onClick={()=>location.assign('/api/v1/coaching/auth/sso')}>Continue with organization SSO</button><p className="text-xs text-slate-500 mt-4">Your tenant and client, coach, or operator role determine your workspace.</p></section></main>;
}
