import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { onAdminAuthStateChanged, validateAdminSession } from './services/firebase/auth'
import { useAuthStore } from './store/authStore'

import ProtectedRoute from './routes/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import LandingPage from './pages/landing/LandingPage'
import PublicLegalPage from './pages/public/PublicLegalPage'
import ContactPage from './pages/public/ContactPage'
import AccountDeletionPage from './pages/public/AccountDeletionPage'
import PricingPage from './pages/public/PricingPage'
import RefundPolicyPage from './pages/public/RefundPolicyPage'
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
import CompanyWalletPage from './pages/wallet/CompanyWalletPage'
import StageManagementPage from './pages/stage-management/StageManagementPage'
import ModerationPage from './pages/moderation/ModerationPage'
import LegalPage from './pages/legal/LegalPage'
import ArticlesPage from './pages/articles/ArticlesPage'
import ArticlesAdminPage from './pages/articles-admin/ArticlesAdminPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

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
    <>
    <ScrollToTop />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/privacy-policy" element={<PublicLegalPage type="privacy_policy" />} />
      <Route path="/terms" element={<PublicLegalPage type="terms_conditions" />} />
      <Route path="/csae" element={<PublicLegalPage type="csae_policy" />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/delete-account" element={<AccountDeletionPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      <Route path="/articles" element={<ArticlesPage />} />

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/stage-management" element={<StageManagementPage />} />
          <Route path="/moderation" element={<ModerationPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/private-chats" element={<PrivateChatsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/company-wallet" element={<CompanyWalletPage />} />
          <Route path="/withdrawals" element={<WithdrawalsPage />} />
          <Route path="/distribution" element={<DistributionPage />} />
          <Route path="/crests" element={<CrestsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/system" element={<SystemPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/articles-admin" element={<ArticlesAdminPage />} />
        </Route>
      </Route>

      {/* Catch-all → landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}
