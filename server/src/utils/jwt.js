// src/utils/jwt.js
// JWT token generation and verification helpers

import jwt from 'jsonwebtoken'

/**
 * Generate a short-lived access token (15 min)
 * Contains only the user ID and role — minimum necessary data
 */
export function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  )
}

/**
 * Generate a long-lived refresh token (7 days)
 * Used to silently obtain a new access token
 */
export function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  )
}

/**
 * Verify and decode an access token
 * Throws JsonWebTokenError if invalid or expired
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
}

/**
 * Verify and decode a refresh token
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}
