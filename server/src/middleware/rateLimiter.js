import rateLimit from 'express-rate-limit'

// Strict rate limiter for auth endpoints (prevents brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts, try again in 15 minutes.' },
})
