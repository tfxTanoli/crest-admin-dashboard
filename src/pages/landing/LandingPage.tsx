import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  Users,
  Wallet,
  MessageSquare,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  Lock,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const features = [
  {
    icon: Sparkles,
    title: '6-Week Transformation Journey',
    description:
      'A guided six-week programme that takes users through self-discovery, reflection, and personal growth milestones.',
  },
  {
    icon: Star,
    title: 'Personalized Crest & Crest Name',
    description:
      'Each user earns a unique Crest and Crest Name that symbolises their true identity, unlocked through the journey.',
  },
  {
    icon: Users,
    title: 'Community & Group Chat',
    description:
      'A built-in community where users connect, share reflections, and grow together in private and group spaces.',
  },
  {
    icon: Wallet,
    title: 'Referral Wallet System',
    description:
      'A shareable in-app wallet that rewards users for bringing others into the CrestApp community.',
  },
  {
    icon: Globe,
    title: 'True Self Profile',
    description:
      'Generates a personalised True Self Profile, Fruit of the Spirit Map, and Shadow Map for every user.',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description:
      'Your data is encrypted, stored securely, and never sold. We follow industry-standard privacy practices.',
  },
]

const highlights = [
  'No credit card required to start',
  'Works on iOS and Android',
  'Progress saved automatically',
  'Community support at every stage',
]

const weekLabels = ['Foundation', 'Identity', 'Shadow Work', 'Community', 'Crest Reveal', 'True Self']

export default function LandingPage() {
  const navigate = useNavigate()
  const { admin, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && admin) {
      navigate('/dashboard', { replace: true })
    }
  }, [admin, loading, navigate])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">CrestApp</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            Admin Login
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-900/50 border border-brand-700/50 text-brand-400 text-xs font-medium mb-6">
              <Sparkles className="w-3 h-3" />
              Begin Your 6-Week Journey
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Discover Your
              <span className="text-brand-400"> True Self</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              CrestApp is a guided six-week transformation experience that helps you uncover your
              identity, build community, and earn your unique Crest Name through reflection and growth.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              {highlights.map((h) => (
                <span key={h} className="flex items-center gap-1.5 text-sm text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  {h}
                </span>
              ))}
            </div>
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-brand-600 hover:bg-brand-700 rounded-xl text-white font-semibold text-base transition-colors shadow-lg shadow-brand-900/50 cursor-default">
              <Shield className="w-5 h-5" />
              Available on iOS & Android
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Everything You Need to Grow</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              CrestApp bundles a structured journey, a thriving community, and a reward system into
              one seamless experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-brand-700/60 transition-colors group"
              >
                <div className="w-10 h-10 bg-brand-900/60 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-800/60 transition-colors">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Journey Steps */}
        <section className="border-y border-gray-800 bg-gray-900/40">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-3">Your 6-Week Path</h2>
              <p className="text-gray-400">Each week unlocks new insights, challenges, and rewards.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {weekLabels.map((label, i) => (
                <div
                  key={label}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
                >
                  <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-2">
                    {i + 1}
                  </div>
                  <p className="text-xs font-semibold text-white mb-0.5">Week {i + 1}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Shield className="w-4 h-4 text-brand-600" />
            <span>© {new Date().getFullYear()} CrestApp. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/csae" className="hover:text-gray-300 transition-colors">
              Child Safety Standards
            </Link>
            <span className="text-gray-700">|</span>
            <a href="tel:+2349025767556" className="hover:text-gray-300 transition-colors">
              +234 902 576 7556
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
