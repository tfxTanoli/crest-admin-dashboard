import { useState } from 'react'
import { Menu, Bell, LogOut, User, RefreshCw } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { adminLogout } from '../../services/firebase/auth'
import toast from 'react-hot-toast'

interface NavbarProps {
  onMenuToggle: () => void
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { admin, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    await queryClient.invalidateQueries()
    await queryClient.refetchQueries({ type: 'active' })
    setRefreshing(false)
    toast.success('Page data refreshed')
  }

  async function handleLogout() {
    try {
      await adminLogout()
      logout()
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <button
        onClick={onMenuToggle}
        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 lg:flex-none" />

      <div className="flex items-center gap-2">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title="Refresh page data"
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 relative">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-700 ml-1">
          <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">{admin?.email}</p>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{admin?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-800 ml-1"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
