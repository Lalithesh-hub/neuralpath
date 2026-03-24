// src/pages/Home.jsx
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ChatWidget from '../components/ui/ChatWidget.jsx'

// Neural canvas animation
function useNeuralCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let nodes = [], animId

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      nodes = Array.from({ length: Math.min(Math.floor(canvas.width * canvas.height / 20000), 60) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 1,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,212,255,0.7)'; ctx.fill()
      })
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d = Math.hypot(dx, dy)
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 130) * 0.2})`
            ctx.lineWidth = 1; ctx.stroke()
          }
        }
      animId = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
}

const STATS = [
  { num: '10K+', label: 'Students Enrolled' },
  { num: '98%',  label: 'Satisfaction Rate' },
  { num: '50+',  label: 'AI‑Led Courses' },
  { num: '4.9★', label: 'Average Rating' },
]

const WHY = [
  { icon: '🤖', title: 'AI‑Powered Tutors',   text: 'Real-time help from intelligent assistants trained on thousands of CS concepts.' },
  { icon: '🎓', title: 'Expert Instructors',   text: 'Industry practitioners from top tech companies — not just academics.' },
  { icon: '📱', title: 'Learn Anywhere',        text: 'Fully responsive on mobile, tablet, and desktop.' },
  { icon: '🏆', title: 'Certified Outcomes',   text: 'Industry-recognised certificates valued by 500+ hiring partners.' },
]

const TESTIMONIALS = [
  { stars: 5, text: '"Talking to Nura before enrolling convinced me instantly. It answered my exact doubts about ML — better than any sales call."', name: 'Priya Sharma', role: 'ML Engineer @ Infosys', grad: 'from-np-accent to-np-violet' },
  { stars: 5, text: '"The AI chatbot recommended I start with Python before jumping into ML. That advice changed everything."', name: 'Arjun Nair', role: 'Data Scientist @ Zoho', grad: 'from-np-green to-np-accent' },
  { stars: 5, text: '"I used to think AI was only for IIT graduates. NeuralPath\'s AI tutor proved me wrong."', name: 'Meera Krishnan', role: 'Full‑Stack Dev @ TCS', grad: 'from-np-violet to-np-green' },
]

export default function Home() {
  const canvasRef = useRef(null)
  useNeuralCanvas(canvasRef)

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-30" />

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 border border-np-accent/30 bg-np-accent/5 px-4 py-1.5 rounded-full text-xs font-semibold text-np-accent tracking-widest mb-6 animate-fade-up">
          🧠 Powered by Real AI · Not Just Theory
        </div>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Learn the Future.<br />
          <span className="gradient-text">Experience AI</span> First‑Hand.
        </h1>
        <p className="text-np-muted text-lg max-w-xl mt-5 mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
          NeuralPath isn't just a place to learn about AI — it's a place where AI teaches you. Chat with our live AI tutor below and see why 10,000+ students trust us.
        </p>
        <div className="flex gap-3 flex-wrap justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <a href="#ai-demo" className="btn-primary">🤖 Talk to Our AI Tutor</a>
          <Link to="/courses" className="btn-ghost">Browse Courses</Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-14 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <span className="font-display font-extrabold text-3xl text-np-accent block">{s.num}</span>
              <span className="text-xs text-np-muted tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI DEMO ── */}
      <section id="ai-demo" className="relative z-10 py-24 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <ChatWidget />
          <div>
            <p className="section-label">Live AI Experience</p>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
              Don't Just Learn AI.<br /><span className="gradient-text">Feel It Working.</span>
            </h2>
            <p className="text-np-muted leading-relaxed mb-6">
              Most schools talk about AI. We let you interact with it before you even enroll. Our live tutor is powered by real intelligence — the same technology you'll master in our courses.
            </p>
            <div className="flex flex-col gap-3">
              {[
                ['⚡', 'Instant, Intelligent Answers', 'Ask any tech question and get expert-level responses in real time.'],
                ['🎯', 'Personalised Course Guidance', 'Nura analyses your goals and recommends the perfect learning path.'],
                ['🔒', 'Always Available, Always Honest', '24/7 support with accurate information, no sales pressure.'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="card p-4 flex gap-4 hover:border-np-accent/30 transition-colors">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <strong className="block text-sm font-semibold mb-0.5">{title}</strong>
                    <p className="text-np-muted text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="relative z-10 py-20 px-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="section-label">Why NeuralPath</p>
            <h2 className="font-display font-extrabold text-4xl tracking-tight mb-4">
              A Learning Centre That<br />Walks the Talk
            </h2>
            <p className="text-np-muted leading-relaxed mb-6">
              Any institute can teach AI theory. We built our entire platform on AI — from teaching methods to student support — so you see its real power from day one.
            </p>
            <Link to="/register" className="btn-primary">Start Your Journey →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {WHY.map((w, i) => (
              <div key={w.title} className={`card p-5 hover:-translate-y-1 hover:border-np-accent/30 transition-all duration-200 ${i === 0 ? 'border-np-accent/30 bg-np-accent/5' : ''}`}>
                <div className="text-3xl mb-3">{w.icon}</div>
                <h4 className="font-display font-bold text-sm mb-1">{w.title}</h4>
                <p className="text-np-muted text-xs leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="section-label">Student Stories</p>
          <h2 className="font-display font-extrabold text-4xl tracking-tight mb-10">Real People, Real Results</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6 hover:-translate-y-1 hover:border-np-accent/20 transition-all duration-200">
                <div className="text-yellow-400 text-sm tracking-widest mb-3">{'★'.repeat(t.stars)}</div>
                <p className="text-np-muted text-sm italic leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-base`}>👤</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-np-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="card border-np-accent/20 bg-gradient-to-br from-np-accent/5 to-np-violet/5 p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-np-accent/5 rounded-full blur-3xl pointer-events-none" />
            <p className="section-label justify-center">Enroll Today</p>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
              Ready to Build Your<br /><span className="gradient-text">AI Future?</span>
            </h2>
            <p className="text-np-muted mb-8 max-w-md mx-auto">
              Join 10,000+ students who are already building tomorrow's technology today.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/register" className="btn-primary">Create Free Account 🚀</Link>
              <Link to="/courses"  className="btn-ghost">Browse All Courses</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
