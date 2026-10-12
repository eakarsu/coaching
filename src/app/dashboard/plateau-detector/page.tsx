'use client';

import { useState } from 'react';

export default function PlateauDetectorPage() {
  const [form, setForm] = useState({ goalProgressDelta: 3, missedHabits: 4, sessionsSinceBreakthrough: 5, moodTrend: -2 });
  const [result, setResult] = useState<{ level: string; score: number; actions: string[] } | null>(null);
  const examples = [
    { label: 'Early warning', values: { goalProgressDelta: 3, missedHabits: 4, sessionsSinceBreakthrough: 5, moodTrend: -2 } },
    { label: 'Steady progress', values: { goalProgressDelta: 18, missedHabits: 1, sessionsSinceBreakthrough: 1, moodTrend: 2 } },
    { label: 'Needs review', values: { goalProgressDelta: 0, missedHabits: 7, sessionsSinceBreakthrough: 8, moodTrend: -4 } },
  ];

  const submit = async () => {
    const response = await fetch('/api/ai/plateau-detector', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setResult(await response.json());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Coaching Plateau Detector</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex flex-wrap gap-2">{examples.map(example => <button key={example.label} type="button" onClick={() => setForm(example.values)} className="rounded border border-purple-400 px-3 py-2 text-sm text-purple-100">{example.label}</button>)}</div>
        {Object.entries(form).map(([key, value]) => (
          <label key={key} className="block text-sm text-gray-200">
            {key.replace(/([A-Z])/g, ' $1')}
            <input className="mt-1 w-full rounded bg-slate-900 p-2 text-white" type="number" value={value} onChange={(event) => setForm({ ...form, [key]: Number(event.target.value) })} />
          </label>
        ))}
        <button className="rounded bg-purple-600 px-4 py-2 text-white" onClick={submit}>Detect plateau</button>
      </div>
      {result && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-gray-100">
          <h2>{result.level.toUpperCase()} · {result.score}/100</h2>
          <ul className="list-disc pl-5">{result.actions.map((action: string) => <li key={action}>{action}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
