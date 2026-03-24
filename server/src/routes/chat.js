// src/routes/chat.js
// AI Chat endpoint — powers the Nura tutor chatbot

import { Router } from 'express'
import Groq from 'groq-sdk'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_key_for_local_dev' })

// Strict rate limit for AI endpoint (it costs money per call)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  message: { success: false, message: 'Chat limit reached. Please wait a moment.' },
})

const chatSchema = z.object({
  message:  z.string().min(1).max(500),
  history:  z.array(z.object({
    role:    z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(10).optional().default([]),
})

const NURA_SYSTEM_PROMPT = `You are Nura, a warm, knowledgeable AI tutor at NeuralPath — India's premier AI and computer science learning centre.

Your personality: friendly, encouraging, knowledgeable, concise. You use simple language and occasional relevant emojis.

NeuralPath courses you can recommend:
1. AI Fundamentals Masterclass — ₹12,999 | Beginner | 10 Weeks
2. React + Node.js Full Stack — ₹9,999 | Intermediate | 12 Weeks
3. ML Engineering Bootcamp — ₹14,999 | Advanced | 14 Weeks
4. Python for Automation & AI — ₹7,499 | Beginner | 8 Weeks
5. Data Science & Analytics — ₹11,499 | Intermediate | 10 Weeks
6. CS Zero to Hero — ₹6,999 | Beginner | 8 Weeks

Rules:
- Keep responses to 2-4 sentences max unless explaining a concept
- If someone asks what they should learn first, ask about their background before recommending
- If someone asks a technical question, give a clear, accurate answer
- Never make up information — if unsure, say so
- Always be encouraging about learning tech — it's never too late
- [OFFLINE CENTRE CONTEXT] NeuralPath is a premium physical offline learning centre located in Koramangala, Bengaluru. Classes are conducted strictly in-person; there are NO online classes. If asked about location, timings (Morning, Evening, Weekend), or online classes, clarify this.

[CRITICAL ROUTING RULES]
- You have the power to redirect the user's browser by appending special tags to the VERY END of your message.
- ONLY append [NAVIGATE:/courses] IF the user explicitly asks you to "go to", "show me", or "browse" the courses page. 
- ONLY append [NAVIGATE:/register] IF the user explicitly asks to sign up, register, or create an account.
- ONLY append [NAVIGATE:/login] IF the user explicitly asks to log in.
- DO NOT append any [NAVIGATE:...] tag if the user is just saying hello, asking who you are, or asking a general question. Only use navigation tags for direct navigational requests.`

/**
 * POST /api/chat
 * Accepts a message + conversation history, returns AI response
 * Supports multi-turn conversations
 */
router.post('/', chatLimiter, async (req, res, next) => {
  try {
    const result = chatSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Invalid message format.' })
    }
    const { message, history } = result.data

    // Build message array: history + current user message
    const messages = [
      ...history,
      { role: 'user', content: message },
    ]

    let reply
    if (process.env.GROQ_API_KEY === 'gsk_dummy_key_for_local_dev') {
      await new Promise(r => setTimeout(r, 1000))
      reply = "Hey! I'm Nura, running in local mock mode. Please add a valid Groq key to `.env` for real AI chat! 🤖"
    } else {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: NURA_SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 500,
      })
      reply = response.choices[0]?.message?.content || "I'm having trouble responding right now. Please try again!"
    }

    res.json({
      success: true,
      data: {
        reply,
        role: 'assistant',
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
