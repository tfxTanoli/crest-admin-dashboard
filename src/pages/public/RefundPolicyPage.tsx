import { useNavigate, Link } from 'react-router-dom'
import { Shield, ArrowLeft, RotateCcw, CheckCircle2, XCircle, Mail, Phone, AlertTriangle } from 'lucide-react'

const SUPPORT_EMAIL = 'crestapp@crest.city'
const PHONE = '+2349025767556'
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
      'CrestApp provides digital services, including access to a six-week guided transformation programme, personalised outputs, community features, and milestone experiences. Because these are digital products that are delivered immediately upon purchase, all sales are generally final.',
      'This policy explains when refunds may be considered, how to request one, and the timeframes involved.',
    ],
  },
  {
    heading: '2. General Refund Rule',
    paragraphs: [
      'All payments made inside CrestApp are for digital services. Once access to a feature or experience has been granted, the purchase is considered delivered and is non-refundable.',
      'This applies to:',
    ],
    bullets: [
      'Journey Access ($100): once unlocked and access to Week 1 content is granted',
      'Crest Name Unlock: once the Crest Name has been generated and shown to the user',
      'Crest Celebration: once a booking has been confirmed and a celebration slot reserved',
    ],
    trailingParagraphs: [
      'By completing a payment inside CrestApp, you acknowledge that the digital service is delivered immediately and that you have forfeited your right to a cooling-off period for that purchase.',
    ],
  },
  {
    heading: '3. Eligible Refund Circumstances',
    type: 'eligible',
    paragraphs: [
      'A refund may be considered in the following limited circumstances:',
    ],
    bullets: [
      'Duplicate payment: you were charged more than once for the same purchase due to a technical error',
      'Payment processed but access not granted: you were charged but the feature was never unlocked within 24 hours',
      'Unauthorised transaction: a payment was made on your account without your knowledge or consent (subject to investigation)',
      'Technical failure: a verified platform failure prevented you from using a paid feature, and no reasonable alternative was offered',
    ],
    trailingParagraphs: [
      'All eligible refund requests are subject to investigation. CrestApp reserves the right to request supporting evidence before approving any refund.',
    ],
  },
  {
    heading: '4. Non-Refundable Circumstances',
    type: 'ineligible',
    paragraphs: [
      'The following are not eligible for refunds under any circumstances:',
    ],
    bullets: [
      'You changed your mind after purchasing',
      'You did not complete the programme after purchasing Journey Access',
      'You were dissatisfied with your personalised outputs (Crest Name, profile maps)',
      'You were unable to attend a Crest Celebration after confirmation',
      'Your account was suspended or terminated due to violation of our Terms & Conditions',
      'Wallet earnings or referral rewards: these are not purchases and are not refundable',
      'Partial use: you used part of a feature or stage before requesting a refund',
    ],
  },
  {
    heading: '5. Refund Request Timeframe',
    paragraphs: [
      'Refund requests must be submitted within 7 days of the payment date. Requests submitted after this window will not be considered, except in cases of ongoing unauthorised access or verified fraud.',
    ],
  },
  {
    heading: '6. How to Request a Refund',
    paragraphs: ['To submit a refund request, follow these steps:'],
    numbered: [
      'Email crestapp@crest.city with the subject line: "Refund Request - [Your Name]"',
      'Include your registered account email address',
      'Describe the reason for the request and the payment you believe qualifies',
      'Attach any supporting evidence (e.g., payment confirmation, screenshots)',
      'Our team will acknowledge your request within 2 business days',
      'If approved, the refund will be processed within 5–10 business days to your original payment method',
    ],
    trailingParagraphs: [
      'Refunds are issued to the original payment method used. We cannot issue refunds to a different card or account.',
    ],
  },
  {
    heading: '7. Payment Platform Disputes',
    paragraphs: [
      'Payments on CrestApp are processed through Paystack, a secure third-party payment provider. If you believe a charge was fraudulent or unauthorised, you may also contact your card issuer or bank directly.',
      'Please note: initiating a chargeback without first contacting CrestApp support may result in the suspension of your account pending investigation.',
    ],
  },
  {
    heading: '8. Wallet Balances',
    paragraphs: [
      'In-app wallet balances are referral rewards, not purchases. They are not subject to this refund policy. Wallet balances can be withdrawn via the in-app withdrawal feature.',
      'If a wallet balance was incorrectly adjusted due to a technical error, contact our support team and we will investigate.',
    ],
  },
  {
    heading: '9. Changes to This Policy',
    paragraphs: [
      'CrestApp may update this Refund Policy from time to time. The updated policy will apply to purchases made after the revision date shown at the top of this page. Continued use of the app constitutes acceptance of the current policy.',
    ],
  },
  {
    heading: '10. Contact Us',
    paragraphs: ['For refund requests or questions about this policy, reach out to our support team:'],
    bullets: [`Email: ${SUPPORT_EMAIL}`, `Phone: ${PHONE}`],
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
      <a href={`tel:${PHONE}`} className="flex items-center gap-3 group">
        <div className="w-9 h-9 bg-brand-900/60 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-800/60 transition-colors">
          <Phone className="w-4 h-4 text-brand-400" />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-0.5">Phone</p>
          <span className="text-brand-400 font-semibold group-hover:text-brand-300 transition-colors text-sm">
            {PHONE}
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
          This Refund Policy applies to all purchases made inside the CrestApp mobile application.
          Please read it carefully before making any payment. By completing a purchase, you agree
          to this policy.
        </p>

        {/* Summary banner */}
        <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-700/40 rounded-xl px-4 py-3 mb-8">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300/90">
            <strong>Summary:</strong> CrestApp sells digital services delivered immediately upon
            purchase. Sales are generally final. Refunds are only considered for duplicate
            charges, undelivered access, or unauthorised transactions, and must be requested
            within 7 days.
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
                'Duplicate payment error',
                'Paid but access not granted',
                'Unauthorised transaction',
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
                'Changed your mind',
                'Did not complete journey',
                'Unhappy with outputs',
                'Account suspended/banned',
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
