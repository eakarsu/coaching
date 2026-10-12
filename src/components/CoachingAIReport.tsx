'use client';
import { useState, type ReactNode } from 'react';

const label = (key: string) => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/^./, letter => letter.toUpperCase());
function parsed(value: string): unknown {
  const trimmed = value.trim().replace(/^```(?:json)?[ \t]*\r?\n([\s\S]*?)\r?\n```$/, '$1');
  if (/^[\[{]/.test(trimmed)) { try { return JSON.parse(trimmed); } catch { /* Preserve ordinary prose. */ } }
  return value;
}
export function adviceText(value: unknown, depth = 0): string {
  if (depth > 16) return 'Additional nested detail';
  if (value === null || value === undefined) return 'Not provided';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string') {
    const whole = parsed(value); if (typeof whole !== 'string') return adviceText(whole, depth + 1);
    return value.replace(/(^|\r?\n)[ \t]*```(?:json)?[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```[ \t]*(?=\r?\n|$)/gi, (fence, prefix, body) => {
      try { return prefix + adviceText(JSON.parse(body.trim()), depth + 1); } catch { return fence; }
    }).replace(/^#{1,6}\s+/gm, '').replace(/\*\*([^*]+)\*\*/g, '$1');
  }
  if (Array.isArray(value)) return value.length ? value.map(item => '• ' + adviceText(item, depth + 1)).join('\n') : 'None reported';
  if (typeof value === 'object') return Object.entries(value).map(([key, item]) => `${label(key)}\n${adviceText(item, depth + 1)}`).join('\n\n');
  return String(value);
}
function content(value: unknown, depth = 0): ReactNode {
  if (depth > 16) return <p>{adviceText(value)}</p>;
  if (typeof value === 'string') {
    if (value === '') return <p className="text-slate-500">Empty string</p>;
    const whole = parsed(value); if (typeof whole !== 'string') return content(whole, depth + 1);
    return <div className="space-y-3">{adviceText(value).split(/\r?\n\r?\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="whitespace-pre-wrap leading-7">{paragraph}</p>)}</div>;
  }
  if (Array.isArray(value)) {
    if (value.length && value.every(item => item !== null && typeof item === 'object' && !Array.isArray(item))) {
      const columns = Array.from(new Set(value.flatMap(item => Object.keys(item as Record<string, unknown>))));
      if (columns.length <= 8) return <div className="overflow-x-auto rounded-lg border"><table className="w-full border-collapse text-left text-sm"><thead className="bg-slate-50"><tr>{columns.map(key => <th key={key} className="p-3">{label(key)}</th>)}</tr></thead><tbody>{value.map((item, index) => <tr key={index} className="border-t">{columns.map(key => <td key={key} className="p-3 align-top">{content((item as Record<string, unknown>)[key], depth + 1)}</td>)}</tr>)}</tbody></table></div>;
    }
    return value.length ? <ul className="list-disc space-y-3 pl-5">{value.map((item, index) => <li key={index}>{content(item, depth + 1)}</li>)}</ul> : <p>None reported</p>;
  }
  if (value && typeof value === 'object') return <div className="space-y-5">{Object.entries(value).map(([key, item]) => <section key={key}><h3 className="mb-2 font-semibold text-slate-900">{label(key)}</h3>{content(item, depth + 1)}</section>)}</div>;
  return <p>{value === '' ? 'Empty string' : adviceText(value)}</p>;
}
export default function CoachingAIReport({ value }: { value: string }) {
  const [notice, setNotice] = useState('');
  async function copy() { try { await navigator.clipboard.writeText(adviceText(value)); setNotice('Report copied.'); } catch { setNotice('Copy is unavailable. Download the report instead.'); } }
  function download() { const url = URL.createObjectURL(new Blob([adviceText(value)], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'coaching-advice.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  return <article aria-label="Coaching AI report" className="rounded-xl border border-slate-200 bg-white p-5 text-slate-700"><div className="space-y-5">{content(value)}</div><footer className="mt-5 border-t pt-4"><div className="flex flex-wrap gap-2"><button type="button" className="rounded-lg border px-3 py-2" onClick={copy}>Copy report</button><button type="button" className="rounded-lg border px-3 py-2" onClick={download}>Download report</button></div>{notice && <p role="status" className="mt-2 text-sm">{notice}</p>}</footer></article>;
}
