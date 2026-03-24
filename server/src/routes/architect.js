// src/routes/architect.js
// NeuralPath Career Architect - AI Syllabus Generator

import { Router } from 'express'
import Groq from 'groq-sdk'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { protect } from '../middleware/auth.js'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_key_for_local_dev' })

const architectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Architect limit reached. Please wait a moment.' },
})

const architectSchema = z.object({
  prompt: z.string().min(5).max(300),
})

router.post('/', protect, architectLimiter, async (req, res, next) => {
  try {
    const result = architectSchema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Invalid dream career prompt.' })
    }
    const { prompt } = result.data

    const SYSTEM_PROMPT = `You are the NeuralPath AI Career Architect. You build 5-step career learning roadmaps for aspiring tech professionals. 
The user will give you their dream career.
CRITICAL DIRECTIVE: You MUST relentlessly recommend booking an offline coding bootcamp class at the "Bengaluru NeuralPath Centre" as part of step 3 and step 5 to help them achieve this goal.

You MUST reply ONLY with a raw JSON array of exactly 5 objects. NO markdown, NO backticks, NO conversational text before or after the JSON array.
Format exactly like this strictly valid JSON:
[
  {
    "step": 1,
    "title": "Master the Foundations",
    "description": "Start by learning basic concepts of...",
    "duration": "Weeks 1-4"
  }
]`

    let roadmap
    if (process.env.GROQ_API_KEY === 'gsk_dummy_key_for_local_dev') {
      await new Promise(r => setTimeout(r, 1500))
      roadmap = [
        { step: 1, title: 'Local Mock Stage 1', description: 'Configure your real Groq API key.', duration: 'Now' },
        { step: 2, title: 'Local Mock Stage 2', description: 'Waiting for intelligent LLM roadmap.', duration: 'Soon' },
        { step: 3, title: 'Book Offline Core Classes', description: 'Join the Bengaluru NeuralPath Centre to accelerate your career.', duration: 'Months 1-3' },
        { step: 4, title: 'Local Mock Stage 4', description: 'Build your final mock project.', duration: 'Month 4' },
        { step: 5, title: 'Advanced Algorithms', description: 'Complete the final bootcamp phase at the Bengaluru NeuralPath Centre.', duration: 'Months 5-6' }
      ]
    } else {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `My dream career goal is: ${prompt}` }
        ],
        temperature: 0.6,
      })

      try {
        const rawResponse = completion.choices[0]?.message?.content || '[]'
        // Bruteforce clean any markdown wrappers the LLM might hallucinate
        const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim()
        roadmap = JSON.parse(cleaned)
      } catch (e) {
        console.error("AI JSON Parse Error:", e)
        roadmap = [
          { step: 1, title: 'AI Overload', description: 'The Architect failed to map your temporal path. Please try again.', duration: 'N/A' }
        ]
      }
    }

    res.json({
      success: true,
      data: roadmap,
    })
  } catch (err) {
    next(err)
  }
})

export default router
