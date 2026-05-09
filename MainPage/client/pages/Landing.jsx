import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Landing.css';

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group card-3d card-hover depth-float bg-gradient-to-br from-white to-gray-50 animate-fade-in hover:-translate-y-1 hover:shadow-2xl" style={{ animationDuration: '0.7s' }}>
      <div className="text-5xl mb-4 transform transition-transform group-hover:scale-110">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div className="bubble-global">
        <div className="bubble" style={{ width: '220px', height: '220px', top: '8%', left: '6%', background: 'radial-gradient(circle, rgba(129,179,255,0.85) 0%, rgba(129,179,255,0.10) 60%, transparent 100%)' }} />
        <div className="bubble glow" style={{ width: '260px', height: '260px', top: '18%', right: '10%', background: 'radial-gradient(circle, rgba(238,132,255,0.8) 0%, rgba(238,132,255,0.12) 55%, transparent 100%)' }} />
        <div className="bubble" style={{ width: '160px', height: '160px', bottom: '15%', left: '20%', background: 'radial-gradient(circle, rgba(164,247,226,0.8) 0%, rgba(164,247,226,0.12) 55%, transparent 100%)' }} />
        <div className="bubble glow" style={{ width: '200px', height: '200px', bottom: '20%', right: '18%', background: 'radial-gradient(circle, rgba(169,204,255,0.85) 0%, rgba(169,204,255,0.12) 55%, transparent 100%)' }} />
        <div className="bubble" style={{ width: '280px', height: '280px', top: '60%', left: '60%', background: 'radial-gradient(circle, rgba(254,241,96,0.75) 0%, rgba(254,241,96,0.08) 55%, transparent 100%)' }} />
        <div className="pulse-core" style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      </div>
      <div className="bottom-flares">
        <div className="flare" />
        <div className="flare" />
        <div className="flare" />
      </div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 perspective-window">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-cyan-300 via-blue-300 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2s" />
        <div className="bubble glow" style={{ width: '180px', height: '180px', top: '14%', left: '8%' }} />
        <div className="bubble" style={{ width: '120px', height: '120px', top: '24%', right: '16%' }} />
        <div className="bubble glow" style={{ width: '230px', height: '230px', bottom: '16%', left: '10%' }} />
        <div className="bubble" style={{ width: '130px', height: '130px', bottom: '14%', right: '14%' }} />
        <div className="pulse-core" style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }} />

        <div className="relative max-w-screen-xl xl:max-w-screen-2xl mx-auto text-center">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 sm:opacity-25">
              <div className="w-80 h-80 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 blur-3xl animate-blob" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 md:mb-8 leading-tight animate-fade-in">
              The Platform Built for{' '}
              <span className="animate-gradient-text">
                Developers
              </span>
            </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Codexia combines community discussions, code sharing, coding problems, and real-time chat in one unified
            platform for programmers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 md:mb-20">
            <Link
              to="/register"
              className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-all hover:shadow-2xl hover:shadow-black/30 transform hover:scale-105 text-sm sm:text-base md:text-lg animate-fade-in animate-shimmer"
              style={{ animationDelay: '0.2s' }}
            >
              Start Building
            </Link>
            <Link
              to="/login"
              className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 border-2 border-gray-800 text-gray-900 font-bold rounded-lg hover:border-black hover:bg-black hover:text-white transition-all hover:shadow-lg text-sm sm:text-base md:text-lg animate-fade-in"
              style={{ animationDelay: '0.25s' }}
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto mb-8">
            <div className="card-3d depth-float p-4 sm:p-6 animate-float" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl sm:text-4xl font-black text-black">50K+</div>
              <p className="text-sm sm:text-base text-gray-600 font-semibold mt-2">Active Developers</p>
            </div>
            <div className="card-3d depth-float p-4 sm:p-6 animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl sm:text-4xl font-black text-black">100K+</div>
              <p className="text-sm sm:text-base text-gray-600 font-semibold mt-2">Discussions</p>
            </div>
            <div className="card-3d depth-float p-4 sm:p-6 animate-float" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl sm:text-4xl font-black text-black">1K+</div>
              <p className="text-sm sm:text-base text-gray-600 font-semibold mt-2">Problems</p>
            </div>
            <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-teal-300 opacity-40 animate-blob" />
            <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-purple-300 opacity-40 animate-blob animate-shimmer" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-2 sm:px-4 lg:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 sm:mb-4 md:mb-6">Everything You Need</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              A complete platform for discussions, code sharing, problem solving, and community building
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <FeatureCard
              icon="💬"
              title="Community Discussions"
              description="Join or create communities, share ideas, and engage in meaningful discussions with fellow developers."
            />
            <FeatureCard
              icon="📝"
              title="Post & Share Code"
              description="Create rich posts with styled code blocks, snippets, and technical insights for the community."
            />
            <FeatureCard
              icon="🧵"
              title="Nested Comments"
              description="Deep reply threads with multi-level comments, visual indentation, and thread collapse functionality."
            />
            <FeatureCard
              icon="⚡"
              title="Voting System"
              description="Upvote and downvote posts and comments. Earn reputation points for contributions."
            />
            <FeatureCard
              icon="🎯"
              title="Coding Problems"
              description="Solve algorithmic problems, submit solutions, and track your submission history."
            />
            <FeatureCard
              icon="💬"
              title="Real-time Chat"
              description="Community chat channels for instant discussions and networking with other developers."
            />
          </div>
        </div>
      </section>

      {/* Developer Focused Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-screen-xl xl:max-w-screen-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 border-2 border-gray-400 hover:border-black hover:shadow-2xl hover:shadow-black/15 transition-all">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-5 md:mb-6 text-gray-900">Built by developers, for developers</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-7 md:mb-8 leading-relaxed">
              Codexia is designed with developers in mind. We understand your needs for clean code sharing, reputation
              building, and community engagement all in one place.
            </p>
            <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-9 md:mb-10">
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-black font-bold text-lg sm:text-xl mt-0.5">✓</span>
                <span className="text-gray-700 text-sm sm:text-base md:text-lg">Clean, minimalist interface optimized for focus</span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-black font-bold text-lg sm:text-xl mt-0.5">✓</span>
                <span className="text-gray-700 text-sm sm:text-base md:text-lg">Syntax-highlighted code blocks</span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-black font-bold text-lg sm:text-xl mt-0.5">✓</span>
                <span className="text-gray-700 text-sm sm:text-base md:text-lg">Reputation system to recognize expertise</span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-black font-bold text-lg sm:text-xl mt-0.5">✓</span>
                <span className="text-gray-700 text-sm sm:text-base md:text-lg">Role-based features (User, Moderator, Admin)</span>
              </li>
            </ul>
            <Link to="/register" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-3">
              Join the Community Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-300 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto text-center text-gray-600 text-xs sm:text-sm md:text-base">
          <p>© 2024 Codexia. Built with passion for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
}
