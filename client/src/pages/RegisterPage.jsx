import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [step, setStep] = useState(0) // 0: ask name, 1: ask email, 2: ask password, 3: loading
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: "Hi there! I'm Nura, NeuralPath's AI Receptionist. I'm thrilled to get you set up! What name should I call you?" }])
  const [input, setInput] = useState('')
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, step])

  const send = async () => {
    const text = input.trim()
    if (!text || isLoading || step >= 3) return
    setInput('')
    setMsgs(p => [...p, { role: 'user', content: step === 2 ? '••••••••' : text }])

    if (step === 0) {
      setForm(f => ({ ...f, name: text }))
      setTimeout(() => setMsgs(p => [...p, { role: 'assistant', content: `Nice to meet you, ${text}! What's the best email address to send your course materials to?` }]), 600)
      setStep(1)
    } else if (step === 1) {
      setForm(f => ({ ...f, email: text }))
      setTimeout(() => setMsgs(p => [...p, { role: 'assistant', content: `Got it. Finally, for security, please create a strong password (at least 8 chars, 1 uppercase, 1 number).` }]), 600)
      setStep(2)
    } else if (step === 2) {
      // Validate
      if (text.length < 8 || !/[A-Z]/.test(text) || !/[0-9]/.test(text)) {
        setTimeout(() => setMsgs(p => [...p, { role: 'assistant', content: `Hmm, that password isn't strong enough. It needs 8+ characters, including 1 uppercase letter and 1 number. Try again!` }]), 500)
        return
      }
      setForm(f => ({ ...f, password: text }))
      setStep(3)
      setTimeout(async () => {
        setMsgs(p => [...p, { role: 'assistant', content: `Excellent! Setting up your NeuralPath dashboard now...` }])
        try {
          // Explicit capture from form state for accuracy during closure
          await register(form.name, form.email, text, '')
          setMsgs(p => [...p, { role: 'assistant', content: `Account created! Redirecting you... 🎉` }])
          toast.success('Onboarding complete!')
          setTimeout(() => navigate('/dashboard'), 1500)
        } catch (err) {
          const msg = err.response?.data?.message || 'Registration failed.'
          setMsgs(p => [...p, { role: 'assistant', content: `Uh oh, there was an issue: ${msg}. Try typing a different email or password.` }])
          setStep(1) // Usually it's duplicate email, so revert to asking email
        }
      }, 700)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 5% 2rem', background: 'radial-gradient(circle at top, #081121 0%, #030712 100%)' }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Site
        </Link>

        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 20px 60px rgba(0,212,255,0.08)' }}>

          {/* Social Login */}
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <a
              href={`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}/api/auth/google`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '0.8rem', background: '#fff', borderRadius: 10, color: '#111', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'background 0.2s', fontFamily: 'Outfit, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign up with Google
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ color: '#2d3748', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em' }}>OR REGISTER WITH NURA</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
          </div>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.1),rgba(124,58,237,0.1))', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="animate-pulse-glow" style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Syne,sans-serif', color: '#fff' }}>Nura Onboarding</div>
              <div style={{ fontSize: '0.75rem', color: '#06ffa5', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06ffa5', animation: 'blink 1.5s infinite' }}></span> AI Assistant Active
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div style={{ padding: '1.5rem', height: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {msgs.map((m, i) => (
              <div key={i} className="animate-fade-up" style={{ display: 'flex', gap: '0.8rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.role === 'user' ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>
                  {m.role === 'user' ? '👤' : '🤖'}
                </div>
                <div style={{
                  padding: '0.85rem 1.1rem', borderRadius: 18, fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '85%',
                  ...(m.role === 'user'
                    ? { background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', color: '#fff', borderBottomRightRadius: 4 }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.15)', color: '#e8eaf6', borderBottomLeftRadius: 4 }),
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {step === 3 && (
              <div className="animate-fade-up" style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>🤖</div>
                <div style={{ padding: '0.8rem 1.2rem', borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.15)', display: 'flex', gap: 6 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width:8,height:8,borderRadius:'50%',background:'#00d4ff',animation:`blink 1.2s ${i*0.2}s infinite`,display:'inline-block'}} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <input
                className="input" style={{ borderRadius: 100, padding: '0.8rem 1.2rem' }}
                type={step === 2 ? 'password' : 'text'}
                placeholder={step === 0 ? "Type your name..." : step === 1 ? "Type your email..." : step === 2 ? "Type a strong password..." : "Wait a moment..."}
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                disabled={step >= 3}
                autoFocus
              />
              <button onClick={send} disabled={step >= 3 || !input.trim()} style={{
                width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
                background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (step >= 3 || !input.trim()) ? 0.5 : 1, transition: 'all 0.2s',
              }}>
                <Send size={18} color="white" />
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.8rem' }}>
              Already registered? <Link to="/login" style={{ color: '#00d4ff', textDecoration: 'none' }}>Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
