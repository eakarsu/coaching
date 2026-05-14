'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Digest {
  summary: string;
  highlights: string[];
  suggestions: string[];
}

interface CoachSummaryResponse {
  success: boolean;
  timeframeDays: number;
  counts: {
    moods: number;
    goals: number;
    habits: number;
  };
  digest: Digest;
}

export default function CoachSummaryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [timeframeDays, setTimeframeDays] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoachSummaryResponse | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const generateSummary = async () => {
    if (!user) {
      setError('You must be signed in to generate a summary.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/coach-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          timeframeDays
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to generate coach summary');
      }
    } catch (err) {
      console.error('Failed to generate coach summary:', err);
      setError('Failed to generate coach summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Coach Summary</h1>
        <p className="text-gray-400">Get a weekly digest of your moods, goals, and habits</p>
      </div>

      {/* Input Form */}
      <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Choose your timeframe</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Timeframe</label>
            <select
              value={timeframeDays}
              onChange={(e) => setTimeframeDays(Number(e.target.value))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <button
            onClick={generateSummary}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Summary...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Coach Summary
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-8">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <>
          {/* Counts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-4">
              <p className="text-gray-400 text-sm">Moods analyzed</p>
              <p className="text-2xl font-bold text-white">{result.counts.moods}</p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-4">
              <p className="text-gray-400 text-sm">Active goals</p>
              <p className="text-2xl font-bold text-white">{result.counts.goals}</p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-4">
              <p className="text-gray-400 text-sm">Active habits</p>
              <p className="text-2xl font-bold text-white">{result.counts.habits}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Your {result.timeframeDays}-day digest
            </h2>
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
              <p className="text-white whitespace-pre-line">{result.digest.summary}</p>
            </div>
          </div>

          {/* Highlights */}
          {result.digest.highlights && result.digest.highlights.length > 0 && (
            <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Highlights</h2>
              <div className="space-y-3">
                {result.digest.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-500/20 text-green-400 rounded-full font-medium">
                      {index + 1}
                    </span>
                    <p className="text-white">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {result.digest.suggestions && result.digest.suggestions.length > 0 && (
            <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Suggested Next Steps</h2>
              <div className="space-y-4">
                {result.digest.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-yellow-500/20 text-yellow-400 rounded-full font-medium">
                        {index + 1}
                      </span>
                      <p className="text-white">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
