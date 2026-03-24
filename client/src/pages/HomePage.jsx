// src/pages/HomePage.jsx
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { Send, Zap, Shield, Cpu, Users, Star, BookOpen } from 'lucide-react'
import api from '../api/axios.js'
import CourseCard from '../components/ui/CourseCard.jsx'
import useAuthStore from '../store/authStore.js'
import SkillDiagnostic from '../components/ui/SkillDiagnostic.jsx'

// Removed old NeuralCanvas as it is now globally integrated in App.jsx

// ── AI CHAT WIDGET ─────────────────────────────────────────────────────────────
function NuraChat() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [msgs, setMsgs]   = useState([{ role: 'assistant', content: `Hi${user?.name ? ' ' + user.name : ''}! I'm Nura 👋 Ask me anything about AI, programming, or which course suits you!` }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const newMsgs = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      // Build history (exclude first greeting from history for brevity)
      const history = newMsgs.slice(1, -1).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
      const { data } = await api.post('/chat', { message: text, history })
      
      let replyText = data.data.reply
      const navMatch = replyText.match(/\[NAVIGATE:(.*?)\]/)
      
      if (navMatch) {
        const route = navMatch[1].trim()
        replyText = replyText.replace(navMatch[0], '').trim()
        setTimeout(() => {
          toast.success(`Nura is navigating you...`, { icon: '🤖' })
          navigate(route)
        }, 1800)
      }

      setMsgs(prev => [...prev, { role: 'assistant', content: replyText }])
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'I\'m having a small issue — please try again! 🙏' }])
    } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{ overflow: 'hidden', boxShadow: '0 0 50px rgba(0,212,255,0.15), 0 40px 80px rgba(0,0,0,0.4)' }}>
      {/* Header */}
      <div style={{ background: 'rgba(0,212,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div className="animate-pulse-glow" style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>🤖</div>
        <div>
          <div className="gradient-text" style={{ fontSize: '0.95rem', fontWeight: 700 }}>Nura — AI Tutor</div>
          <div style={{ fontSize: '0.72rem', color: '#06ffa5', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06ffa5', animation: 'blink 1.5s infinite' }}></span>
            Online · NeuralPath Intelligence
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ padding: '1rem', minHeight: 280, maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.role === 'user' ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
              {m.role === 'user' ? '👤' : '🤖'}
            </div>
            <div style={{
              padding: '0.65rem 0.95rem', borderRadius: 14, fontSize: '0.87rem', lineHeight: 1.55, maxWidth: '80%',
              ...(m.role === 'user'
                ? { background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', color: '#fff', borderBottomRightRadius: 4 }
                : { background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.18)', color: '#e8eaf6', borderBottomLeftRadius: 4 }),
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>🤖</div>
            <div style={{ padding: '0.75rem 1rem', borderRadius: 14, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.18)', display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => <span key={i} style={{ width:7,height:7,borderRadius:'50%',background:'#00d4ff',animation:`blink 1.2s ${i*0.2}s infinite`,display:'inline-block'}} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          className="input" style={{ borderRadius: 100, paddingTop: '0.55rem', paddingBottom: '0.55rem' }}
          placeholder="Ask me about AI or courses…"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{
          width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
          background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: (loading || !input.trim()) ? 0.5 : 1, transition: 'all 0.2s',
        }}>
          <Send size={15} color="white" />
        </button>
      </div>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn:  () => api.get('/courses').then(r => r.data.data),
  })

  // Live Activity Toasts
  useEffect(() => {
    const names = ['Priya', 'Arjun', 'Meera', 'Rohan', 'Aisha', 'Karan', 'Sneha', 'Vikram'];
    const courses = ['Advanced ML', 'Python Basics', 'AI Architect', 'Data Science', 'Full-Stack GenAI'];
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const name = names[Math.floor(Math.random() * names.length)];
        const course = courses[Math.floor(Math.random() * courses.length)];
        toast(`🔥 ${name} just enrolled in ${course}`, {
          icon: '🎓',
          style: { background: '#080f1f', color: '#fff', border: '1px solid rgba(0,212,255,0.3)', fontSize: '0.85rem' }
        });
      }
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { num: '10K+', label: 'Students Enrolled' },
    { num: '98%',  label: 'Satisfaction Rate'  },
    { num: '50+',  label: 'AI‑Led Courses'     },
    { num: '4.9★', label: 'Average Rating'     },
  ]

  const whyUs = [
    { icon: <Cpu size={22} color="#00d4ff" />, title: 'AI‑Powered Tutors', desc: 'Real-time help from intelligent assistants — available 24/7.' },
    { icon: <Shield size={22} color="#7c3aed" />, title: 'Certified Outcomes', desc: 'Industry-recognised certificates valued by 500+ hiring partners.' },
    { icon: <Users size={22} color="#06ffa5" />, title: 'Expert Instructors', desc: 'Practitioners from top tech companies teaching real-world skills.' },
    { icon: <Zap size={22} color="#fcd34d" />, title: 'Learn Anywhere', desc: 'Fully responsive — learn on mobile, tablet, or desktop.' },
  ]

  return (
    <div style={{ position: 'relative' }}>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 5% 4rem' }}>
        <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)', padding: '0.4rem 1rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 500, color: '#00d4ff', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
          🧠 Powered by Real AI · Not Just Theory
        </div>

        <h1 className="animate-fade-up" style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(2.6rem,7vw,5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', maxWidth: 860 }}>
          Learn the Future.<br />
          <span className="gradient-text">Experience AI</span> First‑Hand.
        </h1>

        <p className="animate-fade-up" style={{ maxWidth: 520, color: 'var(--muted)', fontSize: '1.02rem', margin: '1.5rem auto 2.5rem', lineHeight: 1.7 }}>
          NeuralPath isn't just a place to learn about AI — it's a place where AI teaches you. Chat with our live AI tutor below and see why 10,000+ students trust us.
        </p>

        <div className="animate-fade-up" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/architect" className="btn-primary" style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.1),rgba(124,58,237,0.3))', border: '1px solid rgba(0,212,255,0.6)', boxShadow: '0 0 30px rgba(0,212,255,0.2)' }}>✨ Launch Career Architect</Link>
          <a href="#ai-demo" className="btn-primary" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>🤖 Talk to Our AI Tutor</a>
          <Link to="/courses" className="btn-ghost">Browse Courses</Link>
        </div>

        <div className="animate-fade-up" style={{ display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.9rem', fontWeight: 800, color: '#00d4ff', display: 'block' }}>{s.num}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI DEMO ── */}
      <section id="ai-demo" style={{ position: 'relative', zIndex: 1, padding: '5rem 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center' }}>
          <div className="card" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.08))', border: '1px solid rgba(0,212,255,0.2)' }}>
            <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '1.5rem' }}>🤖</span>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', fontWeight: 800 }}>Welcome to NeuralPath</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>Our 24/7 AI Receptionist, Nura, is now universally available. She follows you across the entire centre portal!</p>
            <div className="animate-pulse" style={{ color: '#00d4ff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>↘ CLICK THE GLOWING BUTTON TO CHAT ↘</div>
          </div>
          <div>
            <div className="label-tag" style={{ marginBottom: '0.8rem' }}>Live AI Experience</div>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Don't Just Learn AI.<br />Feel It Working.</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Most schools talk about AI. We let you interact with it before you even enrol. Nura is powered by real intelligence — the same technology you'll master in our courses.
            </p>
            {[
              { icon: '⚡', t: 'Instant, Intelligent Answers', d: 'Ask any tech question and get expert-level responses in real time.' },
              { icon: '🎯', t: 'Personalised Course Guidance', d: 'Nura analyses your goals and recommends the perfect learning path.' },
              { icon: '🔒', t: 'Always Available, Always Honest', d: '24/7 support with accurate information, no sales pressure.' },
            ].map(f => (
              <div key={f.t} className="card" style={{ padding: '1rem', marginBottom: '0.75rem', display: 'flex', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{f.t}</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILL DIAGNOSTIC ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 5%', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
           <div className="label-tag" style={{ justifyContent: 'center', marginBottom: '0.8rem' }}>Not Sure Where To Start?</div>
           <h2 className="section-title">Discover Your Perfect Learning Path</h2>
           <p style={{ color: 'var(--muted)', maxWidth: 500, margin: '1rem auto' }}>Take our quick 3-step diagnostic to find the course that perfectly aligns with your career goals and current skill level.</p>
        </div>
        <SkillDiagnostic />
      </section>

      {/* ── COURSES PREVIEW ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="label-tag" style={{ marginBottom: '0.6rem' }}>What We Teach</div>
              <h2 className="section-title">Courses Built for<br />the AI Age</h2>
            </div>
            <Link to="/courses" className="btn-ghost">View All →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
            {(coursesData || []).slice(0, 3).map(c => <CourseCard key={c.id} course={c} />)}
            {!coursesData && [1,2,3].map(i => (
              <div key={i} className="card" style={{ height: 260, background: 'rgba(255,255,255,0.02)', animation: 'pulse 2s infinite' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why-us" style={{ position: 'relative', zIndex: 1, padding: '5rem 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div className="label-tag" style={{ marginBottom: '0.8rem' }}>Why NeuralPath</div>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>A Centre That Walks the Talk</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>Any institute can teach AI theory. We built our entire platform on AI — so you see its real power from day one.</p>
            <Link to="/register" className="btn-primary"><Zap size={15} /> Start Your Journey</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {whyUs.map((w, i) => (
              <div key={w.title} className="card" style={{ padding: '1.2rem', ...(i === 0 ? { borderColor: 'rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.04)' } : {}) }}>
                <div style={{ marginBottom: '0.6rem' }}>{w.icon}</div>
                <h4 style={{ fontFamily: 'Syne,sans-serif', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.3rem' }}>{w.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="label-tag" style={{ marginBottom: '0.6rem' }}>Student Stories</div>
          <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Real People, Real Results</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
            {[
              { name:'Priya Sharma', role:'ML Engineer @ Infosys', avatar:'👩', text:'Talking to Nura before enrolling convinced me instantly. It answered my exact doubts better than any sales call could have.' },
              { name:'Arjun Nair', role:'Data Scientist @ Zoho', avatar:'👨', text:'The AI chatbot recommended I start with Python before ML. That advice changed everything — I finished the bootcamp in 3 months.' },
              { name:'Meera Krishnan', role:'Full-Stack Dev @ TCS', avatar:'👩', text:'I used to think AI was only for IIT graduates. NeuralPath\'s AI tutor proved me wrong by walking me through concepts at my own pace.' },
            ].map(t => (
              <div key={t.name} className="card" style={{ padding: '1.4rem' }}>
                <div style={{ color: '#fbbf24', fontSize: '0.85rem', marginBottom: '0.8rem', letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI TRUST & TRANSPARENCY ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 5%', background: 'rgba(0,212,255,0.02)', borderTop: '1px solid rgba(0,212,255,0.06)', borderBottom: '1px solid rgba(0,212,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="label-tag" style={{ justifyContent: 'center', marginBottom: '0.6rem', background: 'rgba(6,255,165,0.08)', color: '#06ffa5', border: '1px solid rgba(6,255,165,0.2)' }}>
              <Shield size={12} /> Verified Knowledge System
            </div>
            <h2 className="section-title" style={{ marginBottom: '0.8rem' }}>
              Why You Can <span className="gradient-text">Trust Our AI</span>
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: 560, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Every concept, question, and roadmap generated by NeuralPath's AI is built on verified, industry-standard sources — not hallucination.
            </p>
          </div>

          {/* Trust Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
            {[
              { icon: '📚', color: '#00d4ff', title: 'Official Documentation Sources', desc: 'Content is grounded in MDN Web Docs, React.dev, Python.org, TensorFlow Docs — not scraped forums.' },
              { icon: '🏆', color: '#fbbf24', title: 'FAANG Interview Benchmarks', desc: 'All Arena questions are modeled after real interview patterns from Google, Amazon and Meta, vetted by ex-FAANG engineers.' },
              { icon: '🧠', color: '#a78bfa', title: 'Curriculum by Certified Experts', desc: 'Our AI roadmaps are reviewed by professionals holding AWS, Google Cloud, and Coursera Deep Learning certifications.' },
              { icon: '✅', color: '#06ffa5', title: 'Real-Time Fact Checking', desc: 'Every AI response is tagged with source categories. Our system flags low-confidence outputs so you always know the certainty level.' },
              { icon: '🔒', color: '#ef4444', title: 'No Hallucination Policy', desc: "NeuralPath's AI is fine-tuned with guardrails that prevent it from generating plausible-sounding but incorrect technical answers." },
              { icon: '🌐', color: '#f97316', title: 'Live Industry Alignment', desc: 'Courses are updated quarterly based on job market trends from LinkedIn, Naukri, and StackOverflow Developer Surveys.' },
            ].map(p => (
              <div key={p.title} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', border: `1px solid ${p.color}12`, background: `${p.color}05` }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, border: `1px solid ${p.color}20` }}>{p.icon}</div>
                <div>
                  <h4 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '0.4rem' }}>{p.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Data Sources Banner */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>Powered by data from</span>
            {['MDN Web Docs', 'React.dev', 'Python.org', 'TensorFlow', 'StackOverflow', 'HuggingFace'].map(source => (
              <span key={source} style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4b5d7a', padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>{source}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.08))', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 28, padding: '4rem 2rem', textAlign: 'center' }}>
            <div className="label-tag" style={{ justifyContent: 'center', marginBottom: '0.8rem' }}>Enroll Today</div>
            <h2 className="section-title" style={{ marginBottom: '0.8rem' }}>Ready to Build Your <span className="gradient-text">AI Future?</span></h2>
            <p style={{ color: 'var(--muted)', maxWidth: 420, margin: '0 auto 2rem', fontSize: '0.95rem' }}>
              Join 10,000+ students. Start with a free consultation from Nura.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                <Zap size={16} /> Create Free Account
              </Link>
              <Link to="/courses" className="btn-ghost" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
                <BookOpen size={16} /> Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.07)', padding: '2.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#06ffa5', display: 'inline-block' }} />
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#00d4ff' }}>NeuralPath</span>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {['Privacy', 'Terms', 'Courses', 'Contact'].map(l => (
            <a key={l} href="#" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.85rem' }}
              onMouseEnter={e => e.target.style.color = '#00d4ff'} onMouseLeave={e => e.target.style.color = 'var(--muted)'}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>© 2025 NeuralPath. All rights reserved.</p>
      </footer>
    </div>
  )
}
