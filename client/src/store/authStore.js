import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axios.js'

const useAuthStore = create(persist(
  (set, get) => ({
    user: null, accessToken: null, refreshToken: null, isLoading: false,
    register: async (name, email, password, phone) => {
      set({ isLoading: true })
      const { data } = await api.post('/auth/register', { name, email, password, phone })
      const { user, accessToken, refreshToken } = data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      set({ user, accessToken, refreshToken, isLoading: false })
      return user
    },
    login: async (email, password) => {
      set({ isLoading: true })
      const { data } = await api.post('/auth/login', { email, password })
      const { user, accessToken, refreshToken } = data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      set({ user, accessToken, refreshToken, isLoading: false })
      return user
    },
    logout: async () => {
      const { refreshToken } = get()
      try { await api.post('/auth/logout', { refreshToken }) } catch {}
      localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken')
      set({ user: null, accessToken: null, refreshToken: null })
    },
    hydrate: async () => {
      try { const { data } = await api.get('/auth/me'); set({ user: data.data.user }) }
      catch { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); set({ user: null }) }
    },
    isLoggedIn: () => !!get().user,
    isAdmin: () => get().user?.role === 'ADMIN',
  }),
  { name: 'neuralpath-auth', partialize: s => ({ user: s.user }) }
))

export default useAuthStore
