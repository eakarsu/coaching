'use client';

import { useEffect, useState } from 'react';

interface Prediction {
  id: string;
  title: string;
  description: string;
  category: string;
  scenario: string;
  factors: string[];
  probability: number | null;
  timeframe: string | null;
  outcome: string | null;
  confidence: string;
  aiPrediction: string | null;
  actualResult: string | null;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Business',
    scenario: '',
    factors: [''],
    timeframe: ''
  });
  const [saving, setSaving] = useState(false);

  const fillSampleData = () => {
    setFormData({
      title: 'Will our product launch meet the Q2 deadline?',
      description: 'We have a major product launch planned for end of Q2. The team has been working on it for 3 months and we are about 70% complete.',
      category: 'Business',
      scenario: 'The remaining 30% includes payment integration, user onboarding flow, and performance optimization. We have 6 weeks left and 4 developers available full-time.',
      factors: ['Team velocity has been consistent', 'Payment API has known complexity', 'QA testing needs 2 weeks', 'No major blockers currently'],
      timeframe: '6 weeks'
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchPredictions(userData.id);
    }
  }, []);

  const fetchPredictions = async (userId: string) => {
    try {
      const response = await fetch(`/api/predictions?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setPredictions(data.predictions);
      }
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const url = isEditing && selectedPrediction ? `/api/predictions/${selectedPrediction.id}` : '/api/predictions';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          factors: formData.factors.filter(f => f.trim()),
          userId: user.id,
          refreshAI: isEditing
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchPredictions(user.id);
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save prediction:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prediction?')) return;

    try {
      const response = await fetch(`/api/predictions/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success && user) {
        fetchPredictions(user.id);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Failed to delete prediction:', error);
    }
  };

  const handleEdit = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    setFormData({
      title: prediction.title,
      description: prediction.description,
      category: prediction.category,
      scenario: prediction.scenario,
      factors: prediction.factors.length > 0 ? prediction.factors : [''],
      timeframe: prediction.timeframe || ''
    });
    setIsEditing(true);
    setShowDetailModal(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedPrediction(null);
    setFormData({
      title: '',
      description: '',
      category: 'Business',
      scenario: '',
      factors: [''],
      timeframe: ''
    });
  };

  const addFactor = () => {
    setFormData({ ...formData, factors: [...formData.factors, ''] });
  };

  const updateFactor = (index: number, value: string) => {
    const newFactors = [...formData.factors];
    newFactors[index] = value;
    setFormData({ ...formData, factors: newFactors });
  };

  const removeFactor = (index: number) => {
    const newFactors = formData.factors.filter((_, i) => i !== index);
    setFormData({ ...formData, factors: newFactors.length > 0 ? newFactors : [''] });
  };

  const getProbabilityColor = (probability: number | null) => {
    if (!probability) return 'text-gray-400';
    if (probability >= 75) return 'text-green-400';
    if (probability >= 50) return 'text-blue-400';
    if (probability >= 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-400 bg-blue-500/20';
      case 'correct': return 'text-green-400 bg-green-500/20';
      case 'incorrect': return 'text-red-400 bg-red-500/20';
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Outcome Predictor</h1>
          <p className="text-gray-400">Predict outcomes with AI-powered probability analysis</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Prediction
        </button>
      </div>

      {/* Predictions List */}
      {predictions.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No predictions yet</h3>
          <p className="text-gray-400 mb-4">Create your first outcome prediction</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Prediction
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              onClick={() => { setSelectedPrediction(prediction); setShowDetailModal(true); }}
              className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {prediction.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{prediction.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {prediction.probability && (
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getProbabilityColor(prediction.probability)}`}>
                        {prediction.probability}%
                      </p>
                      <p className="text-xs text-gray-500">probability</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">{prediction.category}</span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence} confidence
                </span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getStatusColor(prediction.status)}`}>
                  {prediction.status}
                </span>
                {prediction.timeframe && <span className="text-gray-500">Timeframe: {prediction.timeframe}</span>}
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
                <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Prediction' : 'New Prediction'}</h2>
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
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What outcome do you want to predict?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
                  placeholder="Describe the situation"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Business">Business</option>
                    <option value="Career">Career</option>
                    <option value="Finance">Finance</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Timeframe</label>
                  <input
                    type="text"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 2 weeks"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Scenario</label>
                <textarea
                  value={formData.scenario}
                  onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
                  placeholder="Describe the specific scenario you're predicting"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Key Factors</label>
                {formData.factors.map((factor, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={factor}
                      onChange={(e) => updateFactor(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Factor ${index + 1}`}
                    />
                    <button type="button" onClick={() => removeFactor(index)} className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addFactor} className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Factor
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Predicting...' : (isEditing ? 'Update' : 'Predict')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{selectedPrediction.title}</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Probability Display */}
              {selectedPrediction.probability && (
                <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-xl p-6 border border-indigo-500/20 text-center">
                  <p className={`text-6xl font-bold ${getProbabilityColor(selectedPrediction.probability)}`}>
                    {selectedPrediction.probability}%
                  </p>
                  <p className="text-gray-400 mt-2">Predicted Probability</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getConfidenceColor(selectedPrediction.confidence)}`}>
                      {selectedPrediction.confidence} confidence
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Category</h3>
                  <p className="text-white">{selectedPrediction.category}</p>
                </div>
                {selectedPrediction.timeframe && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Timeframe</h3>
                    <p className="text-white">{selectedPrediction.timeframe}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p className="text-white">{selectedPrediction.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Scenario</h3>
                <p className="text-white">{selectedPrediction.scenario}</p>
              </div>

              {selectedPrediction.factors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Key Factors</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrediction.factors.map((factor, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPrediction.aiPrediction && (
                <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-xl p-4 border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-indigo-300">AI Prediction Analysis</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedPrediction.aiPrediction}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(selectedPrediction)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedPrediction.id)}
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
