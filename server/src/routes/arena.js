// src/routes/arena.js
// Specialized AI Interview Endpoint

import { Router } from 'express'
import Groq from 'groq-sdk'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { protect } from '../middleware/auth.js'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_key_for_local_dev' })

const arenaLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { success: false, message: 'Arena rate limit reached. Please wait a moment.' },
})

const arenaSchema = z.object({
  domain: z.string().min(1).max(50),
  message: z.string().min(1).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(20).optional().default([]),
})

router.post('/', protect, arenaLimiter, async (req, res, next) => {
  try {
    const result = arenaSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Invalid interview mapping format.' })
    }
    const { domain, message, history } = result.data

    const SYSTEM_PROMPT = `You are a strict, highly technical senior engineering interviewer at an elite tech company.
The candidate is interviewing for a role in: ${domain}.

RULES:
1. You are conducting a technical interview. DO NOT break character. You are strict, concise, and expect high-quality answers.
2. If this is the start of the interview (history is empty), immediately ask ONE challenging technical question related to ${domain}.
3. Wait for the user's answer.
4. When the user answers, critically evaluate their response.
5. Provide concise, expert feedback on their logic, syntax, or architecture. Provide a rating out of 10 for their specific answer.
6. Ask the next related technical question to build upon the interview.
7. Keep responses dense with technical knowledge. ALWAYS use markdown formatting \`\`\` for code examples, and highlight keywords.
8. Do not compliment the user excessively. If they are wrong, tell them exactly why.
9. ONLY ask ONE question at a time.`

    const messages = [
      ...history,
      { role: 'user', content: message },
    ]

    let reply
    if (process.env.GROQ_API_KEY === 'gsk_dummy_key_for_local_dev') {
      await new Promise(r => setTimeout(r, 1000))
      reply = `**Mock System**: Local development key detected. You scored 10/10. \n\n\`\`\`javascript\nconsole.log("Connect a real Groq key to experience the Arena.")\n\`\`\`\n\nNext question: What is the event loop in ${domain}?`
    } else {
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.6,
      })
      reply = response.choices[0]?.message?.content || "System failure. Could not assess answer."
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
