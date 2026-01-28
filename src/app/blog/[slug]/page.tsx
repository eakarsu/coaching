import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#blog"
            className="inline-flex items-center text-blue-300 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Resources
          </Link>

          <div className="flex items-center space-x-4 mb-6">
            <span className="bg-blue-500/20 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-400/30">
              {post.category}
            </span>
            <span className="text-gray-400">{post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            {post.excerpt}
          </p>

          <div className="flex items-center text-gray-400">
            <span>Published on {formatDate(post.createdAt)}</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white/50 text-lg">Featured Image</span>
          )}
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <>
              <p className="text-gray-600 leading-relaxed mb-6">
                Leadership excellence is not an innate quality but a skill that can be developed through deliberate practice and continuous learning. In today's rapidly evolving business landscape, the ability to lead effectively has never been more critical.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Understanding the Core Principles</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Effective leadership begins with self-awareness. Leaders who understand their strengths, weaknesses, and blind spots are better equipped to navigate complex challenges and inspire their teams. This foundational understanding forms the bedrock upon which all other leadership skills are built.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Building High-Performing Teams</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                The mark of a great leader is not personal achievement but the ability to elevate those around them. Creating an environment where team members feel psychologically safe to take risks, share ideas, and learn from failures is essential for fostering innovation and driving results.
              </p>

              <blockquote className="border-l-4 border-blue-600 pl-6 my-8 italic text-gray-700">
                "The greatest leaders are those who empower others to become leaders themselves."
              </blockquote>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Practical Strategies for Growth</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Developing leadership capabilities requires consistent effort and intentional practice. Consider implementing these strategies:
              </p>

              <ul className="list-disc pl-6 space-y-3 text-gray-600 mb-6">
                <li>Schedule regular reflection time to assess your leadership decisions and their outcomes</li>
                <li>Seek feedback from peers, direct reports, and mentors to identify growth areas</li>
                <li>Invest in continuous learning through books, courses, and coaching</li>
                <li>Practice active listening and empathetic communication daily</li>
                <li>Set clear expectations and hold yourself accountable to the same standards you set for others</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Taking the Next Step</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Leadership development is a journey, not a destination. Whether you're stepping into your first management role or leading a global organization, there's always room for growth and improvement. The key is to remain curious, stay committed to your development, and never stop learning.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Ready to accelerate your leadership journey? Consider working with an executive coach who can provide personalized guidance, accountability, and support as you work toward your goals.
              </p>
            </>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Leadership?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Book a free discovery call to discuss how executive coaching can help you achieve your leadership goals.
          </p>
          <a
            href="/#booking"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Schedule Your Free Consultation
          </a>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group"
                >
                  <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2 group-hover:text-blue-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Navigation */}
      <div className="bg-white py-8 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Resources
          </Link>
        </div>
      </div>
    </main>
  );
}
