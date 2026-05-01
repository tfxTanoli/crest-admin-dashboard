import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser } from '../types'

interface AuthState {
  admin: AdminUser | null
  loading: boolean
  setAdmin: (admin: AdminUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      loading: true,
      setAdmin: (admin) => set({ admin }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ admin: null }),
    }),
    {
      name: 'crest-admin-auth',
      partialize: (state) => ({ admin: state.admin }),
    }
  )
)
