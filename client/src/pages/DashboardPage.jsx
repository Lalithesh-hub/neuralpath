import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Clock, Zap, ArrowRight, Trophy, Flame, Target, Code2, Sparkles, BrainCircuit, Award } from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import api from '../api/axios.js'

const STATUS_STYLES = {
  PENDING:   { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', label: 'Pending Payment', dot: '#fbbf24' },
  CONFIRMED: { bg: 'rgba(6,255,165,0.1)',   color: '#06ffa5', label: 'Confirmed ✓',     dot: '#06ffa5' },
  CANCELLED: { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', label: 'Cancelled',        dot: '#f87171' },
  COMPLETED: { bg: 'rgba(0,212,255,0.1)',   color: '#00d4ff', label: 'Completed 🎓',     dot: '#00d4ff' },
}

function generateCertificate(booking, userName) {
  const courseTitle = booking.course?.title || 'AI Programme'
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const certId = `NP-${booking.id?.slice(0, 8).toUpperCase() || 'XXXXXXXX'}`
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate of Completion — ${courseTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #111; }
    .cert { width: 900px; margin: 0 auto; padding: 60px 80px; border: 2px solid #e5e7eb; position: relative; min-height: 620px; }
    .border-inner { position: absolute; inset: 12px; border: 1px solid #e5e7eb; pointer-events: none; }
    .top-bar { height: 8px; background: linear-gradient(90deg, #00d4ff, #7c3aed, #06ffa5); margin-bottom: 50px; margin-left: -80px; margin-right: -80px; margin-top: -60px; }
    .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
    .brand-dot { width: 12px; height: 12px; border-radius: 50%; background: #06ffa5; }
    .brand-name { font-size: 1.4rem; font-weight: 800; color: #00d4ff; letter-spacing: -0.5px; }
    .cert-title { font-family: 'Playfair Display', serif; font-size: 0.9rem; color: #888; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 12px; }
    .cert-of { font-family: 'Playfair Display', serif; font-size: 3.2rem; font-weight: 800; color: #111; line-height: 1.1; margin-bottom: 30px; }
    .presented-to { font-size: 0.9rem; color: #888; margin-bottom: 12px; }
    .student-name { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 700; color: #0077b5; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 24px; display: inline-block; }
    .for-label { font-size: 0.9rem; color: #888; margin-bottom: 10px; }
    .course-name { font-size: 1.5rem; font-weight: 700; color: #111; margin-bottom: 40px; }
    .footer { display: flex; align-items: flex-end; justify-content: space-between; margin-top: 50px; }
    .sig-block { text-align: center; }
    .sig-line { width: 180px; border-top: 1px solid #111; margin: 0 auto 8px; }
    .sig-name { font-weight: 700; font-size: 0.9rem; }
    .sig-title { font-size: 0.75rem; color: #888; }
    .cert-id { font-size: 0.7rem; color: #aaa; text-align: right; }
    .seal { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg,#00d4ff,#7c3aed); display: flex; align-items: center; justify-content: flex-end; color: white; font-size: 2rem; flex-direction: column; justify-content: center; }
    @media print { body { -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
<div class="cert">
  <div class="top-bar"></div>
  <div class="border-inner"></div>
  <div class="brand"><span class="brand-dot"></span><span class="brand-name">NeuralPath</span></div>
  <div class="cert-title">This is to certify that</div>
  <div class="presented-to">with distinction and dedication, this certificate is proudly presented to</div>
  <div class="student-name">${userName}</div>
  <div class="for-label">for successfully completing</div>
  <div class="course-name">${courseTitle}</div>
  <div class="footer">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-name">Rajan Kumar</div>
      <div class="sig-title">Director of Education, NeuralPath</div>
    </div>
    <div style="text-align:center">
      <div class="seal">🎓</div>
      <div style="font-size:0.7rem;color:#aaa;margin-top:6px">Official Seal</div>
    </div>
    <div class="sig-block">
      <div class="cert-id">Certificate ID: ${certId}</div>
      <div class="cert-id">Date Issued: ${date}</div>
      <div class="cert-id" style="margin-top:4px">Verify at: neuralpath.in/verify</div>
    </div>
  </div>
</div>
</body>
</html>`
  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 600)
}

const QUICK_ACTIONS = [
  { icon: BrainCircuit, label: 'AI Career Architect', sub: 'Map your roadmap', to: '/architect', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { icon: Code2,        label: 'Interview Arena',     sub: 'Practice live',    to: '/arena',     color: '#ef4444', bg: 'rgba(239,68,68,0.08)'   },
  { icon: BookOpen,     label: 'Browse Courses',      sub: 'Explore topics',   to: '/courses',   color: '#00d4ff', bg: 'rgba(0,212,255,0.08)'   },
]

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api.get('/bookings/my').then(r => r.data.data),
  })

  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length
  const pending   = bookings.filter(b => b.status === 'PENDING').length
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 5% 4rem', background: 'radial-gradient(ellipse at top, #060d1f 0%, #020408 60%)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* ─── HERO HEADER ─────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#3d4f6b', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>My Dashboard</div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', lineHeight: 1.1, color: '#fff' }}>
              {greeting},{' '}
              <span style={{ background: 'linear-gradient(90deg,#00d4ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {user?.name?.split(' ')[0]}
              </span> 👋
            </h1>
            <p style={{ color: '#3d4f6b', marginTop: '0.5rem', fontSize: '0.95rem' }}>Here's what's happening with your learning journey today.</p>
          </div>

          {/* Streak Badge */}
          <div style={{ background: 'rgba(255,122,0,0.08)', border: '1px solid rgba(255,122,0,0.2)', borderRadius: 16, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(255,122,0,0.6))' }}>🔥</div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#ff7a00', lineHeight: 1 }}>3</div>
              <div style={{ fontSize: '0.75rem', color: '#6b4a2a', fontWeight: 600 }}>Day Streak</div>
            </div>
          </div>
        </div>

        {/* ─── STAT CARDS ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { Icon: BookOpen,      val: bookings.length, label: 'Total Bookings', color: '#00d4ff', bg: 'rgba(0,212,255,0.08)',  border: 'rgba(0,212,255,0.15)' },
            { Icon: CheckCircle,   val: confirmed,        label: 'Confirmed',      color: '#06ffa5', bg: 'rgba(6,255,165,0.08)',  border: 'rgba(6,255,165,0.15)' },
            { Icon: Clock,         val: pending,          label: 'Pending',        color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.15)' },
            { Icon: Trophy,        val: '32',             label: 'Arena Points',   color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)' },
          ].map(({ Icon, val, label, color, bg, border }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '2rem', lineHeight: 1, color: '#fff' }}>{val}</div>
                <div style={{ fontSize: '0.78rem', color: '#3d4f6b', marginTop: '0.2rem', fontWeight: 500 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── QUICK ACTIONS ───────────────────────────────── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3d4f6b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
            {QUICK_ACTIONS.map(({ icon: Icon, label, sub, to, color, bg }) => (
              <Link key={to} to={to} style={{ textDecoration: 'none', background: bg, border: `1px solid ${color}22`, borderRadius: 16, padding: '1.3rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.4), 0 0 20px ${color}22` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#3d4f6b' }}>{sub}</div>
                </div>
                <ArrowRight size={16} color={color} />
              </Link>
            ))}
          </div>
        </div>

        {/* ─── LEARNING GOAL PROGRESS ──────────────────────── */}
        <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '2.5rem', background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Target size={18} color="#00d4ff" />
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Monthly Learning Goal</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#3d4f6b' }}>3 / 10 hours completed</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 100, height: 8, overflow: 'hidden' }}>
            <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg,#00d4ff,#7c3aed)', borderRadius: 100, boxShadow: '0 0 10px rgba(0,212,255,0.4)', transition: 'width 0.8s ease' }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: '#3d4f6b', marginTop: '0.8rem' }}>
            <Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} color="#fbbf24" />
            Keep going! You're 30% toward your goal this month.
          </p>
        </div>

        {/* ─── MY COURSES ──────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#fff' }}>My Enrolled Courses</h2>
            <Link to="/courses" style={{ fontSize: '0.82rem', color: '#00d4ff', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Browse more <ArrowRight size={13} /></Link>
          </div>

          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 80, borderRadius: 14, background: 'rgba(255,255,255,0.02)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          )}

          {!isLoading && bookings.length === 0 && (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>No courses yet</h3>
              <p style={{ color: '#3d4f6b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Start your AI journey today by enrolling in a course.</p>
              <Link to="/courses" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}><Zap size={14} /> Browse Courses</Link>
            </div>
          )}

          {!isLoading && bookings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {bookings.map(b => {
                const st = STATUS_STYLES[b.status] || STATUS_STYLES.PENDING
                const progress = b.status === 'COMPLETED' ? 100 : b.status === 'CONFIRMED' ? Math.floor(Math.random() * 60 + 10) : 0
                return (
                  <div key={b.id} className="card" style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '2rem', flexShrink: 0 }}>{b.course?.emoji || '💻'}</div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '0.15rem' }}>{b.course?.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#3d4f6b', marginBottom: '0.6rem' }}>{b.course?.level} · {b.course?.duration} · Booked {new Date(b.bookedAt).toLocaleDateString('en-IN')}</div>
                      {/* Progress bar */}
                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 100, height: 4, width: '100%', maxWidth: 260 }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: st.color, borderRadius: 100, boxShadow: `0 0 6px ${st.color}66`, transition: 'width 0.8s ease' }} />
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#3d4f6b', marginTop: '0.25rem' }}>{progress}% complete</div>
                    </div>
                    {b.payment && (
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4b5d7a' }}>₹{(b.payment.amount / 100).toLocaleString('en-IN')}</div>
                    )}
                    <span style={{ background: st.bg, color: st.color, fontSize: '0.72rem', fontWeight: 700, padding: '0.3rem 0.85rem', borderRadius: 100, letterSpacing: '0.04em', whiteSpace: 'nowrap', border: `1px solid ${st.color}33` }}>
                      {st.label}
                    </span>
                    {b.status === 'COMPLETED' && (
                      <button
                        onClick={() => generateCertificate(b, user?.name || 'Student')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 100, padding: '0.3rem 0.85rem', fontSize: '0.72rem', fontWeight: 700, color: '#00d4ff', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        <Award size={12} /> Certificate
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
