'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
}

export default function GoalSetterPage() {
  const [user, setUser] = useState<User | null>(null);
  const [existingGoals, setExistingGoals] = useState<Goal[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Career',
    interests: '',
    timeframe: '3 months'
  });
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fillSampleData = () => {
    setFormData({
      category: 'Education',
      interests: 'programming, TypeScript, open source',
      timeframe: '3 months'
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchExistingGoals(userData.id);
    }
  }, []);

  const fetchExistingGoals = async (userId: string) => {
    try {
      const response = await fetch(`/api/goals?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setExistingGoals(data.goals);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  const generateSuggestions = async () => {
    if (!formData.interests.trim()) {
      alert('Please enter your interests');
      return;
    }

    setLoading(true);
    setSuggestions([]);

    try {
      // Use OpenRouter to generate suggestions
      const response = await fetch('/api/goals/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formData.category,
          interests: formData.interests.split(',').map(i => i.trim()),
          currentGoals: existingGoals.map(g => g.title),
          timeframe: formData.timeframe
        })
      });

      const data = await response.json();
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        // Fallback suggestions based on category
        const fallbackSuggestions = getFallbackSuggestions(formData.category, formData.interests);
        setSuggestions(fallbackSuggestions);
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      const fallbackSuggestions = getFallbackSuggestions(formData.category, formData.interests);
      setSuggestions(fallbackSuggestions);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackSuggestions = (category: string, interests: string) => {
    const interestList = interests.toLowerCase();
    const suggestions: Record<string, string[]> = {
      Career: [
        `Achieve a promotion within ${formData.timeframe} by demonstrating leadership in your ${interests} projects`,
        `Complete a professional certification related to ${interests} to boost your expertise`,
        `Expand your professional network by attending 2 industry events per month focused on ${interests}`
      ],
      Health: [
        `Establish a consistent ${interests}-related exercise routine, working out at least 4 times per week`,
        `Improve your nutrition by meal prepping healthy meals and incorporating ${interests} activities`,
        `Achieve a specific fitness milestone related to ${interests} within ${formData.timeframe}`
      ],
      Finance: [
        `Save a specific amount for ${interests}-related goals within ${formData.timeframe}`,
        `Create and stick to a budget that allocates funds for ${interests} while building emergency savings`,
        `Research and start investing in ${interests}-related opportunities or index funds`
      ],
      Education: [
        `Complete an online course or certification in ${interests} within ${formData.timeframe}`,
        `Read 2 books per month related to ${interests} and take notes for retention`,
        `Build a portfolio project demonstrating your ${interests} skills`
      ],
      Personal: [
        `Develop a daily routine that incorporates ${interests} for personal growth`,
        `Build meaningful relationships with people who share your interest in ${interests}`,
        `Create something tangible related to ${interests} that you're proud of`
      ]
    };

    return suggestions[category] || [
      `Set a SMART goal related to ${interestList}`,
      `Break down your ${interestList} aspirations into actionable milestones`,
      `Track daily progress on your ${interestList} journey`
    ];
  };

  const createGoalFromSuggestion = async (suggestion: string) => {
    if (!user) return;
    setCreating(true);
    setSelectedGoal(suggestion);

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: suggestion.split(' - ')[0] || suggestion.substring(0, 50),
          description: suggestion,
          category: formData.category,
          priority: 'medium',
          milestones: [],
          userId: user.id
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchExistingGoals(user.id);
        alert('Goal created successfully!');
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setCreating(false);
      setSelectedGoal(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Goal Setter</h1>
        <p className="text-gray-400">Get personalized goal suggestions based on your interests</p>
      </div>

      {/* Input Form */}
      <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Tell us about your goals</h2>
          <button
            onClick={fillSampleData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Load Sample
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="Career">Career</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Personal">Personal</option>
                <option value="Relationships">Relationships</option>
                <option value="Creative">Creative</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Timeframe</label>
              <select
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="1 year">1 Year</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Your Interests (comma-separated)</label>
            <input
              type="text"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g., programming, fitness, reading, investing"
            />
          </div>
          <button
            onClick={generateSuggestions}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Suggestions...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Goal Suggestions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">AI-Generated Goal Suggestions</h2>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-yellow-500/20 text-yellow-400 rounded-full font-medium">
                      {index + 1}
                    </span>
                    <p className="text-white">{suggestion}</p>
                  </div>
                  <button
                    onClick={() => createGoalFromSuggestion(suggestion)}
                    disabled={creating && selectedGoal === suggestion}
                    className="flex-shrink-0 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
                  >
                    {creating && selectedGoal === suggestion ? 'Creating...' : 'Create Goal'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Goals */}
      {existingGoals.length > 0 && (
        <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Current Goals</h2>
          <div className="space-y-3">
            {existingGoals.slice(0, 5).map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{goal.title}</p>
                  <p className="text-gray-400 text-sm">{goal.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  goal.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                  goal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {goal.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
