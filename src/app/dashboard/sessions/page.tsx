'use client';

import { useEffect, useState } from 'react';

interface Session {
  id: string;
  title: string;
  duration: number;
  notes: string;
  category: string;
  mood: string | null;
  productivity: number | null;
  keyTakeaways: string[];
  aiSummary: string | null;
  actionItems: string[];
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    duration: 30,
    notes: '',
    category: 'Work',
    mood: 'Neutral',
    productivity: 5,
    keyTakeaways: [''],
    actionItems: ['']
  });
  const [saving, setSaving] = useState(false);

  const fillSampleData = () => {
    setFormData({
      title: 'Deep Work: API Refactoring',
      duration: 90,
      notes: 'Spent 90 minutes refactoring the REST API layer to use a cleaner repository pattern. Removed duplicated database queries and added proper error handling. Also wrote integration tests for the main endpoints.',
      category: 'Work',
      mood: 'Focused',
      productivity: 8,
      keyTakeaways: ['Repository pattern simplifies testing', 'Error boundaries catch unexpected failures'],
      actionItems: ['Review remaining endpoints', 'Add rate limiting']
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchSessions(userData.id);
    }
  }, []);

  const fetchSessions = async (userId: string) => {
    try {
      const response = await fetch(`/api/sessions?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const url = isEditing && selectedSession ? `/api/sessions/${selectedSession.id}` : '/api/sessions';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          keyTakeaways: formData.keyTakeaways.filter(k => k.trim()),
          actionItems: formData.actionItems.filter(a => a.trim()),
          userId: user.id,
          refreshAI: isEditing
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchSessions(user.id);
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const response = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success && user) {
        fetchSessions(user.id);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setFormData({
      title: session.title,
      duration: session.duration,
      notes: session.notes,
      category: session.category,
      mood: session.mood || 'Neutral',
      productivity: session.productivity || 5,
      keyTakeaways: session.keyTakeaways.length > 0 ? session.keyTakeaways : [''],
      actionItems: session.actionItems.length > 0 ? session.actionItems : ['']
    });
    setIsEditing(true);
    setShowDetailModal(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedSession(null);
    setFormData({
      title: '',
      duration: 30,
      notes: '',
      category: 'Work',
      mood: 'Neutral',
      productivity: 5,
      keyTakeaways: [''],
      actionItems: ['']
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Session Summarizer</h1>
          <p className="text-gray-400">Log and analyze your work sessions with AI insights</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Session
        </button>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No sessions logged</h3>
          <p className="text-gray-400 mb-4">Start logging your work sessions</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Log Session
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => { setSelectedSession(session); setShowDetailModal(true); }}
              className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {session.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                    <span>{formatDuration(session.duration)}</span>
                    <span>{session.category}</span>
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {session.mood && (
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-white/10 text-gray-300">
                      {session.mood}
                    </span>
                  )}
                  {session.productivity && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-400">{session.productivity}/10</p>
                      <p className="text-xs text-gray-500">productivity</p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2">{session.notes}</p>
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
                <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Session' : 'Log New Session'}</h2>
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
                  placeholder="Session title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Work">Work</option>
                    <option value="Learning">Learning</option>
                    <option value="Creative">Creative</option>
                    <option value="Meetings">Meetings</option>
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                  placeholder="What did you work on?"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mood</label>
                  <select
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Focused">Focused</option>
                    <option value="Energized">Energized</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Tired">Tired</option>
                    <option value="Stressed">Stressed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Productivity (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.productivity}
                    onChange={(e) => setFormData({ ...formData, productivity: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-purple-400 font-medium">{formData.productivity}</div>
                </div>
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update' : 'Log Session')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{selectedSession.title}</h2>
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
                  <p className="text-xl font-bold text-white">{formatDuration(selectedSession.duration)}</p>
                  <p className="text-xs text-gray-400">Duration</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xl font-bold text-purple-400">{selectedSession.category}</p>
                  <p className="text-xs text-gray-400">Category</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xl font-bold text-blue-400">{selectedSession.mood || 'N/A'}</p>
                  <p className="text-xs text-gray-400">Mood</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xl font-bold text-green-400">{selectedSession.productivity || 'N/A'}/10</p>
                  <p className="text-xs text-gray-400">Productivity</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Notes</h3>
                <p className="text-white">{selectedSession.notes}</p>
              </div>

              {selectedSession.keyTakeaways.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Key Takeaways</h3>
                  <ul className="space-y-1">
                    {selectedSession.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-center gap-2 text-white">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedSession.aiSummary && (
                <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-purple-300">AI Summary</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedSession.aiSummary}</p>
                </div>
              )}

              {selectedSession.actionItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Action Items</h3>
                  <ul className="space-y-1">
                    {selectedSession.actionItems.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-white">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(selectedSession)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedSession.id)}
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
