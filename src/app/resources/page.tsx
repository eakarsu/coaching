import Link from 'next/link';
import { getResources } from '@/lib/data';

export const dynamic = 'force-dynamic';

const iconMap: Record<string, JSX.Element> = {
  'clipboard-check': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  'book-open': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  mail: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  calendar: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  book: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  heart: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  map: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  users: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  eye: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  clock: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  chat: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  'check-square': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  microphone: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  video: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  'chat-bubble': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
};

export default async function ResourcesPage() {
  const resources = await getResources();

  // Group resources by type
  const assessments = resources.filter((r) => r.type === 'Assessment');
  const guides = resources.filter((r) => r.type === 'PDF Guide' || r.type === 'Template' || r.type === 'Toolkit' || r.type === 'Checklist');
  const newsletters = resources.filter((r) => r.type === 'Newsletter');
  const otherResources = resources.filter(
    (r) => !['Assessment', 'PDF Guide', 'Template', 'Toolkit', 'Checklist', 'Newsletter'].includes(r.type)
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-300 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Free Leadership Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Download tools, templates, and guides to support your leadership development journey.
          </p>
        </div>
      </header>

      {/* Assessments Section */}
      {assessments.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Leadership Assessments</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {assessments.map((resource) => (
              <div
                key={resource.id}
                className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    {iconMap[resource.iconName] || iconMap.book}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      {resource.type}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Start Assessment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Guides & Templates Section */}
      {guides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Free Guides & Templates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow group"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  {iconMap[resource.iconName] || iconMap.book}
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {resource.type}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <button className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
                  Download Free
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      {newsletters.length > 0 && (
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6 text-white">
              {iconMap.mail}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {newsletters[0]?.title || 'Weekly Leadership Insights'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {newsletters[0]?.description || 'Subscribe to receive actionable leadership tips and exclusive content every week.'}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-blue-200 text-sm mt-4">
              Join 5,000+ leaders. Unsubscribe anytime.
            </p>
          </div>
        </section>
      )}

      {/* Other Resources */}
      {otherResources.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {otherResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-600 mb-4 group-hover:text-blue-600 transition-colors">
                  {iconMap[resource.iconName] || iconMap.book}
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {resource.type}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <button className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
                  Access Now
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready for Personalized Guidance?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Take your leadership to the next level with one-on-one executive coaching.
          </p>
          <a
            href="/#booking"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Schedule a Free Consultation
          </a>
        </div>
      </section>
    </main>
  );
}
