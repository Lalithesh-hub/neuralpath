import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Shield, Zap, Users, Clock, PlayCircle, Code, Star, CheckCircle2, ArrowLeft, Send, X, MessageCircle } from 'lucide-react'
import api from '../api/axios.js'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore.js'

const INSTRUCTORS = {
  default: { name: 'Arjun Mehta', title: 'Senior Software Engineer, ex-Google', avatar: '👨‍💻', exp: '8 years', students: '2,400+' },
  python:  { name: 'Sneha Reddy', title: 'ML Engineer, ex-Flipkart', avatar: '👩‍🔬', exp: '6 years', students: '1,800+' },
  ml:      { name: 'Dr. Karthik Rao', title: 'AI Researcher, IIT Madras', avatar: '👨‍🔬', exp: '10 years', students: '900+' },
  data:    { name: 'Priya Nair', title: 'Data Scientist, ex-Razorpay', avatar: '👩‍💻', exp: '5 years', students: '1,200+' },
}

function getInstructor(course) {
  const t = course?.title?.toLowerCase() || ''
  if (t.includes('python') || t.includes('django')) return INSTRUCTORS.python
  if (t.includes('ml') || t.includes('machine') || t.includes('ai')) return INSTRUCTORS.ml
  if (t.includes('data') || t.includes('sql')) return INSTRUCTORS.data
  return INSTRUCTORS.default
}

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [targetDate])

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '0.8rem 0' }}>
      {[['d','Days'],['h','Hrs'],['m','Min'],['s','Sec']].map(([k, label]) => (
        <div key={k} style={{ textAlign: 'center', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 8, padding: '0.4rem 0.6rem', minWidth: 46 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1.1rem', color: '#00d4ff', lineHeight: 1 }}>{String(timeLeft[k] ?? 0).padStart(2, '0')}</div>
          <div style={{ fontSize: '0.6rem', color: '#3d4f6b', fontWeight: 600 }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

function NuraChatPanel({ course, onClose }) {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: `Hi! I'm Nura 👋 I can answer any questions you have about "${course?.title}". What would you like to know?` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    const newMsgs = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      const history = newMsgs.slice(1, -1).map(m => ({ role: m.role, content: m.content }))
      const { data } = await api.post('/chat', { message: `About the "${course?.title}" course: ${text}`, history })
      setMsgs(prev => [...prev, { role: 'assistant', content: data.data.reply }])
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(2,4,8,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 520, background: '#0a0f1a', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 20, display: 'flex', flexDirection: 'column', maxHeight: '80vh', boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.08)' }}>
        {/* Header */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤖</div>
          <div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Ask Nura</div>
            <div style={{ fontSize: '0.72rem', color: '#3d4f6b' }}>About {course?.title}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#3d4f6b', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.7rem', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>🤖</div>}
              <div style={{ maxWidth: '75%', padding: '0.8rem 1rem', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role === 'user' ? 'linear-gradient(135deg,#00d4ff,#7c3aed)' : 'rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: '0.88rem', lineHeight: 1.6, border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div style={{ color: '#3d4f6b', fontSize: '0.85rem', paddingLeft: '2.5rem' }}>Nura is thinking...</div>}
        </div>

        {/* Input */}
        <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.7rem' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask anything about this course..." disabled={loading}
            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.7rem 1rem', color: '#e2e8f0', outline: 'none', fontSize: '0.88rem' }} />
          <button onClick={send} disabled={loading || !input.trim()} style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!input.trim() || loading) ? 0.4 : 1 }}>
            <Send size={15} color="white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthStore()
  const [showNura, setShowNura] = useState(false)

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => api.get(`/courses/${courseId}`).then(r => r.data.data)
  })

  // Next batch: always 7-14 days from now for demo
  const nextBatch = new Date(Date.now() + (9 * 24 * 60 * 60 * 1000))
  const instructor = getInstructor(course)

  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-pulse-glow" style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)' }} />
    </div>
  )

  if (!course) return (
    <div style={{ padding: '8rem 5%', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem' }}>Course not found.</h2>
      <button onClick={() => navigate('/courses')} className="btn-ghost" style={{ marginTop: '1rem' }}>Back to Courses</button>
    </div>
  )

  const syllabus = [
    { week: 1, title: 'Introduction & Environment Setup', topics: ['Setting up VSCode / Colab', 'Understanding the foundations', 'Your first hello world program'] },
    { week: 2, title: 'Core Concepts & Principles', topics: ['Data structures', 'Algorithms primer', 'Best practices in coding'] },
    { week: 3, title: 'Advanced Mechanics', topics: ['Object-oriented design', 'Functional paradigms', 'Performance optimization'] },
    { week: 4, title: 'Final Project Build', topics: ['End-to-end integration', 'Deployment to cloud', 'Presentation & Review'] }
  ]

  const handleEnroll = () => {
    if (!isLoggedIn()) { toast('Please log in to enroll', { icon: '🔐' }); navigate('/login'); return }
    navigate('/courses')
    toast.success('Redirecting to checkout...', { icon: '🚀' })
  }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {showNura && <NuraChatPanel course={course} onClose={() => setShowNura(false)} />}

      {/* HERO HEADER */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '6rem 5% 4rem', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(/courses/${course.slug}.png)`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(30px) brightness(0.2) saturate(2)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #050914)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', gap: '4rem', alignItems: 'flex-start', position: 'relative', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <button onClick={() => navigate('/courses')} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Back to Catalog
            </button>
            <div className="label-tag" style={{ marginBottom: '1rem' }}>{course.level} TRACK</div>
            <h1 className="animate-fade-up" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              {course.title}
            </h1>
            <p className="animate-fade-up" style={{ color: 'var(--text)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: 600, marginBottom: '2rem', animationDelay: '0.1s' }}>
              {course.description} Dive deep into industry secrets and master this stack alongside leading experts.
            </p>

            {/* Instructor mini-card in hero */}
            <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.8rem 1.2rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '1.8rem' }}>{instructor.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{instructor.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#3d4f6b' }}>{instructor.title}</div>
              </div>
            </div>

            <div className="animate-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem', animationDelay: '0.2s' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', color: '#00d4ff' }}><Clock size={20}/> {course.duration}</div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', color: '#7c3aed' }}><Users size={20}/> {instructor.students} students</div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', color: '#06ffa5' }}><Star size={20}/> 4.9 Average Rating</div>
            </div>
            <button className="btn-primary animate-fade-up" onClick={handleEnroll} style={{ animationDelay: '0.3s', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              <Zap size={18} /> Reserve Your Seat
            </button>
          </div>

          <div style={{ width: '38%', minWidth: 300 }} className="animate-fade-up">
            <div className="card" style={{ padding: '0.5rem', background: '#0a0f1d' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--bg2)', borderRadius: '1rem', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img src={`/courses/${course.slug}.png`} alt={course.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} onError={e => e.target.style.display = 'none'} />
                <PlayCircle size={60} color="#fff" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }} />
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.8)', padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600 }}>Taster Video</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSE CONTENT */}
      <section style={{ padding: '4rem 5%', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,2fr) 1fr', gap: '4rem' }}>
        <div>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>What You'll Learn</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '4rem' }}>
            {['Build real-world projects from scratch', 'Understand under-the-hood architecture', 'Learn modern, industry-standard tools', 'Collaborate via code reviews', 'Deploy to production environments', 'Acing tech interviews with confidence'].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                <CheckCircle2 color="#06ffa5" size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: 'var(--muted)', lineHeight: 1.5, fontSize: '0.95rem' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Instructor Card */}
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Your Instructor</h2>
          <div className="card" style={{ padding: '1.8rem', marginBottom: '3rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)' }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>{instructor.avatar}</div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#fff', marginBottom: '0.2rem' }}>{instructor.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#7c3aed', marginBottom: '0.6rem' }}>{instructor.title}</div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[['⭐', '4.9 Rating'], [`👨‍🎓`, `${instructor.students} Students`], [`⏱`, `${instructor.exp} Experience`]].map(([ic, txt]) => (
                  <span key={txt} style={{ fontSize: '0.8rem', color: '#3d4f6b' }}>{ic} {txt}</span>
                ))}
              </div>
            </div>
          </div>

          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Syllabus Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {syllabus.map(s => (
              <div key={s.week} className="card" style={{ padding: '1.5rem', borderLeft: '3px solid #7c3aed' }}>
                <div style={{ color: '#7c3aed', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: '0.5rem' }}>Week {s.week}</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#e8eaf6' }}>{s.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.topics.map((t, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* STICKY SIDEBAR */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '8rem', padding: '2rem', background: 'linear-gradient(135deg,rgba(0,212,255,0.03),rgba(124,58,237,0.03))' }}>
            <div style={{ fontSize: '2rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginBottom: '0.2rem' }}>
              ₹{(course.priceInRupees || Math.round(course.price / 100)).toLocaleString('en-IN')}
            </div>

            {/* Countdown */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#3d4f6b', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>⏰ Next Batch Starts In</div>
              <CountdownTimer targetDate={nextBatch} />
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Includes lifetime access & 3-month mentorship window.</p>
            <button className="btn-primary" onClick={handleEnroll} style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', marginBottom: '1rem' }}>
              <Zap size={18} /> Book Your Spot
            </button>
            <button className="btn-ghost" onClick={() => setShowNura(true)} style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00d4ff' }}>
              <MessageCircle size={16} /> Ask Nura a Question
            </button>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                [Shield, '#00d4ff', 'Certificate of Completion', 'Recognized by 500+ partners'],
                [Code,   '#7c3aed', 'GitHub Portfolio',          'Graduate with 4 robust projects'],
              ].map(([Icon, color, title, sub]) => (
                <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Icon color={color} size={24} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
