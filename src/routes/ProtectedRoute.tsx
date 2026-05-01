import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute() {
  const { admin, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Verifying session…</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
