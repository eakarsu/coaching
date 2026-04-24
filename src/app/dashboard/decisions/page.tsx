'use client';

import { useEffect, useState } from 'react';

interface Decision {
  id: string;
  title: string;
  description: string;
  category: string;
  options: string[];
  pros: string[];
  cons: string[];
  urgency: string;
  importance: string;
  status: string;
  finalChoice: string | null;
  aiAnalysis: string | null;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Career',
    options: ['', ''],
    pros: [''],
    cons: [''],
    urgency: 'medium',
    importance: 'medium'
  });
  const [saving, setSaving] = useState(false);

  const fillSampleData = () => {
    setFormData({
      title: 'Should I switch to a microservices architecture?',
      description: 'Our monolithic app is growing and we are experiencing deployment bottlenecks. Considering breaking it into microservices for better scalability and team independence.',
      category: 'Career',
      options: ['Stay with monolith and optimize', 'Gradual migration to microservices', 'Full rewrite as microservices'],
      pros: ['Independent deployments', 'Team autonomy', 'Better scalability per service'],
      cons: ['Added complexity', 'Network latency', 'Harder debugging'],
      urgency: 'medium',
      importance: 'high'
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchDecisions(userData.id);
    }
  }, []);

  const fetchDecisions = async (userId: string) => {
    try {
      const response = await fetch(`/api/decisions?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setDecisions(data.decisions);
      }
    } catch (error) {
      console.error('Failed to fetch decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const url = isEditing && selectedDecision ? `/api/decisions/${selectedDecision.id}` : '/api/decisions';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          options: formData.options.filter(o => o.trim()),
          pros: formData.pros.filter(p => p.trim()),
          cons: formData.cons.filter(c => c.trim()),
          userId: user.id,
          refreshAI: isEditing
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchDecisions(user.id);
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save decision:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this decision?')) return;

    try {
      const response = await fetch(`/api/decisions/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success && user) {
        fetchDecisions(user.id);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Failed to delete decision:', error);
    }
  };

  const handleEdit = (decision: Decision) => {
    setSelectedDecision(decision);
    setFormData({
      title: decision.title,
      description: decision.description,
      category: decision.category,
      options: decision.options.length > 0 ? decision.options : ['', ''],
      pros: decision.pros.length > 0 ? decision.pros : [''],
      cons: decision.cons.length > 0 ? decision.cons : [''],
      urgency: decision.urgency,
      importance: decision.importance
    });
    setIsEditing(true);
    setShowDetailModal(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedDecision(null);
    setFormData({
      title: '',
      description: '',
      category: 'Career',
      options: ['', ''],
      pros: [''],
      cons: [''],
      urgency: 'medium',
      importance: 'medium'
    });
  };

  const addArrayItem = (field: 'options' | 'pros' | 'cons') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const updateArrayItem = (field: 'options' | 'pros' | 'cons', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (field: 'options' | 'pros' | 'cons', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length > 0 ? newArray : [''] });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'resolved': return 'text-green-400 bg-green-500/20';
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Decision Helper</h1>
          <p className="text-gray-400">Make better decisions with AI-powered analysis</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg shadow-orange-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Decision
        </button>
      </div>

      {/* Decisions List */}
      {decisions.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No decisions yet</h3>
          <p className="text-gray-400 mb-4">Add a decision to get AI analysis</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add Decision
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              onClick={() => { setSelectedDecision(decision); setShowDetailModal(true); }}
              className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors">
                    {decision.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{decision.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getUrgencyColor(decision.urgency)}`}>
                    {decision.urgency}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(decision.status)}`}>
                    {decision.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">{decision.category}</span>
                <span className="text-gray-500">{decision.options.length} options</span>
                {decision.finalChoice && (
                  <span className="text-green-400">Decided: {decision.finalChoice}</span>
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
                <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Decision' : 'New Decision'}</h2>
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
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="What decision do you need to make?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 h-20"
                  placeholder="Describe the context"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Options</label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateArrayItem('options', index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={`Option ${index + 1}`}
                    />
                    <button type="button" onClick={() => removeArrayItem('options', index)} className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('options')} className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Option
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Importance</label>
                  <select
                    value={formData.importance}
                    onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Analyzing...' : (isEditing ? 'Update' : 'Analyze')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{selectedDecision.title}</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getUrgencyColor(selectedDecision.urgency)}`}>
                  {selectedDecision.urgency} urgency
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(selectedDecision.status)}`}>
                  {selectedDecision.status}
                </span>
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-white/10 text-gray-300">
                  {selectedDecision.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p className="text-white">{selectedDecision.description}</p>
              </div>

              {selectedDecision.options.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Options</h3>
                  <div className="space-y-2">
                    {selectedDecision.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 text-white bg-white/5 rounded-lg px-3 py-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDecision.aiAnalysis && (
                <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl p-4 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-orange-300">AI Analysis</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedDecision.aiAnalysis}</p>
                </div>
              )}

              {selectedDecision.finalChoice && (
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <h3 className="text-sm font-medium text-green-400 mb-1">Final Decision</h3>
                  <p className="text-white font-medium">{selectedDecision.finalChoice}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(selectedDecision)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedDecision.id)}
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
