import { Stat } from '@prisma/client';

interface HeroProps {
  stats: Stat[];
}

export default function Hero({ stats }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-8">
            Trusted by 500+ Executives Worldwide
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Unlock Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Leadership Potential
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your leadership style, accelerate your career growth, and build high-performing teams with personalized executive coaching.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#booking"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              Schedule Free Consultation
            </a>
            <a
              href="#services"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              View Services
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10">
            {stats.map((stat) => (
              <div key={stat.id}>
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
