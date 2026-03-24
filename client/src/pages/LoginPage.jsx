import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import toast from 'react-hot-toast'

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'SDE at Google', text: `NeuralPath got me my dream job in 4 months!` },
  { name: 'Rahul M.', role: 'ML Engineer at OpenAI', text: `The AI Arena prepared me for every interview.` },
  { name: 'Ananya K.', role: 'Data Scientist at Stripe', text: `Best investment I have ever made in my career.` },
]

export default function LoginPage() {
  const [form, setForm]  = useState({ email: '', password: '' })
  const [show, setShow]  = useState(false)
  const [err, setErr]    = useState('')
  const [tidx]           = useState(Math.floor(Math.random() * TESTIMONIALS.length))
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setErr('')
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`)
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setErr(msg); toast.error(msg)
    }
  }

  const t = TESTIMONIALS[tidx]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>

      {/* LEFT Art Panel (desktop only) */}
      <div className="np-desktop" style={{ flex: 1, background: 'linear-gradient(135deg,#030c1f 0%,#050918 50%,#020410 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ position: 'absolute', top: '15%', left: '20%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#06ffa5', display: 'inline-block', boxShadow: '0 0 12px #06ffa5' }} />
          <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#00d4ff' }}>NeuralPath</span>
        </Link>

        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.5rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Learn Smarter.<br /><span style={{ background: 'linear-gradient(90deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get Hired Faster.</span>
          </h2>
          <p style={{ color: '#3d4f6b', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Join 10,000+ professionals building careers in AI, ML, and Full-Stack development.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {[['10,000+','Students Enrolled'],['95%','Placement Rate'],['4.9★','Avg. Rating'],['₹8 LPA+','Salary Hike']].map(([v,l]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '1rem' }}>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
                <div style={{ color: '#3d4f6b', fontSize: '0.75rem', marginTop: '0.2rem' }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 14, padding: '1.2rem' }}>
            <Sparkles size={16} color="#00d4ff" style={{ marginBottom: '0.6rem' }} />
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '0.8rem' }}>"{t.text}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>{t.name[0]}</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{t.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#3d4f6b' }}>{t.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT Form Panel */}
      <div style={{ width: 'min(100%,480px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem,5vw,4rem)', background: '#020408' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>Welcome back!</h1>
            <p style={{ color: '#3d4f6b', fontSize: '0.9rem' }}>Log in to continue your journey.</p>
          </div>

          {/* ── SOCIAL LOGIN ─────────────────────────────── */}
          <a
            href={`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}/api/auth/google`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '0.85rem', background: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#111', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer', marginBottom: '1.2rem', fontFamily: 'Outfit, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f4f4f4'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            {/* Google SVG icon */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </a>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ color: '#2d3748', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5d7a', marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3d4f6b' }} />
                <input className="input" style={{ paddingLeft: '2.5rem', background: 'rgba(255,255,255,0.03)' }} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5d7a' }}>Password</label>
                <a href="#" style={{ fontSize: '0.78rem', color: '#00d4ff', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3d4f6b' }} />
                <input className="input" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', background: 'rgba(255,255,255,0.03)' }} type={show ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#3d4f6b' }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {err && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '0.7rem 1rem', fontSize: '0.82rem', color: '#f87171' }}>{err}</div>}
            <button type="submit" disabled={isLoading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1, padding: '0.85rem', fontSize: '0.95rem' }}>
              {isLoading ? 'Logging in…' : <><span>Log In</span> <ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: '#3d4f6b' }}>
              No account?{' '}<Link to="/register" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 700 }}>Create one free →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
