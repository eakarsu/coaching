'use client';

import { useEffect, useState } from 'react';

interface Mood {
  id: string;
  rating: number;
  emotion: string;
  notes: string | null;
  factors: string[];
  activities: string[];
  energy: number | null;
  stress: number | null;
  sleep: number | null;
  aiAnalysis: string | null;
  suggestions: string[];
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const emotions = ['Happy', 'Excited', 'Content', 'Calm', 'Neutral', 'Tired', 'Anxious', 'Sad', 'Frustrated', 'Stressed'];
const commonFactors = ['Work', 'Relationships', 'Health', 'Sleep', 'Weather', 'Exercise', 'Diet', 'Social', 'Finances', 'Family'];
const commonActivities = ['Working', 'Exercising', 'Reading', 'Socializing', 'Relaxing', 'Cooking', 'Commuting', 'Shopping', 'Gaming', 'Meditating'];

export default function MoodsPage() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    emotion: 'Neutral',
    notes: '',
    factors: [] as string[],
    activities: [] as string[],
    energy: 5,
    stress: 5,
    sleep: 7
  });
  const [saving, setSaving] = useState(false);

  const fillSampleData = () => {
    setFormData({
      rating: 7,
      emotion: 'Content',
      notes: 'Had a productive day at work, finished a major feature. Feeling good about progress but slightly tired from the long focus session.',
      factors: ['Work', 'Exercise', 'Sleep'],
      activities: ['Working', 'Exercising', 'Reading'],
      energy: 6,
      stress: 4,
      sleep: 7
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchMoods(userData.id);
    }
  }, []);

  const fetchMoods = async (userId: string) => {
    try {
      const response = await fetch(`/api/moods?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setMoods(data.moods);
      }
    } catch (error) {
      console.error('Failed to fetch moods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const url = isEditing && selectedMood ? `/api/moods/${selectedMood.id}` : '/api/moods';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id, refreshAI: isEditing })
      });

      const data = await response.json();
      if (data.success) {
        fetchMoods(user.id);
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save mood:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mood entry?')) return;

    try {
      const response = await fetch(`/api/moods/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success && user) {
        fetchMoods(user.id);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Failed to delete mood:', error);
    }
  };

  const handleEdit = (mood: Mood) => {
    setSelectedMood(mood);
    setFormData({
      rating: mood.rating,
      emotion: mood.emotion,
      notes: mood.notes || '',
      factors: mood.factors,
      activities: mood.activities,
      energy: mood.energy || 5,
      stress: mood.stress || 5,
      sleep: mood.sleep || 7
    });
    setIsEditing(true);
    setShowDetailModal(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedMood(null);
    setFormData({
      rating: 5,
      emotion: 'Neutral',
      notes: '',
      factors: [],
      activities: [],
      energy: 5,
      stress: 5,
      sleep: 7
    });
  };

  const toggleFactor = (factor: string) => {
    setFormData(prev => ({
      ...prev,
      factors: prev.factors.includes(factor)
        ? prev.factors.filter(f => f !== factor)
        : [...prev.factors, factor]
    }));
  };

  const toggleActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const getMoodColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400 bg-green-500/20';
    if (rating >= 6) return 'text-blue-400 bg-blue-500/20';
    if (rating >= 4) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getMoodEmoji = (rating: number) => {
    if (rating >= 8) return '😊';
    if (rating >= 6) return '🙂';
    if (rating >= 4) return '😐';
    if (rating >= 2) return '😔';
    return '😢';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Mood Tracker</h1>
          <p className="text-gray-400">Track your emotional wellbeing and get AI insights</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-lg shadow-red-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Mood
        </button>
      </div>

      {/* Mood Stats */}
      {moods.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Average Mood</p>
            <p className="text-2xl font-bold text-white">
              {(moods.reduce((sum, m) => sum + m.rating, 0) / moods.length).toFixed(1)}/10
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total Entries</p>
            <p className="text-2xl font-bold text-white">{moods.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Best Day</p>
            <p className="text-2xl font-bold text-green-400">
              {Math.max(...moods.map(m => m.rating))}/10
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Most Common</p>
            <p className="text-2xl font-bold text-purple-400">
              {moods.length > 0 ? moods[0].emotion : 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Moods List */}
      {moods.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">😊</div>
          <h3 className="text-lg font-medium text-white mb-2">No mood entries yet</h3>
          <p className="text-gray-400 mb-4">Start tracking your emotional wellbeing</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Log Your First Mood
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {moods.map((mood) => (
            <div
              key={mood.id}
              onClick={() => { setSelectedMood(mood); setShowDetailModal(true); }}
              className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{getMoodEmoji(mood.rating)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getMoodColor(mood.rating)}`}>
                        {mood.rating}/10
                      </span>
                      <span className="text-white font-medium">{mood.emotion}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(mood.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {mood.energy && <span className="text-yellow-400">Energy: {mood.energy}/10</span>}
                  {mood.stress && <span className="text-red-400">Stress: {mood.stress}/10</span>}
                </div>
              </div>
              {mood.notes && <p className="text-gray-400 text-sm line-clamp-2">{mood.notes}</p>}
              {mood.factors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {mood.factors.slice(0, 4).map((factor, index) => (
                    <span key={index} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                      {factor}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Mood Entry' : 'How are you feeling?'}</h2>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <button
                      onClick={fillSampleData}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Load Sample
                    </button>
                  )}
                  <button onClick={closeModal} className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mood Rating</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-3xl">{getMoodEmoji(formData.rating)}</span>
                  <span className="text-xl font-bold text-white w-12">{formData.rating}/10</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Emotion</label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion}
                      type="button"
                      onClick={() => setFormData({ ...formData, emotion })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.emotion === emotion
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contributing Factors</label>
                <div className="flex flex-wrap gap-2">
                  {commonFactors.map((factor) => (
                    <button
                      key={factor}
                      type="button"
                      onClick={() => toggleFactor(factor)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.factors.includes(factor)
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {factor}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Energy</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.energy}
                    onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stress</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.stress}
                    onChange={(e) => setFormData({ ...formData, stress: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Sleep (hrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={formData.sleep}
                    onChange={(e) => setFormData({ ...formData, sleep: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 h-20"
                  placeholder="What's on your mind?"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Analyzing...' : (isEditing ? 'Update' : 'Log Mood')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedMood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{getMoodEmoji(selectedMood.rating)}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedMood.emotion}</h2>
                    <p className="text-gray-400">
                      {new Date(selectedMood.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className={`text-2xl font-bold ${getMoodColor(selectedMood.rating).split(' ')[0]}`}>{selectedMood.rating}/10</p>
                  <p className="text-xs text-gray-400">Mood</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-yellow-400">{selectedMood.energy || 'N/A'}</p>
                  <p className="text-xs text-gray-400">Energy</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-red-400">{selectedMood.stress || 'N/A'}</p>
                  <p className="text-xs text-gray-400">Stress</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-blue-400">{selectedMood.sleep || 'N/A'}h</p>
                  <p className="text-xs text-gray-400">Sleep</p>
                </div>
              </div>

              {selectedMood.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Notes</h3>
                  <p className="text-white">{selectedMood.notes}</p>
                </div>
              )}

              {selectedMood.factors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Contributing Factors</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMood.factors.map((factor, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedMood.aiAnalysis && (
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl p-4 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-red-300">AI Analysis</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedMood.aiAnalysis}</p>
                </div>
              )}

              {selectedMood.suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Suggestions</h3>
                  <ul className="space-y-2">
                    {selectedMood.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-white">
                        <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(selectedMood)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedMood.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
