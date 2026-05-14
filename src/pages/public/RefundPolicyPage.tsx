import { useNavigate, Link } from 'react-router-dom'
import { Shield, ArrowLeft, RotateCcw, CheckCircle2, XCircle, Mail, AlertTriangle } from 'lucide-react'

const SUPPORT_EMAIL = 'crestapp@crest.city'
const LAST_UPDATED = 'May 13, 2026'

interface PolicySection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  numbered?: string[]
  trailingParagraphs?: string[]
  type?: 'eligible' | 'ineligible'
}

const SECTIONS: PolicySection[] = [
  {
    heading: '1. Overview',
    paragraphs: [
      'CrestApp provides digital services, including access to a six-week guided transformation journey, personalised identity maps, and related digital features. All purchases are processed securely by Paddle.',
      'This policy explains your refund rights, including the 14-day withdrawal period required under applicable consumer laws.',
    ],
  },
  {
    heading: '2. 14-Day Right to Withdraw',
    paragraphs: [
      'If you are a consumer residing in the EU, EEA, UK, or any region where a statutory cooling-off period applies, you have the right to withdraw from your purchase within 14 days of completing the transaction.',
      'To exercise this right, you must contact Paddle directly using the instructions in your purchase confirmation email.',
      'Important: If you choose to access or begin using CrestApp\'s digital content during this 14-day period, you may be asked to confirm that you agree for the service to begin immediately. Once you agree and access begins, you may lose your right to withdraw.',
      'This process is managed by Paddle in accordance with their Buyer Terms.',
    ],
  },
  {
    heading: '3. Refunds Outside the 14-Day Withdrawal Period',
    type: 'eligible',
    paragraphs: [
      'After the 14-day withdrawal period has passed, refunds may still be considered in limited cases, including:',
    ],
    bullets: [
      'Duplicate payment',
      'Payment processed but access not granted',
      'Verified unauthorised transaction',
      'Verified technical failure preventing access',
    ],
    trailingParagraphs: [
      'All such requests are handled by Paddle as the Merchant of Record.',
    ],
  },
  {
    heading: '4. How to Request a Refund',
    paragraphs: [
      'All refund requests must be submitted directly to Paddle, using the link provided in your purchase confirmation email or via Paddle\'s support page.',
      'Please include:',
    ],
    bullets: [
      'The email used for your purchase',
      'The transaction receipt or order number',
      'A brief description of your request',
    ],
    trailingParagraphs: [
      'Paddle will review your request and process any approved refund to your original payment method.',
    ],
  },
  {
    heading: '5. Non-Refundable Situations',
    type: 'ineligible',
    paragraphs: [
      'In line with Paddle\'s Buyer Terms, refunds may not be granted if:',
    ],
    bullets: [
      'You continue using the digital service after agreeing to immediate access',
      'You request a refund outside the 14-day withdrawal period (unless eligible under Section 3)',
      'The transaction was completed by a business entity (business purchases may not qualify for consumer withdrawal rights)',
    ],
  },
  {
    heading: '6. Contact',
    paragraphs: [
      'For questions about your purchase or refund status, please contact Paddle using the details in your receipt.',
      `For general support with CrestApp features, email: ${SUPPORT_EMAIL}`,
    ],
  },
  {
    heading: '7. Changes to This Policy',
    paragraphs: [
      'CrestApp may update this Refund Policy from time to time. The updated version will apply to purchases made after the revision date shown above.',
    ],
  },
]

function BulletList({ bullets, type }: { bullets: string[]; type?: 'eligible' | 'ineligible' }) {
  const Icon = type === 'eligible' ? CheckCircle2 : type === 'ineligible' ? XCircle : null
  const iconColor = type === 'eligible' ? 'text-green-400' : type === 'ineligible' ? 'text-red-400' : 'text-brand-400'

  return (
    <ul className="space-y-2">
      {bullets.map((b, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
          {Icon ? (
            <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0 mt-0.5`} />
          ) : (
            <span className="text-brand-400 mt-0.5 flex-shrink-0">•</span>
          )}
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

function ContactCard() {
  return (
    <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
      <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 group">
        <div className="w-9 h-9 bg-brand-900/60 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-800/60 transition-colors">
          <Mail className="w-4 h-4 text-brand-400" />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">Email Support</p>
          <span className="text-brand-400 font-semibold group-hover:text-brand-300 transition-colors text-sm underline underline-offset-2">
            {SUPPORT_EMAIL}
          </span>
        </div>
      </a>
    </div>
  )
}

function PolicySection({ section }: { section: PolicySection }) {
  const isContactSection = section.heading.toLowerCase().includes('contact')

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-white">{section.heading}</h2>

      {section.paragraphs?.map((p, i) => (
        <p key={i} className="text-sm text-gray-400 leading-relaxed">{p}</p>
      ))}

      {section.bullets && <BulletList bullets={section.bullets} type={section.type} />}

      {section.numbered && (
        <ol className="space-y-2">
          {section.numbered.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-400">
              <span className="text-brand-400 font-medium flex-shrink-0 w-4">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ol>
      )}

      {section.trailingParagraphs?.map((p, i) => (
        <p key={i} className="text-sm text-gray-400 leading-relaxed">{p}</p>
      ))}

      {isContactSection && <ContactCard />}
    </div>
  )
}

export default function RefundPolicyPage() {
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
            <RotateCcw className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Refund Policy</h1>
            <p className="text-xs text-gray-500 mt-0.5">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed mt-6 mb-4">
          This Refund Policy applies to all purchases made through CrestApp and processed by Paddle,
          our authorised reseller and Merchant of Record. By completing a purchase, you agree to
          this policy and to Paddle's Buyer Terms.
        </p>

        {/* Summary banner */}
        <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-700/40 rounded-xl px-4 py-3 mb-8">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300/90">
            <strong>Summary:</strong> CrestApp purchases are processed by Paddle. Consumers in the
            EU, EEA, and UK have a 14-day right to withdraw. After this period, refunds are only
            considered in limited cases such as duplicate charges, undelivered access, or verified
            technical failures.
          </p>
        </div>

        {/* Quick reference: eligible vs ineligible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <p className="text-sm font-semibold text-white">May Qualify for Refund</p>
            </div>
            <ul className="space-y-1.5">
              {[
                '14-day withdrawal (EU/EEA/UK)',
                'Duplicate payment error',
                'Paid but access not granted',
                'Verified technical failure',
              ].map((item, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                  <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm font-semibold text-white">Not Eligible for Refund</p>
            </div>
            <ul className="space-y-1.5">
              {[
                'Used service after confirming immediate access',
                'Outside 14-day period (see Section 3)',
                'Business entity purchases',
              ].map((item, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Full policy sections */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-8 space-y-8 divide-y divide-gray-800">
          {SECTIONS.map((section) => (
            <div key={section.heading} className="pt-8 first:pt-0">
              <PolicySection section={section} />
            </div>
          ))}
        </div>

        {/* Link to pricing */}
        <div className="mt-8 flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5">
          <div className="w-9 h-9 bg-brand-900/60 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">About Our Pricing</p>
            <p className="text-sm text-gray-400 mb-2">
              See a full breakdown of every fee, what it covers, and when it is charged.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              View Pricing →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} CrestApp. All rights reserved.</span>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-gray-400 transition-colors">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </footer>
    </div>
  )
}
