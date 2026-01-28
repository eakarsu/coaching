export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
              {/* Placeholder for coach photo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto bg-blue-300 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <p className="text-blue-600 font-medium">Add your professional photo here</p>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-600 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-xl -z-10" />
          </div>

          {/* Content Column */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
              About Your Coach
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Helping Leaders Achieve Extraordinary Results
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              With over 15 years of experience in executive coaching and leadership development, I have helped hundreds of leaders transform their careers and organizations. My approach combines proven methodologies with personalized strategies tailored to your unique challenges.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Prior to coaching, I spent two decades in C-suite roles at Fortune 500 companies, giving me firsthand understanding of the pressures and opportunities that executives face daily.
            </p>

            {/* Credentials */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">ICF Certified</div>
                  <div className="text-sm text-gray-500">Master Certified Coach</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">MBA, Harvard</div>
                  <div className="text-sm text-gray-500">Business Administration</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">20+ Years</div>
                  <div className="text-sm text-gray-500">Corporate Leadership</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">500+ Clients</div>
                  <div className="text-sm text-gray-500">Successfully Coached</div>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Get in touch
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
