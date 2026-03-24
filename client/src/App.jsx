import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore.js'
import Navbar from './components/layout/Navbar.jsx'
import SiteFooter from './components/layout/SiteFooter.jsx'
import HomePage from './pages/HomePage.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import ArenaPage from './pages/ArenaPage.jsx'
import ArchitectPage from './pages/ArchitectPage.jsx'
import CourseDetailPage from './pages/CourseDetailPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import OAuthCallbackPage from './pages/OAuthCallbackPage.jsx'
import FloatingNura from './components/ui/FloatingNura.jsx'
import InteractiveBackground from './components/ui/InteractiveBackground.jsx'

function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin } = useAuthStore()
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin()) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { hydrate } = useAuthStore()
  useEffect(() => { if (localStorage.getItem('accessToken')) hydrate() }, [])
  return (
    <>
      <InteractiveBackground />
      <Toaster position="top-center" toastOptions={{ style: { background: '#080f1f', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' } }} />
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/courses"   element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin"     element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
          <Route path="/arena"     element={<ProtectedRoute><ArenaPage /></ProtectedRoute>} />
          <Route path="/architect" element={<ProtectedRoute><ArchitectPage /></ProtectedRoute>} />
          <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="*"              element={<NotFoundPage />} />
        </Routes>
      </div>
      <SiteFooter />
      <FloatingNura />
    </>
  )
}

