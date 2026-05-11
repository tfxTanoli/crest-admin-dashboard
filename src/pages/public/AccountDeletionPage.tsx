import { Link, useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, Trash2, AlertTriangle, CheckCircle2, Mail, Smartphone, Info } from 'lucide-react'

const SUPPORT_EMAIL = 'crestapp@crest.city'

export default function AccountDeletionPage() {
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
          <div className="w-10 h-10 bg-red-900/40 border border-red-800/50 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Account Deletion</h1>
            <p className="text-xs text-gray-500 mt-0.5">Permanent account removal</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed mt-6 mb-6">
          You have the right to delete your CrestApp account and all associated personal data at any time.
          This page explains how to request account deletion and what happens to your data.
        </p>

        {/* Warning banner */}
        <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-5 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300 mb-1">This action is permanent and cannot be undone.</p>
            <p className="text-sm text-red-400/80 leading-relaxed">
              Once your account is deleted, your profile, progress, wallet balance, and login credentials
              will be permanently removed and cannot be recovered.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-8 space-y-8 divide-y divide-gray-800">

          {/* In-app deletion steps */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-brand-900/60 rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4 h-4 text-brand-400" />
              </div>
              <h2 className="text-base font-semibold text-white">How to Delete Your Account (In-App)</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Account deletion is available directly within the CrestApp mobile application. Follow these steps:
            </p>
            <ol className="space-y-3 mt-2">
              {[
                'Open the CrestApp mobile application and sign in to your account',
                'Tap the Edit Profile button (pencil icon) on your dashboard',
                'Scroll to the bottom of the Edit Profile screen',
                'Tap "Delete Account" in the Danger Zone section',
                'Read the warning carefully — review what data will be permanently deleted',
                'Enter your account password to confirm your identity',
                'Tap "Delete My Account" — your account is permanently removed immediately',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-brand-600/20 border border-brand-600/40 rounded-full flex items-center justify-center text-xs font-bold text-brand-400 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-400 leading-relaxed">{text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* What gets deleted */}
          <div className="pt-8 space-y-4">
            <h2 className="text-base font-semibold text-white">What Data Is Permanently Deleted</h2>
            <p className="text-sm text-gray-400">Upon account deletion, the following data is immediately and permanently removed:</p>
            <ul className="space-y-2">
              {[
                'Your account profile (name, email address, spiritual name)',
                'Your crest selection and any custom crest images',
                'Your journey progress across all six programme weeks',
                'Your wallet balance and in-app transaction history',
                'Your account login credentials and authentication data',
                'Your personal reflections, journal entries, and shadow logs',
                'Your group memberships and chat invitation history',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What may remain */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-gray-500" />
              <h2 className="text-base font-semibold text-white">What May Be Retained</h2>
            </div>
            <p className="text-sm text-gray-400">
              Some data may be retained in anonymised or aggregated form for legal and operational reasons:
            </p>
            <ul className="space-y-2">
              {[
                'Chat messages sent in community groups — displayed as "Deleted User", not linked to you',
                'Anonymised transaction records required for financial compliance and audit trails',
                'Aggregated, non-identifiable usage analytics that cannot be traced back to you',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <Info className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Email request alternative */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-brand-900/60 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-brand-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Alternative: Request Via Email</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              If you cannot access the app or prefer to submit a deletion request by email, contact our
              support team directly:
            </p>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Support Email</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Account Deletion Request`}
                className="text-brand-400 font-semibold hover:text-brand-300 transition-colors underline underline-offset-2 text-sm"
              >
                {SUPPORT_EMAIL}
              </a>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Please include your registered email address and full name in your deletion request.
                Email deletion requests are processed within <strong className="text-gray-400">30 days</strong>.
              </p>
            </div>
          </div>

          {/* Processing times */}
          <div className="pt-8 space-y-3">
            <h2 className="text-base font-semibold text-white">Processing Times</h2>
            <ul className="space-y-2">
              {[
                { label: 'In-app deletion', detail: 'Immediate — your account is removed within seconds' },
                { label: 'Email deletion requests', detail: 'Processed within 30 days of receiving your request' },
                { label: 'Financial compliance records', detail: 'Retained for legally required periods in anonymised form' },
              ].map(({ label, detail }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-400">
                  <span className="text-brand-400 mt-0.5 flex-shrink-0">•</span>
                  <span><strong className="text-gray-300 font-medium">{label}:</strong> {detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          <span className="text-gray-700">|</span>
          <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact Support</Link>
          <span className="text-gray-700">|</span>
          <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms & Conditions</Link>
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
