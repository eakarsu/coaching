'use client';

import { useEffect, useState } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string | null;
  progress: number;
  status: string;
  priority: string;
  aiInsights: string | null;
  milestones: string[];
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    targetDate: '',
    priority: 'medium',
    milestones: ['']
  });
  const [saving, setSaving] = useState(false);

  const fillSampleData = () => {
    setFormData({
      title: 'Learn TypeScript Advanced Patterns',
      description: 'Master advanced TypeScript patterns including generics, conditional types, mapped types, and template literal types to write more type-safe code.',
      category: 'Education',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      milestones: ['Complete generics chapter', 'Build a type-safe API client', 'Contribute to a typed OSS project']
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchGoals(userData.id);
    }
  }, []);

  const fetchGoals = async (userId: string) => {
    try {
      const response = await fetch(`/api/goals?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setGoals(data.goals);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const url = isEditing && selectedGoal ? `/api/goals/${selectedGoal.id}` : '/api/goals';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          milestones: formData.milestones.filter(m => m.trim()),
          userId: user.id,
          refreshAI: isEditing
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchGoals(user.id);
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save goal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success && user) {
        fetchGoals(user.id);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
      priority: goal.priority,
      milestones: goal.milestones.length > 0 ? goal.milestones : ['']
    });
    setIsEditing(true);
    setShowDetailModal(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedGoal(null);
    setFormData({
      title: '',
      description: '',
      category: 'Personal',
      targetDate: '',
      priority: 'medium',
      milestones: ['']
    });
  };

  const addMilestone = () => {
    setFormData({ ...formData, milestones: [...formData.milestones, ''] });
  };

  const updateMilestone = (index: number, value: string) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = value;
    setFormData({ ...formData, milestones: newMilestones });
  };

  const removeMilestone = (index: number) => {
    const newMilestones = formData.milestones.filter((_, i) => i !== index);
    setFormData({ ...formData, milestones: newMilestones.length > 0 ? newMilestones : [''] });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'paused': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Goal Tracker</h1>
          <p className="text-gray-400">Track your goals with AI-powered insights</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Goal
        </button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No goals yet</h3>
          <p className="text-gray-400 mb-4">Create your first goal to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => { setSelectedGoal(goal); setShowDetailModal(true); }}
              className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {goal.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{goal.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                    {goal.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{goal.category}</span>
                {goal.targetDate && (
                  <span className="text-gray-400">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                )}
              </div>
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
                <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Goal' : 'Create New Goal'}</h2>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter goal title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                  placeholder="Describe your goal"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Career">Career</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Relationships">Relationships</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Milestones</label>
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={milestone}
                      onChange={(e) => updateMilestone(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={`Milestone ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMilestone}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Milestone
                </button>
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{selectedGoal.title}</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityColor(selectedGoal.priority)}`}>
                  {selectedGoal.priority} priority
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(selectedGoal.status)}`}>
                  {selectedGoal.status}
                </span>
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-white/10 text-gray-300">
                  {selectedGoal.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p className="text-white">{selectedGoal.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Progress</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      style={{ width: `${selectedGoal.progress}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold">{selectedGoal.progress}%</span>
                </div>
              </div>

              {selectedGoal.milestones.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Milestones</h3>
                  <div className="space-y-2">
                    {selectedGoal.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-2 text-white">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        {milestone}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedGoal.aiInsights && (
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-purple-300">AI Insights</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedGoal.aiInsights}</p>
                </div>
              )}

              {selectedGoal.targetDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Target Date</h3>
                  <p className="text-white">{new Date(selectedGoal.targetDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(selectedGoal)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedGoal.id)}
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
