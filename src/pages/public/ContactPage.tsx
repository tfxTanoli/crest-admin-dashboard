import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, Mail, Phone, Globe, MessageCircle } from 'lucide-react'

const SUPPORT_EMAIL = 'support@crest.city'
const PHONE = '+2349025767556'
const WEBSITE = 'www.crestapp.com'

export default function ContactPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-400" />
            <span className="font-semibold text-sm">CrestApp</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-900/60 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Support & Contact</h1>
            <p className="text-xs text-gray-500 mt-0.5">We're here to help</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed mt-6 mb-8">
          Have a question, concern, or need help with your CrestApp account? Our support team is ready to assist you. Reach out via any of the channels below.
        </p>

        {/* Contact cards */}
        <div className="space-y-4 mb-8">
          {/* Email — most prominent */}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-brand-700/60 transition-colors group"
          >
            <div className="w-12 h-12 bg-brand-900/60 rounded-xl flex items-center justify-center group-hover:bg-brand-800/60 transition-colors flex-shrink-0">
              <Mail className="w-6 h-6 text-brand-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Email Support</p>
              <p className="text-lg font-bold text-brand-400 group-hover:text-brand-300 transition-colors break-all sm:break-normal">
                {SUPPORT_EMAIL}
              </p>
              <p className="text-xs text-gray-500 mt-1">Tap to send us an email</p>
            </div>
          </a>

          {/* Phone */}
          <a
            href={`tel:${PHONE}`}
            className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-brand-700/60 transition-colors group"
          >
            <div className="w-12 h-12 bg-brand-900/60 rounded-xl flex items-center justify-center group-hover:bg-brand-800/60 transition-colors flex-shrink-0">
              <Phone className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Phone</p>
              <p className="text-lg font-bold text-brand-400 group-hover:text-brand-300 transition-colors">
                {PHONE}
              </p>
            </div>
          </a>

          {/* Website */}
          <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 bg-brand-900/60 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Website</p>
              <p className="text-lg font-bold text-white">{WEBSITE}</p>
            </div>
          </div>
        </div>

        {/* Common support topics */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Common Support Topics</h2>
          <ul className="space-y-2.5">
            {[
              'Account access and login issues',
              'Payment and wallet questions',
              'Programme progress and stage unlocks',
              'Account deletion requests',
              'Data privacy and removal requests',
              'Technical issues and bug reports',
              'Community and chat questions',
            ].map((topic, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} CrestApp. All rights reserved.</span>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-gray-400 transition-colors">{SUPPORT_EMAIL}</a>
        </div>
      </footer>
    </div>
  )
}
