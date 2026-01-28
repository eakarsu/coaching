import { BlogPost, Resource } from '@prisma/client';

interface BlogProps {
  blogPosts: BlogPost[];
  resources: Resource[];
}

const iconMap: Record<string, JSX.Element> = {
  'clipboard-check': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  'book-open': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  mail: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  book: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Blog({ blogPosts, resources }: BlogProps) {
  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = blogPosts.filter(post => !post.featured).slice(0, 3);

  return (
    <section id="blog" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
            Resources & Insights
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Leadership Wisdom & Tools
          </h2>
          <p className="text-xl text-gray-600">
            Explore articles, guides, and resources to accelerate your leadership journey.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Featured Post */}
          {featuredPost && (
            <div className="lg:row-span-2 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
                {featuredPost.imageUrl ? (
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-white/50 text-lg">Featured Image</span>
                )}
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-500 text-sm">{featuredPost.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{formatDate(featuredPost.createdAt)}</span>
                  <a href={`/blog/${featuredPost.slug}`} className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
                    Read More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Other Posts */}
          <div className="space-y-6">
            {otherPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center space-x-4 mb-3">
                  <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                  <a href={`/blog/${post.slug}`} className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Resources */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Leadership Resources</h3>
            <p className="text-gray-600">Download tools and guides to support your development</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <div key={resource.id} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600 group-hover:bg-blue-200 transition-colors">
                  {iconMap[resource.iconName] || iconMap.book}
                </div>
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">{resource.type}</span>
                <h4 className="text-lg font-semibold text-gray-900 mt-2 mb-2">{resource.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <a href="#" className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
                  Get Access
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
