// src/controllers/authController.js
// Handles: Register, Login, Refresh Token, Logout, Get Profile

import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '../utils/prisma.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { createError } from '../middleware/errorHandler.js'
import { sendWelcomeEmail } from '../utils/emailService.js'

// ─── VALIDATION SCHEMAS (Zod) ─────────────────────────────────────────────────
const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(60),
  email:    z.string().email('Invalid email address'),
  password: z.string()
              .min(8, 'Password must be at least 8 characters')
              .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
              .regex(/[0-9]/, 'Must contain at least one number'),
  phone:    z.string().optional(),
})

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Save refresh token to DB with expiry */
async function saveRefreshToken(userId, token) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days
  await prisma.refreshToken.create({ data: { token, userId, expiresAt } })
}

/** Strip sensitive fields before sending user to client */
function sanitizeUser(user) {
  const { passwordHash, ...safe } = user
  return safe
}

// ─── CONTROLLERS ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates a new student account
 */
export async function register(req, res, next) {
  try {
    // 1. Validate input
    const result = registerSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      })
    }
    const { name, email, password, phone } = result.data

    // 2. Check if email already registered
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' })
    }

    // 3. Hash password with bcrypt (salt rounds = 12 for strong security)
    const passwordHash = await bcrypt.hash(password, 12)

    // 4. Create user
    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone },
    })

    // 5. Generate tokens
    const accessToken  = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    await saveRefreshToken(user.id, refreshToken)

    // 6. Send welcome email (non-blocking — never fails registration)
    sendWelcomeEmail(user)

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/login
 * Authenticates a user and returns tokens
 */
export async function login(req, res, next) {
  try {
    // 1. Validate input
    const result = loginSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Invalid email or password format.' })
    }
    const { email, password } = result.data

    // 2. Find user — use a vague error message to prevent user enumeration attacks
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    // 4. Generate tokens
    const accessToken  = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    await saveRefreshToken(user.id, refreshToken)

    res.json({
      success: true,
      message: 'Logged in successfully!',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/refresh
 * Issues a new access token using a valid refresh token
 * This allows silent token renewal without re-login
 */
export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required.' })
    }

    // 1. Verify JWT signature and expiry
    let decoded
    try {
      decoded = verifyRefreshToken(refreshToken)
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' })
    }

    // 2. Check token exists in DB and hasn't been revoked
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Refresh token revoked or expired.' })
    }

    // 3. Get user
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' })
    }

    // 4. Issue new access token
    const newAccessToken = generateAccessToken(user)

    res.json({ success: true, data: { accessToken: newAccessToken } })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/logout
 * Revokes the refresh token (prevents reuse)
 */
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      // Delete token from DB — it can no longer be used
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    res.json({ success: true, message: 'Logged out successfully.' })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/auth/me
 * Returns the currently logged-in user's profile
 * Protected by JWT middleware
 */
export async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true,
        role: true, phone: true, avatarUrl: true, createdAt: true,
        bookings: {
          select: {
            id: true, status: true, bookedAt: true,
            course: { select: { title: true, emoji: true, level: true } },
          },
          orderBy: { bookedAt: 'desc' },
        },
      },
    })
    res.json({ success: true, data: { user } })
  } catch (err) {
    next(err)
  }
}

/**
 * PATCH /api/auth/profile
 * Updates user name, phone and optionally password
 */
export async function updateProfile(req, res, next) {
  try {
    const { name, phone, currentPassword, newPassword } = req.body
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' })

    let passwordHash = user.passwordHash
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ success: false, message: 'Current password required to set a new one.' })
      const match = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!match) return res.status(400).json({ success: false, message: 'Current password is incorrect.' })
      if (newPassword.length < 8) return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' })
      passwordHash = await bcrypt.hash(newPassword, 12)
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name: name || user.name, phone: phone || user.phone, passwordHash },
    })
    res.json({ success: true, message: 'Profile updated.', data: { user: sanitizeUser(updated) } })
  } catch (err) {
    next(err)
  }
}

