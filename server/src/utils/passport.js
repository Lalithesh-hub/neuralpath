// src/utils/passport.js
// Passport Google OAuth 2.0 strategy for NeuralPath
// Uses JWT (not sessions) — after Google callback we redirect to frontend with tokens.

import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from './prisma.js'
import { generateAccessToken, generateRefreshToken } from './jwt.js'

function saveRefreshToken(userId, token) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  return prisma.refreshToken.create({ data: { token, userId, expiresAt } })
}

export function initPassport() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('[oauth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set — Google login disabled.')
    return
  }

  passport.use(new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.API_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email       = profile.emails?.[0]?.value
        const googleId    = profile.id
        const name        = profile.displayName || 'Google User'
        const avatarUrl   = profile.photos?.[0]?.value

        if (!email) return done(new Error('Google account has no email'), null)

        // Find by googleId first, then by email
        let user = await prisma.user.findFirst({ where: { googleId } })

        if (!user) {
          // Try match by email — link account
          user = await prisma.user.findUnique({ where: { email } })
          if (user) {
            // Existing email account — link googleId
            user = await prisma.user.update({
              where: { id: user.id },
              data:  { googleId, avatarUrl: user.avatarUrl || avatarUrl },
            })
          } else {
            // Brand new user via Google
            user = await prisma.user.create({
              data: {
                name,
                email,
                googleId,
                avatarUrl,
                passwordHash: '', // social-only account
              },
            })
          }
        }

        // Generate NeuralPath JWT tokens
        const accessToken  = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        await saveRefreshToken(user.id, refreshToken)

        return done(null, { user, accessToken, refreshToken })
      } catch (err) {
        return done(err, null)
      }
    }
  ))
}

export default passport
