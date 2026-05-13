import { useNavigate, Link } from 'react-router-dom'
import {
  Shield,
  ArrowLeft,
  Tag,
  Sparkles,
  Star,
  Crown,
  Wallet,
  Info,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react'

const SUPPORT_EMAIL = 'crestapp@crest.city'
const LAST_UPDATED = 'May 13, 2026'

interface PricePlan {
  id: string
  icon: typeof Sparkles
  step: string
  title: string
  price: string
  currency: string
  badge?: string
  description: string
  includes: string[]
  note?: string
}

const PLANS: PricePlan[] = [
  {
    id: 'journey',
    icon: Sparkles,
    step: 'Step 1',
    title: 'Journey Access',
    price: '$100',
    currency: 'USD',
    badge: 'Required to begin',
    description:
      'The one-time fee that unlocks your six-week guided transformation journey inside the CrestApp. This is the starting point of the entire programme.',
    includes: [
      'Full access to all 6 weekly modules',
      'True Self Profile generation',
      'Fruit of the Spirit Map',
      'Shadow Map creation',
      'Access to community groups',
      'Private chat features',
      'Progress tracking across all stages',
      'Referral wallet activation',
    ],
    note: 'Paid once. No recurring charges. Unlocks the full journey experience.',
  },
  {
    id: 'crest_name',
    icon: Crown,
    step: 'Step 2',
    title: 'Crest Name Unlock',
    price: 'From $100',
    currency: 'USD',
    description:
      'After completing Week 5, you may unlock your personalised Crest Name, a symbolic identity earned through the journey. Available for single users or as a couple.',
    includes: [
      'Personalised Crest Name generation',
      'Symbolic identity document',
      'Name based on your profile and journey data',
    ],
    note: 'Single: $100 · Spouse/Couple: $100 per person. Exact fee is confirmed inside the app.',
  },
  {
    id: 'crest_celebration',
    icon: Star,
    step: 'Step 3',
    title: 'Crest Celebration',
    price: 'From $399',
    currency: 'USD',
    description:
      'A milestone celebration event to mark the completion of your journey and receiving of your Crest. Available as a single booking or as a couple/spouse booking.',
    includes: [
      'Celebration event booking',
      'Official Crest presentation',
      'Commemorative milestone experience',
      'Recognition within the CrestApp community',
    ],
    note: 'Single: $399 · Spouse/Couple: $699 for both.',
  },
]

const WALLET_ITEMS = [
  {
    label: 'Journey Referral',
    value: '25% distributed',
    detail: 'Shared among existing journey members when a new user pays the Journey fee via your referral.',
  },
  {
    label: 'Crest Celebration Referral',
    value: '50% distributed',
    detail: 'Shared among Crest celebration members when a new user pays for their Crest Celebration.',
  },
  {
    label: 'Withdrawal',
    value: 'On request',
    detail: 'Wallet balances can be withdrawn via the in-app withdrawal feature, subject to verification.',
  },
]

export default function PricingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-900/60 rounded-xl flex items-center justify-center">
            <Tag className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Pricing</h1>
            <p className="text-xs text-gray-500 mt-0.5">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed mt-6 mb-4">
          CrestApp is a guided six-week transformation programme. Payments are made directly
          inside the app at each milestone in your journey. There is no subscription and no
          recurring billing. This page explains every fee, what it covers, and when it applies.
        </p>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-brand-900/30 border border-brand-700/40 rounded-xl px-4 py-3 mb-10">
          <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-300">
            Payments are made <strong>inside the CrestApp</strong> at the relevant stage of your
            journey. You cannot purchase directly from this page. This is for information only.
          </p>
        </div>

        {/* Journey steps / pricing cards */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-1">Journey Payments</h2>
          <p className="text-sm text-gray-500 mb-6">
            Three milestone payments occur throughout the programme. Each is optional beyond the
            first, and each unlocks a specific experience.
          </p>

          <div className="space-y-5">
            {PLANS.map(({ id, icon: Icon, step, title, price, currency, badge, description, includes, note }) => (
              <div
                key={id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
              >
                {/* Card header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6 pb-5 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-900/60 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-brand-400 font-medium uppercase tracking-wider">
                          {step}
                        </span>
                        {badge && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-900/60 text-brand-300 border border-brand-700/50">
                            {badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white mt-0.5">{title}</h3>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-2xl font-extrabold text-white leading-none">{price}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{currency} · one-time</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-6 py-5 space-y-4">
                  <p className="text-sm text-gray-400 leading-relaxed">{description}</p>

                  <div>
                    <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      What's included
                    </p>
                    <ul className="space-y-1.5">
                      {includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {note && (
                    <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-800/60 rounded-lg px-3 py-2">
                      <AlertCircle className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                      {note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Referral wallet section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-lg font-semibold text-white">Referral Wallet</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            CrestApp includes an in-app wallet that earns rewards when others join the programme
            through your referral. There is no cost to participate. Earnings are distributed
            automatically.
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">
              <div className="w-9 h-9 bg-brand-900/60 rounded-xl flex items-center justify-center">
                <Wallet className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">How Wallet Earnings Work</p>
                <p className="text-xs text-gray-500">Automatic distributions, no action required</p>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {WALLET_ITEMS.map(({ label, value, detail }) => (
                <div key={label} className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
                  <div className="sm:w-48 flex-shrink-0">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-brand-400 font-semibold mt-0.5">{value}</p>
                  </div>
                  <p className="text-sm text-gray-400">{detail}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-800/40 border-t border-gray-800">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Wallet balances are in-app credits. They are not bank deposits and cannot be
                  transferred outside of CrestApp except via the in-app withdrawal process. The
                  distribution percentages are set by CrestApp and may be updated.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing notes */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Important Notes</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5 space-y-3">
            {[
              'All prices are shown in US Dollars (USD). The in-app payment system converts to your local currency via the payment provider.',
              'Prices are subject to change. The current fee for any purchase is always shown inside the app before payment.',
              'Payments are processed securely through Paystack. CrestApp does not store your card details.',
              'Each payment is a one-time charge for a specific feature or milestone. There are no subscriptions, auto-renewals, or hidden fees.',
              'The Crest Name and Crest Celebration purchases are optional. Completing the journey does not require them.',
              'For questions about a specific payment, contact us at support@crest.city.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-brand-400 mt-0.5 flex-shrink-0">•</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Refund policy link */}
        <div className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5">
          <div className="w-10 h-10 bg-brand-900/60 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">Refund Policy</p>
            <p className="text-sm text-gray-400 mb-3">
              All sales on CrestApp are for digital services and are generally non-refundable once
              access has been granted. See our full Refund Policy for details on eligibility,
              exceptions, and how to submit a request.
            </p>
            <Link
              to="/refund-policy"
              className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              Read Refund Policy →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} CrestApp. All rights reserved.</span>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-gray-400 transition-colors">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </footer>
    </div>
  )
}
