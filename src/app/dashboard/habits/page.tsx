'use client';

import { useEffect, useState } from 'react';

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  category: string;
  streak: number;
  bestStreak: number;
  totalCount: number;
  lastCompleted: string | null;
  reminder: string | null;
  status: string;
  aiSuggestions: string | null;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    category: 'General',
    reminder: ''
  });
  const [saving, setSaving] = useState(false);

  const fillSampleData = () => {
    setFormData({
      name: 'Morning Meditation',
      description: 'Practice 15 minutes of mindful meditation every morning before starting work to improve focus and reduce stress.',
      frequency: 'daily',
      category: 'Wellness',
      reminder: '7:00 AM'
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchHabits(userData.id);
    }
  }, []);

  const fetchHabits = async (userId: string) => {
    try {
      const response = await fetch(`/api/habits?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setHabits(data.habits);
      }
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const url = isEditing && selectedHabit ? `/api/habits/${selectedHabit.id}` : '/api/habits';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          refreshAI: isEditing
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchHabits(user.id);
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save habit:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (habit: Habit, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completeToday: true })
      });

      const data = await response.json();
      if (data.success) {
        fetchHabits(user.id);
      }
    } catch (error) {
      console.error('Failed to complete habit:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    try {
      const response = await fetch(`/api/habits/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success && user) {
        fetchHabits(user.id);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const handleEdit = (habit: Habit) => {
    setSelectedHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency,
      category: habit.category,
      reminder: habit.reminder || ''
    });
    setIsEditing(true);
    setShowDetailModal(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedHabit(null);
    setFormData({
      name: '',
      description: '',
      frequency: 'daily',
      category: 'General',
      reminder: ''
    });
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-yellow-400';
    if (streak >= 7) return 'text-green-400';
    if (streak >= 3) return 'text-blue-400';
    return 'text-gray-400';
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Habit Tracker</h1>
          <p className="text-gray-400">Build better habits with AI-powered suggestions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Habit
        </button>
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No habits yet</h3>
          <p className="text-gray-400 mb-4">Start building better habits today</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Habit
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => { setSelectedHabit(habit); setShowDetailModal(true); }}
              className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {habit.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-white/10 text-gray-300">
                      {habit.frequency}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{habit.description}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${getStreakColor(habit.streak)}`}>{habit.streak}</p>
                    <p className="text-xs text-gray-500">streak</p>
                  </div>
                  <button
                    onClick={(e) => handleComplete(habit, e)}
                    className="p-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="text-gray-500">{habit.category}</span>
                <span className="text-gray-500">Best: {habit.bestStreak} days</span>
                <span className="text-gray-500">Total: {habit.totalCount} times</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-lg">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Habit' : 'Create New Habit'}</h2>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter habit name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Describe your habit"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Health">Health</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Learning">Learning</option>
                    <option value="Finance">Finance</option>
                    <option value="Relationships">Relationships</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Reminder</label>
                <input
                  type="text"
                  value={formData.reminder}
                  onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 9:00 AM"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{selectedHabit.name}</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className={`text-3xl font-bold ${getStreakColor(selectedHabit.streak)}`}>{selectedHabit.streak}</p>
                  <p className="text-sm text-gray-400">Current Streak</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-3xl font-bold text-purple-400">{selectedHabit.bestStreak}</p>
                  <p className="text-sm text-gray-400">Best Streak</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-3xl font-bold text-blue-400">{selectedHabit.totalCount}</p>
                  <p className="text-sm text-gray-400">Total Completions</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p className="text-white">{selectedHabit.description}</p>
              </div>

              <div className="flex gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Frequency</h3>
                  <p className="text-white capitalize">{selectedHabit.frequency}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Category</h3>
                  <p className="text-white">{selectedHabit.category}</p>
                </div>
                {selectedHabit.reminder && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Reminder</h3>
                    <p className="text-white">{selectedHabit.reminder}</p>
                  </div>
                )}
              </div>

              {selectedHabit.aiSuggestions && (
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-blue-300">AI Suggestions</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedHabit.aiSuggestions}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(selectedHabit)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedHabit.id)}
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
