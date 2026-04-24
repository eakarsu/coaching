'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const features = [
  {
    id: 'goals',
    title: 'AI Goal Tracker',
    description: 'Set, track, and achieve your goals with AI-powered insights and progress monitoring',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    href: '/dashboard/goals'
  },
  {
    id: 'habits',
    title: 'AI Habit Tracker',
    description: 'Build and maintain positive habits with streak tracking and personalized suggestions',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    href: '/dashboard/habits'
  },
  {
    id: 'sessions',
    title: 'AI Session Summarizer',
    description: 'Log and analyze your work sessions with automatic summaries and action items',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-500/10',
    href: '/dashboard/sessions'
  },
  {
    id: 'decisions',
    title: 'AI Decision Helper',
    description: 'Make better decisions with structured analysis and AI-powered recommendations',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    ),
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-500/10',
    href: '/dashboard/decisions'
  },
  {
    id: 'homework',
    title: 'AI Homework Generator',
    description: 'Generate customized homework and practice questions for any subject',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-500/10',
    href: '/dashboard/homework'
  },
  {
    id: 'goal-setter',
    title: 'AI Goal Setter',
    description: 'Get intelligent goal suggestions based on your interests and current progress',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-yellow-500/10',
    href: '/dashboard/goal-setter'
  },
  {
    id: 'moods',
    title: 'AI Mood Tracker',
    description: 'Track your emotional wellbeing and get personalized insights and suggestions',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-500/10',
    href: '/dashboard/moods'
  },
  {
    id: 'predictions',
    title: 'AI Outcome Predictor',
    description: 'Predict outcomes and probabilities based on your scenarios and factors',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-500/10',
    href: '/dashboard/predictions'
  }
];

const sampleDataConfigs = [
  {
    id: 'goals',
    label: 'Goal',
    color: 'from-green-600 to-emerald-600',
    endpoint: '/api/goals',
    data: {
      title: 'Learn TypeScript Advanced Patterns',
      description: 'Master advanced TypeScript patterns including generics, conditional types, mapped types, and template literal types to write more type-safe code.',
      category: 'Education',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      milestones: ['Complete generics chapter', 'Build a type-safe API client', 'Contribute to a typed OSS project']
    }
  },
  {
    id: 'habits',
    label: 'Habit',
    color: 'from-blue-600 to-cyan-600',
    endpoint: '/api/habits',
    data: {
      name: 'Morning Meditation',
      description: 'Practice 15 minutes of mindful meditation every morning before starting work to improve focus and reduce stress.',
      frequency: 'daily',
      category: 'Wellness',
      reminder: '7:00 AM'
    }
  },
  {
    id: 'sessions',
    label: 'Session',
    color: 'from-purple-600 to-violet-600',
    endpoint: '/api/sessions',
    data: {
      title: 'Deep Work: API Refactoring',
      duration: 90,
      notes: 'Spent 90 minutes refactoring the REST API layer to use a cleaner repository pattern. Removed duplicated database queries and added proper error handling. Also wrote integration tests for the main endpoints.',
      category: 'Work',
      mood: 'Focused',
      productivity: 8,
      keyTakeaways: ['Repository pattern simplifies testing', 'Error boundaries catch unexpected failures'],
      actionItems: ['Review remaining endpoints', 'Add rate limiting']
    }
  },
  {
    id: 'decisions',
    label: 'Decision',
    color: 'from-orange-600 to-amber-600',
    endpoint: '/api/decisions',
    data: {
      title: 'Should I switch to a microservices architecture?',
      description: 'Our monolithic app is growing and we are experiencing deployment bottlenecks. Considering breaking it into microservices for better scalability and team independence.',
      category: 'Career',
      options: ['Stay with monolith and optimize', 'Gradual migration to microservices', 'Full rewrite as microservices'],
      pros: ['Independent deployments', 'Team autonomy', 'Better scalability per service'],
      cons: ['Added complexity', 'Network latency', 'Harder debugging'],
      urgency: 'medium',
      importance: 'high'
    }
  },
  {
    id: 'moods',
    label: 'Mood',
    color: 'from-red-500 to-pink-600',
    endpoint: '/api/moods',
    data: {
      rating: 7,
      emotion: 'Content',
      notes: 'Had a productive day at work, finished a major feature. Feeling good about progress but slightly tired from the long focus session.',
      factors: ['Work', 'Exercise', 'Sleep'],
      activities: ['Working', 'Exercising', 'Reading'],
      energy: 6,
      stress: 4,
      sleep: 7
    }
  },
  {
    id: 'predictions',
    label: 'Prediction',
    color: 'from-indigo-600 to-blue-600',
    endpoint: '/api/predictions',
    data: {
      title: 'Will our product launch meet the Q2 deadline?',
      description: 'We have a major product launch planned for end of Q2. The team has been working on it for 3 months and we are about 70% complete.',
      category: 'Business',
      scenario: 'The remaining 30% includes payment integration, user onboarding flow, and performance optimization. We have 6 weeks left and 4 developers available full-time.',
      factors: ['Team velocity has been consistent', 'Payment API has known complexity', 'QA testing needs 2 weeks', 'No major blockers currently'],
      timeframe: '6 weeks'
    }
  },
  {
    id: 'homework',
    label: 'Homework',
    color: 'from-pink-600 to-rose-600',
    endpoint: '/api/homework',
    data: {
      subject: 'Mathematics',
      topic: 'Quadratic Equations',
      gradeLevel: 'High School',
      difficulty: 'medium',
      numberOfQuestions: 5
    }
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loadSampleData = async (config: typeof sampleDataConfigs[0]) => {
    if (!user) {
      alert('Please log in first to load sample data.');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [config.id]: true }));
    setSuccessStates(prev => ({ ...prev, [config.id]: false }));

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config.data, userId: user.id })
      });

      const data = await response.json();
      if (data.success) {
        setSuccessStates(prev => ({ ...prev, [config.id]: true }));
        setTimeout(() => setSuccessStates(prev => ({ ...prev, [config.id]: false })), 3000);
      }
    } catch (error) {
      console.error(`Failed to load sample ${config.id}:`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [config.id]: false }));
    }
  };

  const loadAllSampleData = async () => {
    if (!user) {
      alert('Please log in first to load sample data.');
      return;
    }

    for (const config of sampleDataConfigs) {
      await loadSampleData(config);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to AI Productivity Suite</h1>
        <p className="text-gray-400">Select a tool to get started with your AI-powered productivity journey</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => router.push(feature.href)}
            className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
          >
            <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
              <div className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                {feature.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              {feature.description}
            </p>
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Quick Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <p className="text-3xl font-bold text-white">8</p>
            <p className="text-sm text-gray-400">AI Tools</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <p className="text-3xl font-bold text-green-400">Active</p>
            <p className="text-sm text-gray-400">Status</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <p className="text-3xl font-bold text-purple-400">AI</p>
            <p className="text-sm text-gray-400">Powered</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <p className="text-3xl font-bold text-blue-400">24/7</p>
            <p className="text-sm text-gray-400">Available</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => router.push('/dashboard/goals')}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Create New Goal</p>
              <p className="text-sm text-gray-400">Start tracking a new goal</p>
            </div>
          </div>
          <div
            onClick={() => router.push('/dashboard/moods')}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Log Today's Mood</p>
              <p className="text-sm text-gray-400">How are you feeling?</p>
            </div>
          </div>
          <div
            onClick={() => router.push('/dashboard/sessions')}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Log Work Session</p>
              <p className="text-sm text-gray-400">Track your productivity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Load Sample Data Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Load Sample Data</h3>
            <p className="text-sm text-gray-400 mt-1">Click buttons to load test data for each AI feature</p>
          </div>
          <button
            onClick={loadAllSampleData}
            disabled={Object.values(loadingStates).some(Boolean)}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 text-sm"
          >
            {Object.values(loadingStates).some(Boolean) ? 'Loading...' : 'Load All Sample Data'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {sampleDataConfigs.map((config) => (
            <button
              key={config.id}
              onClick={() => loadSampleData(config)}
              disabled={loadingStates[config.id]}
              className={`relative p-4 rounded-xl border transition-all text-center disabled:opacity-50 ${
                successStates[config.id]
                  ? 'bg-green-500/20 border-green-500/40'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {loadingStates[config.id] ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                  <span className="text-xs text-gray-400">Loading...</span>
                </div>
              ) : successStates[config.id] ? (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-green-400">Done!</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">{config.label}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
