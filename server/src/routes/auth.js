// src/routes/auth.js
import { Router } from 'express'
import { register, login, refresh, logout, getMe, updateProfile } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import passport, { initPassport } from '../utils/passport.js'

initPassport()

const router = Router()

// ── Standard Auth ──────────────────────────────────────────────────────────────
router.post('/register',  authLimiter, register)
router.post('/login',     authLimiter, login)
router.post('/refresh',   refresh)
router.post('/logout',    logout)
router.get('/me',         protect, getMe)
router.patch('/profile',  protect, updateProfile)

// ── Google OAuth ───────────────────────────────────────────────────────────────
// Step 1: redirect user to Google
router.get('/google',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=Google+login+not+configured`)
    }
    next()
  },
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

// Step 2: Google calls us back
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=Google+auth+failed` }),
  (req, res) => {
    const { accessToken, refreshToken } = req.user
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    res.redirect(`${clientUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`)
  }
)

export default router
