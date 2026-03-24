// src/pages/OAuthCallbackPage.jsx
// Handles the redirect from the server after Google OAuth.
// Server redirects here with ?accessToken=...&refreshToken=...
// This page stores the tokens and logs the user in.

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import toast from 'react-hot-toast'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { hydrate } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken  = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    const error        = params.get('error')

    if (error || !accessToken || !refreshToken) {
      toast.error(error || 'Google sign-in failed. Please try again.')
      navigate('/login')
      return
    }

    // Store tokens exactly as the regular login does
    localStorage.setItem('accessToken',  accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // Re-hydrate the auth store (calls /api/auth/me with the new token)
    hydrate().then(() => {
      toast.success('Signed in with Google! 🎉')
      navigate('/dashboard')
    }).catch(() => {
      toast.error('Authentication failed. Please try again.')
      navigate('/login')
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: '#050914' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', animation: 'pulse 1.4s infinite' }} />
      <p style={{ color: '#6b7a99', fontSize: '1rem', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>Completing sign-in…</p>
    </div>
  )
}
