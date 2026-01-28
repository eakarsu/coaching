import { Testimonial, Company } from '@prisma/client';

interface TestimonialsProps {
  testimonials: Testimonial[];
  companies: Company[];
}

export default function Testimonials({ testimonials, companies }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
            Client Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Leaders Who Transformed Their Impact
          </h2>
          <p className="text-xl text-gray-600">
            Hear from executives who have accelerated their growth and achieved remarkable results through coaching.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <svg className="w-10 h-10 text-blue-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold text-lg">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.title}{testimonial.company ? `, ${testimonial.company}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted By Section */}
        <div className="text-center pt-12 border-t border-gray-200">
          <p className="text-gray-500 mb-8 font-medium">Trusted by leaders from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {companies.map((company) => (
              <div key={company.id} className="text-gray-400 font-semibold text-lg">
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
