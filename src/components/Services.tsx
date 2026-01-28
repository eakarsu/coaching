import { Service, AdditionalService } from '@prisma/client';

interface ServicesProps {
  services: Service[];
  additionalServices: AdditionalService[];
}

const iconMap: Record<string, JSX.Element> = {
  video: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  building: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  lightbulb: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  clipboard: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
};

export default function Services({ services, additionalServices }: ServicesProps) {
  // Show only top 3 services for pricing display
  const displayServices = services.slice(0, 3);

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
            Services & Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Coaching Programs Designed for Results
          </h2>
          <p className="text-xl text-gray-600">
            Choose the coaching program that aligns with your goals and watch your leadership capabilities soar.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                service.popular ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{service.price}</span>
                  <span className="text-gray-500 ml-2">/ {service.duration}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#booking"
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-colors ${
                    service.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Additional Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {additionalServices.map((service) => (
              <div key={service.id} className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {iconMap[service.iconName] || iconMap.lightbulb}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
