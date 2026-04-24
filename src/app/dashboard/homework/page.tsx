'use client';

import { useEffect, useState } from 'react';

interface Homework {
  id: string;
  subject: string;
  topic: string;
  gradeLevel: string;
  difficulty: string;
  questions: string[];
  answers: string[];
  hints: string[];
  explanation: string | null;
  aiGenerated: boolean;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function HomeworkPage() {
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [formData, setFormData] = useState({
    subject: 'Mathematics',
    topic: '',
    gradeLevel: 'High School',
    difficulty: 'medium',
    numberOfQuestions: 5
  });
  const [saving, setSaving] = useState(false);

  const fillSampleData = () => {
    setFormData({
      subject: 'Mathematics',
      topic: 'Quadratic Equations',
      gradeLevel: 'High School',
      difficulty: 'medium',
      numberOfQuestions: 5
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchHomework(userData.id);
    }
  }, []);

  const fetchHomework = async (userId: string) => {
    try {
      const response = await fetch(`/api/homework?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setHomeworkList(data.homework);
      }
    } catch (error) {
      console.error('Failed to fetch homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const url = isEditing && selectedHomework ? `/api/homework/${selectedHomework.id}` : '/api/homework';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id, regenerate: isEditing })
      });

      const data = await response.json();
      if (data.success) {
        fetchHomework(user.id);
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save homework:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this homework?')) return;

    try {
      const response = await fetch(`/api/homework/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success && user) {
        fetchHomework(user.id);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Failed to delete homework:', error);
    }
  };

  const handleEdit = (homework: Homework) => {
    setSelectedHomework(homework);
    setFormData({
      subject: homework.subject,
      topic: homework.topic,
      gradeLevel: homework.gradeLevel,
      difficulty: homework.difficulty,
      numberOfQuestions: homework.questions.length
    });
    setIsEditing(true);
    setShowDetailModal(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedHomework(null);
    setFormData({
      subject: 'Mathematics',
      topic: '',
      gradeLevel: 'High School',
      difficulty: 'medium',
      numberOfQuestions: 5
    });
  };

  const toggleAnswer = (index: number) => {
    setShowAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Homework Generator</h1>
          <p className="text-gray-400">Generate customized homework for any subject</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg shadow-pink-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Homework
        </button>
      </div>

      {/* Homework List */}
      {homeworkList.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No homework generated</h3>
          <p className="text-gray-400 mb-4">Generate your first homework assignment</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Generate Homework
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {homeworkList.map((homework) => (
            <div
              key={homework.id}
              onClick={() => { setSelectedHomework(homework); setShowDetailModal(true); setShowAnswers({}); }}
              className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-pink-300 transition-colors">
                    {homework.subject}: {homework.topic}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{homework.gradeLevel}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(homework.difficulty)}`}>
                  {homework.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{homework.questions.length} questions</span>
                <span>{new Date(homework.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-lg">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Homework' : 'Generate Homework'}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fillSampleData}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Load Sample
                  </button>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Economics">Economics</option>
                  <option value="Literature">Literature</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Quadratic Equations"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Grade Level</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Elementary">Elementary</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="College">College</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Number of Questions</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.numberOfQuestions}
                  onChange={(e) => setFormData({ ...formData, numberOfQuestions: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (isEditing ? 'Update' : 'Generate')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedHomework.subject}: {selectedHomework.topic}</h2>
                  <p className="text-gray-400 text-sm">{selectedHomework.gradeLevel} - {selectedHomework.difficulty}</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {selectedHomework.explanation && (
                <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-500/20">
                  <h3 className="text-sm font-semibold text-pink-300 mb-2">Overview</h3>
                  <p className="text-gray-300 text-sm">{selectedHomework.explanation}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Questions</h3>
                {selectedHomework.questions.map((question, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-pink-500/20 text-pink-400 rounded-full font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-white mb-3">{question}</p>

                        {selectedHomework.hints[index] && (
                          <p className="text-gray-400 text-sm mb-2">
                            <span className="text-yellow-400">Hint:</span> {selectedHomework.hints[index]}
                          </p>
                        )}

                        <button
                          onClick={() => toggleAnswer(index)}
                          className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1"
                        >
                          {showAnswers[index] ? 'Hide Answer' : 'Show Answer'}
                          <svg className={`w-4 h-4 transition-transform ${showAnswers[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showAnswers[index] && selectedHomework.answers[index] && (
                          <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-green-300 text-sm">
                              <span className="font-medium">Answer:</span> {selectedHomework.answers[index]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleEdit(selectedHomework)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedHomework.id)}
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
