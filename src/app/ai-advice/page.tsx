import CoachingAIAdvice from '@/components/CoachingAIAdvice';
export default function AIAdvicePage() {
  return <main className="min-h-screen bg-slate-50 px-5 py-8"><div className="mx-auto max-w-5xl space-y-6"><nav aria-label="Coaching workspace" className="flex flex-wrap gap-4"><a href="/dashboard" className="font-medium text-indigo-700">Coaching dashboard</a><a href="/login" className="font-medium text-indigo-700">Sign in</a></nav><CoachingAIAdvice/></div></main>;
}
