// src/middleware/auth.js
// Middleware to protect routes and enforce role-based access

import { verifyAccessToken } from '../utils/jwt.js'
import prisma from '../utils/prisma.js'

/**
 * protect — verifies JWT and attaches user to req.user
 * Usage: router.get('/profile', protect, controller)
 */
export async function protect(req, res, next) {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided. Please log in.' })
    }

    const token = authHeader.split(' ')[1]

    // 2. Verify the token (throws if expired/invalid)
    const decoded = verifyAccessToken(token)

    // 3. Confirm user still exists in DB (handles deleted accounts)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    })

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' })
    }

    // 4. Attach user to request for downstream use
    req.user = user
    next()
  } catch (err) {
    // Differentiate between expired and invalid tokens
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please refresh.' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' })
  }
}

/**
 * restrictTo — role-based access control
 * Usage: router.get('/admin', protect, restrictTo('ADMIN'), controller)
 */
export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      })
    }
    next()
  }
}
