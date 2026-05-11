import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, FileText, BookOpen, ShieldAlert } from 'lucide-react'

type LegalDocType = 'privacy_policy' | 'terms_conditions' | 'csae_policy'

interface Props {
  type: LegalDocType
}

const LAST_UPDATED = 'May 10, 2026'
const SUPPORT_EMAIL = 'support@crestapp.com'
const PHONE = '+2349025767556'
const WEBSITE = 'www.crestapp.com'

// ─── Section types ────────────────────────────────────────────────────────────

interface BulletGroup {
  intro?: string
  bullets: string[]
}

interface Subsection {
  title: string
  bullets: string[]
}

interface Section {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  bulletGroups?: BulletGroup[]
  numbered?: string[]
  subsections?: Subsection[]
  trailingParagraphs?: string[]
}

// ─── Privacy Policy ───────────────────────────────────────────────────────────

const PRIVACY_SECTIONS: Section[] = [
  {
    heading: '1. Information We Collect',
    paragraphs: ['We collect only the information necessary to provide and improve the CrestApp experience.'],
    subsections: [
      {
        title: 'a. Information You Provide',
        bullets: [
          'Account details (name, email, phone number)',
          "Profile inputs used to generate your True Self Profile, Fruit of the Spirit Map, Shadow Map, and Crest Name",
          "Chat messages within the app's community or support features",
          'Journey progress data (completed tasks, milestones, reflections)',
        ],
      },
      {
        title: 'b. Automatically Collected Information',
        bullets: [
          'Device information (model, OS version, unique identifiers)',
          'Log data (IP address, app activity, timestamps)',
          'Usage analytics to improve app performance and user experience',
        ],
      },
      {
        title: 'c. Financial & Wallet Information',
        bullets: [
          'Wallet balance',
          'Referral activity',
          'Transaction history (non bank, in app only)',
        ],
      },
    ],
    trailingParagraphs: ['We do NOT collect or store bank account numbers, debit cards, or payment card details.'],
  },
  {
    heading: '2. How We Use Your Information',
    paragraphs: ['We use your information to:'],
    bullets: [
      'Provide the six week transformation journey',
      'Generate personalized outputs (profiles, maps, crest, Crest Name)',
      'Track your progress and unlock stages',
      'Enable chat and community interactions',
      'Maintain your wallet and referral rewards',
      'Improve app performance and user experience',
      'Provide customer support',
      'Ensure safety, security, and fraud prevention',
    ],
    trailingParagraphs: ['We do not sell your personal information.'],
  },
  {
    heading: '3. How We Share Your Information',
    paragraphs: ['We may share information only in the following cases:'],
    bullets: [
      'Service Providers: analytics, cloud hosting, authentication',
      'Legal Compliance: if required by law, regulation, or court order',
      'Security: to prevent fraud, abuse, or threats to users',
    ],
    trailingParagraphs: ['We never sell or rent your data to advertisers or third parties.'],
  },
  {
    heading: '4. Data Storage & Security',
    paragraphs: ['We use industry standard security measures to protect your data, including:'],
    bullets: [
      'Encrypted communication (HTTPS)',
      'Secure cloud storage',
      'Access controls and authentication',
    ],
    trailingParagraphs: ['While we strive to protect your information, no method of transmission or storage is 100% secure.'],
  },
  {
    heading: '5. Data Retention',
    paragraphs: ['We retain your information only as long as necessary to:'],
    bullets: [
      'Provide the CrestApp service',
      'Comply with legal obligations',
      'Resolve disputes',
    ],
    trailingParagraphs: ['You may request deletion of your data at any time.'],
  },
  {
    heading: '6. Your Rights',
    paragraphs: ['Depending on your region, you may have the right to:'],
    bullets: [
      'Access your data',
      'Correct inaccurate information',
      'Request deletion',
      'Withdraw consent',
      'Export your data',
    ],
    trailingParagraphs: [`To exercise these rights, contact us at: ${SUPPORT_EMAIL}`],
  },
  {
    heading: "7. Children's Privacy",
    paragraphs: [
      'CrestApp is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided information, contact us and we will delete it promptly.',
    ],
  },
  {
    heading: '8. Third Party Services',
    paragraphs: ['CrestApp may use third party tools such as:'],
    bullets: [
      'Analytics providers',
      'Cloud hosting services',
      'Authentication services',
    ],
    trailingParagraphs: ['These providers have their own privacy policies. We ensure they meet industry standards for data protection.'],
  },
  {
    heading: '9. International Users',
    paragraphs: [
      'Your information may be processed in countries outside your own. By using CrestApp, you consent to this transfer.',
    ],
  },
  {
    heading: '10. Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. We will notify you of changes by updating the "Last Updated" date.',
    ],
  },
  {
    heading: '11. Contact Us',
    paragraphs: ['If you have questions or concerns about this Privacy Policy, contact us at:'],
    bullets: [`Email: ${SUPPORT_EMAIL}`, `Website: ${WEBSITE}`, `Phone: ${PHONE}`],
  },
]

// ─── Terms & Conditions ───────────────────────────────────────────────────────

const TERMS_SECTIONS: Section[] = [
  {
    heading: '1. Eligibility',
    paragraphs: [
      'You must be at least 18 years old to use CrestApp. By using the App, you represent that you meet this requirement.',
    ],
  },
  {
    heading: '2. Use of the App',
    paragraphs: [
      'CrestApp provides a six week guided transformation journey, personalized outputs, community features, and a shareable wallet system. You agree to use the App only for lawful purposes and in accordance with these Terms.',
      'You agree not to:',
    ],
    bullets: [
      'Use the App for fraudulent or harmful activities',
      "Interfere with the App's functionality",
      'Attempt to access accounts or data that do not belong to you',
      'Upload harmful, abusive, or inappropriate content',
    ],
    trailingParagraphs: ['We may suspend or terminate your access if you violate these Terms.'],
  },
  {
    heading: '3. Account Registration',
    paragraphs: ['To use certain features, you may need to create an account. You agree to:'],
    bullets: [
      'Provide accurate information',
      'Keep your login details secure',
      'Notify us immediately of unauthorized access',
    ],
    trailingParagraphs: ['You are responsible for all activity under your account.'],
  },
  {
    heading: '4. Wallet & Referral Rewards',
    paragraphs: [
      'CrestApp includes a shareable wallet that grows as others join through your referral link.',
      'Important Notes',
    ],
    bullets: [
      'Wallet rewards are not bank deposits',
      'Wallet balances are not legal tender',
      'Rewards are non transferable outside the App',
      'CrestApp may adjust or update the reward system at any time',
    ],
    trailingParagraphs: [
      'We reserve the right to review or reverse rewards obtained through fraud, misuse, or violation of these Terms.',
    ],
  },
  {
    heading: '5. Payments',
    paragraphs: ['Some features may require payment. By making a purchase, you agree to:'],
    bullets: [
      'Pay all applicable fees',
      'Use authorized payment methods',
      'Understand that all payments are processed through third party platforms (e.g., Google Play Billing)',
    ],
    trailingParagraphs: ['Refunds follow the policies of the payment platform used.'],
  },
  {
    heading: '6. Intellectual Property',
    paragraphs: [
      'All content in CrestApp including text, graphics, icons, crests, names, and outputs is owned by CrestApp or licensed to us.',
      'You may not:',
    ],
    bullets: [
      'Copy, modify, or distribute App content',
      'Use CrestApp branding without permission',
      'Reverse engineer or extract source code',
    ],
    trailingParagraphs: [
      'Your earned Crest and Crest Name are personal symbolic outputs, but the underlying designs remain our intellectual property.',
    ],
  },
  {
    heading: '7. User Content',
    paragraphs: [
      'You may submit reflections, chat messages, or other content. By doing so, you grant CrestApp a non exclusive license to use that content for:',
    ],
    bullets: [
      'App functionality',
      'Moderation',
      'Safety and compliance',
    ],
    trailingParagraphs: [
      'You retain ownership of your personal reflections. We may remove content that violates these Terms or community guidelines.',
    ],
  },
  {
    heading: '8. Privacy',
    paragraphs: [
      'Your privacy is important to us. Our Privacy Policy explains how we collect and use your data.',
    ],
  },
  {
    heading: '9. Disclaimers',
    paragraphs: ['CrestApp provides guidance, reflection tools, and symbolic outputs.'],
    bulletGroups: [
      {
        intro: 'We do not provide:',
        bullets: [
          'Medical advice',
          'Psychological therapy',
          'Financial advice',
          'Professional counseling',
        ],
      },
      {
        intro: 'Your use of the App is at your own risk. We make no guarantees regarding:',
        bullets: [
          'Personal transformation outcomes',
          'Financial earnings',
          'Community interactions',
        ],
      },
    ],
  },
  {
    heading: '10. Limitation of Liability',
    paragraphs: ['To the fullest extent permitted by law, CrestApp is not liable for:'],
    bullets: [
      'Loss of data',
      'Loss of rewards or wallet balances',
      'Emotional or psychological outcomes',
      'Damages arising from misuse of the App',
      'Third party service failures',
    ],
    trailingParagraphs: ['Our total liability will not exceed the amount you paid for the App (if any).'],
  },
  {
    heading: '11. Termination',
    paragraphs: ['We may suspend or terminate your account if:'],
    bullets: [
      'You violate these Terms',
      'You misuse the App',
      'You engage in fraudulent activity',
    ],
    trailingParagraphs: ['You may stop using the App at any time.'],
  },
  {
    heading: '12. Changes to the Terms',
    paragraphs: [
      'We may update these Terms occasionally. Continued use of the App means you accept the updated Terms.',
    ],
  },
  {
    heading: '13. Governing Law',
    paragraphs: [
      'These Terms are governed by the laws of [Insert Country/Region]. Any disputes will be resolved under the jurisdiction of [Insert Courts].',
    ],
  },
  {
    heading: '14. Contact Us',
    paragraphs: ['For questions or concerns, contact us at:'],
    bullets: [`Email: ${SUPPORT_EMAIL}`, `Website: ${WEBSITE}`],
  },
]

// ─── CSAE Policy ─────────────────────────────────────────────────────────────

const CSAE_SECTIONS: Section[] = [
  {
    heading: '1. Zero Tolerance Policy',
    paragraphs: ['CrestApp strictly prohibits:'],
    bullets: [
      'Any content involving the sexualization of minors',
      'Any imagery, text, audio, or behavior that depicts or promotes CSAE',
      'Grooming, solicitation, or attempts to exploit minors',
      'Sharing, requesting, or distributing illegal or harmful content involving children',
      'Any communication intended to manipulate, coerce, or endanger a minor',
    ],
    trailingParagraphs: [
      'Violations result in immediate account termination and may be reported to law enforcement.',
    ],
  },
  {
    heading: '2. Definition of a Minor',
    paragraphs: [
      'For the purposes of this policy, a minor is any individual under the age of 18.',
      'CrestApp is not intended for children under 13, and we do not knowingly collect data from children.',
    ],
  },
  {
    heading: '3. Prohibited Content and Behavior',
    paragraphs: ['The following are strictly forbidden:'],
    bullets: [
      'Sexual content involving minors (real or fictional)',
      'Nudity involving minors',
      'Sexual comments, fantasies, or suggestions directed at minors',
      'Attempts to contact minors for inappropriate purposes',
      'Sharing or linking to CSAE material',
      'Using the App to identify, target, or communicate with minors for exploitation',
    ],
    trailingParagraphs: ['Any user engaging in these behaviors will be permanently banned.'],
  },
  {
    heading: '4. Reporting and Enforcement',
    paragraphs: [
      'We take all reports seriously.',
      'If CSAE related content or behavior is detected or reported:',
    ],
    numbered: [
      'The account is immediately suspended',
      'Content is reviewed by our safety team',
      'Confirmed violations result in permanent account termination',
      'Relevant information may be forwarded to: law enforcement, child protection agencies, and platform safety teams (Google, Apple, etc.)',
    ],
    trailingParagraphs: ['We cooperate fully with legal authorities.'],
  },
  {
    heading: '5. Detection and Prevention Measures',
    paragraphs: ['To protect users and prevent CSAE, CrestApp may use:'],
    bullets: [
      'Automated detection tools',
      'Human moderation',
      'Behavior monitoring for grooming patterns',
      'Age based access restrictions',
      'Account verification when necessary',
    ],
    trailingParagraphs: [
      'These measures are designed to ensure user safety while respecting privacy.',
    ],
  },
  {
    heading: '6. User Responsibilities',
    paragraphs: ['Users must:'],
    bullets: [
      'Refrain from uploading or sharing any harmful content',
      'Report suspicious behavior or content immediately',
      'Avoid interacting with minors in inappropriate ways',
      'Use the App responsibly and lawfully',
    ],
    trailingParagraphs: [`Reports can be submitted via: ${SUPPORT_EMAIL}`],
  },
  {
    heading: '7. Cooperation With Authorities',
    paragraphs: ['CrestApp complies with all applicable laws regarding CSAE, including:'],
    bullets: [
      'Reporting obligations',
      'Preservation of evidence when legally required',
      'Cooperation with investigations',
    ],
    trailingParagraphs: ['We do not tolerate attempts to evade law enforcement.'],
  },
  {
    heading: '8. Commitment to Ongoing Safety',
    paragraphs: ['We regularly review and update our safety practices to:'],
    bullets: [
      'Strengthen detection tools',
      'Improve moderation',
      'Align with global child protection standards',
      'Ensure CrestApp remains a safe environment for all users',
    ],
  },
  {
    heading: '9. Contact Us',
    paragraphs: [
      'If you have concerns or need to report CSAE related content or behavior, contact us at:',
    ],
    bullets: [`Email: ${SUPPORT_EMAIL}`, `Website: ${WEBSITE}`, `Phone: ${PHONE}`],
  },
]

// ─── Document map ─────────────────────────────────────────────────────────────

const DOCS: Record<
  LegalDocType,
  { label: string; icon: typeof FileText; intro: string; sections: Section[] }
> = {
  privacy_policy: {
    label: 'Privacy Policy',
    icon: FileText,
    intro:
      'CrestApp ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use the CrestApp mobile application (the "App"). By using CrestApp, you agree to the practices described in this Privacy Policy.',
    sections: PRIVACY_SECTIONS,
  },
  terms_conditions: {
    label: 'Terms & Conditions',
    icon: BookOpen,
    intro:
      'These Terms & Conditions ("Terms") govern your use of the CrestApp mobile application ("CrestApp", "we", "our", "us"). By downloading or using CrestApp, you agree to be bound by these Terms. If you do not agree, please do not use the App.',
    sections: TERMS_SECTIONS,
  },
  csae_policy: {
    label: 'Child Safety Standards (CSAE)',
    icon: ShieldAlert,
    intro:
      'CrestApp ("we", "our", "us") is committed to maintaining a safe, respectful, and secure environment for all users. We uphold a zero tolerance policy toward Child Sexual Abuse and Exploitation (CSAE) in any form. This document outlines our standards, expectations, and enforcement procedures.',
    sections: CSAE_SECTIONS,
  },
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <ul className="space-y-1.5 pl-4">
      {bullets.map((b, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-400">
          <span className="text-brand-400 mt-0.5 flex-shrink-0">•</span>
          {b}
        </li>
      ))}
    </ul>
  )
}

function DocSection({ section }: { section: Section }) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-white">{section.heading}</h2>

      {section.paragraphs?.map((p, i) => (
        <p key={i} className="text-sm text-gray-400 leading-relaxed">{p}</p>
      ))}

      {section.subsections && (
        <div className="space-y-4">
          {section.subsections.map((sub) => (
            <div key={sub.title} className="space-y-1.5">
              <p className="text-sm font-medium text-gray-300">{sub.title}</p>
              <BulletList bullets={sub.bullets} />
            </div>
          ))}
        </div>
      )}

      {section.bullets && <BulletList bullets={section.bullets} />}

      {section.bulletGroups && (
        <div className="space-y-4">
          {section.bulletGroups.map((group, i) => (
            <div key={i} className="space-y-1.5">
              {group.intro && (
                <p className="text-sm text-gray-400 leading-relaxed">{group.intro}</p>
              )}
              <BulletList bullets={group.bullets} />
            </div>
          ))}
        </div>
      )}

      {section.numbered && (
        <ol className="space-y-1.5 pl-4">
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
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicLegalPage({ type }: Props) {
  const navigate = useNavigate()
  const { label, icon: Icon, intro, sections } = DOCS[type]

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
            <Icon className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{label}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed mt-6 mb-8">{intro}</p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-8 py-8 space-y-8 divide-y divide-gray-800">
          {sections.map((section) => (
            <div key={section.heading} className="pt-8 first:pt-0">
              <DocSection section={section} />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} CrestApp. All rights reserved.</span>
          <a href={`tel:${PHONE}`} className="hover:text-gray-400 transition-colors">{PHONE}</a>
        </div>
      </footer>
    </div>
  )
}
