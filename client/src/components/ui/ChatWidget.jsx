// src/components/ui/ChatWidget.jsx
// Nura AI Tutor — live chat powered by the backend /api/chat endpoint

import { useState, useRef, useEffect } from 'react'
import { chatAPI } from '../../api/services.js'

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm Nura, your AI tutor at NeuralPath 👋 Ask me anything about AI, programming, data science — or which course is right for you!",
}

export default function ChatWidget() {
  const [messages,  setMessages]  = useState([WELCOME])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const bottomRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      // Build history excluding the welcome message (only real conversation)
      const history = messages
        .filter(m => m !== WELCOME)
        .map(m => ({ role: m.role, content: m.content }))

      const { data } = await chatAPI.send(text, history)
      setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a small hiccup right now. Please try again! 🙏",
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card overflow-hidden shadow-glow flex flex-col h-[440px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-np-accent/5 border-b border-np-border">
        <div className="w-9 h-9 rounded-full bg-gradient-np flex items-center justify-center text-base flex-shrink-0">
          🤖
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Nura — AI Tutor</p>
          <p className="text-xs text-np-green mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-np-green inline-block animate-pulse" />
            Online · NeuralPath Intelligence
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
              msg.role === 'assistant' ? 'bg-gradient-np' : 'bg-white/10'
            }`}>
              {msg.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'assistant'
                ? 'bg-np-accent/10 border border-np-accent/20 text-np-text rounded-bl-sm'
                : 'bg-gradient-np text-white rounded-br-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-full bg-gradient-np flex items-center justify-center text-xs">🤖</div>
            <div className="bg-np-accent/10 border border-np-accent/20 px-3 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-np-accent animate-bounce"
                    style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-np-border px-3 py-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything about AI or courses…"
          className="input flex-1 py-2 text-sm rounded-full"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-full bg-gradient-np flex items-center justify-center flex-shrink-0
                     hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
