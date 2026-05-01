import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAdminAuthStateChanged, validateAdminSession } from './services/firebase/auth'
import { useAuthStore } from './store/authStore'

import ProtectedRoute from './routes/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import UsersPage from './pages/users/UsersPage'
import GroupsPage from './pages/groups/GroupsPage'
import PrivateChatsPage from './pages/private-chats/PrivateChatsPage'
import CrestsPage from './pages/crests/CrestsPage'
import WalletPage from './pages/wallet/WalletPage'
import WithdrawalsPage from './pages/wallet/WithdrawalsPage'
import DistributionPage from './pages/distribution/DistributionPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import SystemPage from './pages/system/SystemPage'
import PaymentsPage from './pages/payments/PaymentsPage'
import StageManagementPage from './pages/stage-management/StageManagementPage'
import ModerationPage from './pages/moderation/ModerationPage'

export default function App() {
  const { setAdmin, setLoading } = useAuthStore()

  useEffect(() => {
    const unsub = onAdminAuthStateChanged(async (user) => {
      if (user) {
        try {
          const admin = await validateAdminSession(user)
          setAdmin(admin)
        } catch {
          setAdmin(null)
        }
      } else {
        setAdmin(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [setAdmin, setLoading])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/stage-management" element={<StageManagementPage />} />
          <Route path="/moderation" element={<ModerationPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/private-chats" element={<PrivateChatsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/withdrawals" element={<WithdrawalsPage />} />
          <Route path="/distribution" element={<DistributionPage />} />
          <Route path="/crests" element={<CrestsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/system" element={<SystemPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
