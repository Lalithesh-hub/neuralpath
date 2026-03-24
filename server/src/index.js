// src/index.js
// NeuralPath API Server — Entry Point

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import bookingRoutes from './routes/bookings.js'
import paymentRoutes from './routes/payments.js'
import chatRoutes from './routes/chat.js'
import adminRoutes from './routes/admin.js'
import arenaRoutes from './routes/arena.js'
import architectRoutes from './routes/architect.js'
import { errorHandler } from './middleware/errorHandler.js'
import passportLib from 'passport'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ─── SECURITY MIDDLEWARE ─────────────────────────────────────────────────────

// Helmet sets secure HTTP headers
app.use(helmet())

// CORS — only allow our frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // allow cookies/auth headers
}))

// Global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
})
app.use(globalLimiter)

import { authLimiter } from './middleware/rateLimiter.js'

// Parse JSON bodies (max 10kb to prevent large payload attacks)
app.use(express.json({ limit: '10kb' }))
app.use(passportLib.initialize())

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
})

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/courses',  courseRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/chat',     chatRoutes)
app.use('/api/admin',    adminRoutes)
app.use('/api/arena',    arenaRoutes)
app.use('/api/architect', architectRoutes)

// ─── 404 HANDLER ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use(errorHandler)

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 NeuralPath API running on http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔒 Security: Helmet + Rate Limiting + CORS active\n`)
})

export default app
