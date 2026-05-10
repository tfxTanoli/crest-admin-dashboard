import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  MessageCircle,
  Shield,
  Wallet,
  ArrowDownToLine,
  BarChart2,
  Settings,
  Sliders,
  CreditCard,
  GraduationCap,
  ShieldAlert,
  Building2,
  ChevronRight,
  FileText,
  X,
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/analytics', icon: BarChart2, label: 'Analytics' },
    ],
  },
  {
    label: 'Users',
    items: [
      { to: '/users', icon: Users, label: 'User Management' },
      { to: '/stage-management', icon: GraduationCap, label: 'Stage & Weeks' },
      { to: '/moderation', icon: ShieldAlert, label: 'Moderation' },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/groups', icon: MessageSquare, label: 'Groups & Chat' },
      { to: '/private-chats', icon: MessageCircle, label: 'Private Chats' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/payments', icon: CreditCard, label: 'Payments' },
      { to: '/wallet', icon: Wallet, label: 'Transactions' },
      { to: '/withdrawals', icon: ArrowDownToLine, label: 'Withdrawals' },
      { to: '/company-wallet', icon: Building2, label: 'Company Wallet' },
      { to: '/distribution', icon: Sliders, label: 'Distribution' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { to: '/crests', icon: Shield, label: 'Crests' },
      { to: '/system', icon: Settings, label: 'System Config' },
      { to: '/legal', icon: FileText, label: 'Legal Documents' },
    ],
  },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-30
          transform transition-transform duration-200 ease-in-out flex flex-col
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Crest Admin</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/dashboard'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
                      ${
                        isActive
                          ? 'bg-brand-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-600 text-center">Crest Admin v1.0</p>
        </div>
      </aside>
    </>
  )
}
