import Link from 'next/link';
import { getBlogPosts } from '@/lib/data';

export const dynamic = 'force-dynamic';

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPost = posts.find((post) => post.featured);
  const otherPosts = posts.filter((post) => !post.featured);

  // Get unique categories
  const categories = [...new Set(posts.map((post) => post.category))];

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
            Leadership Insights & Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Explore articles, guides, and resources to accelerate your leadership journey and achieve extraordinary results.
          </p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3">
            <span className="text-gray-600 font-medium mr-2">Categories:</span>
            {categories.map((category) => (
              <span
                key={category}
                className="bg-white px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 border hover:border-blue-300 cursor-pointer transition-colors"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-6">Featured Article</h2>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="grid md:grid-cols-2 gap-8 bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-video md:aspect-auto bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
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
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-500 text-sm">{featuredPost.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                <span className="text-sm text-gray-500">{formatDate(featuredPost.createdAt)}</span>
              </div>
            </Link>
          </div>
        )}

        {/* All Posts Grid */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">All Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-xl border hover:shadow-lg transition-shadow group overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-gray-400">Image</span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-3">
                  <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want Personalized Leadership Guidance?
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
