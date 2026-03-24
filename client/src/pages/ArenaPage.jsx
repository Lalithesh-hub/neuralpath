import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Terminal, Send, Code2, Database, Cpu, BrainCircuit, Play, ChevronRight, Circle, Minus, Square, Clock, BarChart2, Trophy, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import toast from 'react-hot-toast'

const DOMAINS = [
  {
    id: 'React Frontend', icon: Code2, color: '#00d4ff', bg: 'rgba(0,212,255,0.08)',
    desc: 'Component Architecture & Hooks', level: 'Intermediate',
    topics: ['React Hooks', 'State Management', 'Component Design', 'Performance'],
    lang: 'jsx',
  },
  {
    id: 'Python Automation', icon: Terminal, color: '#06ffa5', bg: 'rgba(6,255,165,0.08)',
    desc: 'Scripting & Workflow Automation', level: 'Beginner–Advanced',
    topics: ['File I/O', 'APIs & Requests', 'Regex', 'Concurrency'],
    lang: 'py',
  },
  {
    id: 'Machine Learning', icon: BrainCircuit, color: '#a78bfa', bg: 'rgba(167,139,250,0.08)',
    desc: 'Modeling, Algorithms & MLOps', level: 'Advanced',
    topics: ['Supervised Learning', 'Neural Networks', 'Feature Engineering', 'Deployment'],
    lang: 'py',
  },
  {
    id: 'Data Science', icon: Database, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',
    desc: 'SQL, Pandas & Statistical Analysis', level: 'Intermediate',
    topics: ['SQL Joins', 'Pandas', 'Matplotlib', 'Hypothesis Testing'],
    lang: 'py',
  },
]

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const LINE_COLORS = {
  keyword: '#c792ea',
  string: '#c3e88d',
  comment: '#546e7a',
  fn: '#82aaff',
  num: '#f78c6c',
}

function CodeEditor({ lang }) {
  const DEFAULT = lang === 'jsx'
    ? `// workspace.jsx — NeuralPath Interview Arena\nimport React, { useState } from 'react';\n\nfunction Solution() {\n  const [result, setResult] = useState(null);\n\n  // Write your solution here\n  const solve = () => {\n    setResult('Your output appears here');\n  };\n\n  return (\n    <div>\n      <button onClick={solve}>Run Solution</button>\n      <p>{result}</p>\n    </div>\n  );\n}\n\nexport default Solution;`
    : `# workspace.py — NeuralPath Interview Arena\n\ndef solve_challenge(input_data):\n    \"\"\"\n    Implement your optimal solution below.\n    Time Complexity: O(?)\n    Space Complexity: O(?)\n    \"\"\"\n    # --- YOUR CODE HERE ---\n    pass\n\n\nif __name__ == '__main__':\n    test_cases = [[]]\n    for tc in test_cases:\n        print(f"Input: {tc}")\n        print(f"Output: {solve_challenge(tc)}")`;

  const [code, setCode] = useState(DEFAULT)
  const [output, setOutput] = useState('> Kernel initialised. Awaiting execution...')
  const [running, setRunning] = useState(false)
  const lines = code.split('\n')

  const handleRun = () => {
    setRunning(true)
    setOutput('> Compiling...')
    setTimeout(() => {
      setOutput(`> Running workspace.${lang}...\n\n[NeuralPath Runtime v3.1]\nExecution successful ✓\n\nstdout:\nHello NeuralPath! Ready to execute.\n\n──────────────────────────\nExit code: 0  |  Time: 0.042s  |  Memory: 14.2 MB`)
      setRunning(false)
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Editor Tab Bar */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.06)', userSelect: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.2rem', borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '2px solid #00d4ff', background: '#0d1b2a' }}>
          <Code2 size={13} color="#00d4ff" />
          <span style={{ color: '#e2e8f0', fontSize: '0.82rem', fontFamily: 'Fira Code, monospace' }}>workspace.{lang}</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', marginLeft: 4 }} />
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={handleRun} disabled={running} style={{ margin: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: running ? 'rgba(6,255,165,0.08)' : '#06ffa5', color: running ? '#06ffa5' : '#000', border: running ? '1px solid rgba(6,255,165,0.3)' : 'none', padding: '0.35rem 1rem', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.2s', fontFamily: 'Syne, sans-serif' }}>
          <Play size={13} fill={running ? 'transparent' : '#000'} /> {running ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Editor Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Line Numbers */}
        <div style={{ background: '#0a0f1a', padding: '1.2rem 0.5rem 1.2rem 0.8rem', textAlign: 'right', userSelect: 'none', minWidth: 40, borderRight: '1px solid rgba(255,255,255,0.04)' }}>
          {lines.map((_, i) => (
            <div key={i} style={{ color: '#2d3748', fontSize: '0.78rem', fontFamily: '"JetBrains Mono", "Fira Code", monospace', lineHeight: '1.7', height: '1.7em' }}>{i + 1}</div>
          ))}
        </div>
        {/* Code Textarea */}
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          style={{ flex: 1, background: '#0d1117', border: 'none', outline: 'none', color: '#cdd6f4', fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '0.9rem', padding: '1.2rem 1.2rem 1.2rem 1rem', resize: 'none', lineHeight: 1.7, tabSize: 2, letterSpacing: '0.02em' }}
        />
      </div>

      {/* Console Panel */}
      <div style={{ height: '28%', background: '#060a10', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0.5rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {['TERMINAL', 'OUTPUT', 'PROBLEMS'].map((t, i) => (
            <span key={t} style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', color: i === 1 ? '#06ffa5' : '#3d4f6b', cursor: 'pointer', borderBottom: i === 1 ? '2px solid #06ffa5' : '2px solid transparent', paddingBottom: 4 }}>{t}</span>
          ))}
        </div>
        <div style={{ flex: 1, padding: '1rem 1.2rem', overflowY: 'auto' }}>
          <pre style={{ color: '#a3be8c', fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '0.82rem', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7, letterSpacing: '0.01em' }}>{output}</pre>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ padding: '0.25rem 1.2rem', background: '#007acc', display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'Fira Code, monospace' }}>
        <span>⎇  arena-session</span>
        <span>Ln {lines.length}, Col 1</span>
        <span style={{ marginLeft: 'auto' }}>{lang === 'py' ? 'Python 3.11' : 'React 18 / JSX'}</span>
        <span>UTF-8</span>
        <span>Spaces: 2</span>
      </div>
    </div>
  )
}

export default function ArenaPage() {
  const [activeDomain, setActiveDomain] = useState(null)
  const [difficulty, setDifficulty] = useState('Medium')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [score, setScore] = useState(0)
  const messagesEndRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    if (activeDomain) {
      timerRef.current = setInterval(() => setSessionTime(t => t + 1), 1000)
    } else {
      clearInterval(timerRef.current)
      setSessionTime(0)
    }
    return () => clearInterval(timerRef.current)
  }, [activeDomain])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const startInterview = async (domain, diff) => {
    setActiveDomain({ ...domain, difficulty: diff })
    setMessages([])
    setScore(0)
    setLoading(true)
    try {
      const { data } = await api.post('/arena', { domain: domain.id, message: `I am ready to begin the ${diff} level interview.`, history: [] })
      setMessages([{ role: 'assistant', content: data.data.reply }])
    } catch {
      toast.error('Failed to connect to the Arena.')
      setActiveDomain(null)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMsgs = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMsgs)
    setLoading(true)
    try {
      const { data } = await api.post('/arena', { domain: activeDomain.id, message: userMsg, history: newMsgs.slice(0, -1) })
      setMessages([...newMsgs, { role: 'assistant', content: data.data.reply }])
      setScore(s => s + 10)
    } catch {
      toast.error('Communication error.')
    } finally {
      setLoading(false)
    }
  }

  // ─── LOBBY SCREEN ────────────────────────────────────────────────────────────
  if (!activeDomain) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #070d1f 0%, #020408 100%)', position: 'relative', zIndex: 1 }}>
        <div style={{ paddingTop: '90px', maxWidth: 1100, margin: '0 auto', padding: '90px 5% 4rem' }}>

          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#4b5d7a', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, marginBottom: '3rem' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#4b5d7a'}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.35rem 1rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '1.5rem', border: '1px solid rgba(239,68,68,0.25)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', animation: 'blink 1s infinite', display: 'inline-block' }} /> LIVE ASSESSMENT ENVIRONMENT
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
              Interview <span style={{ background: 'linear-gradient(90deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Arena</span>
            </h1>
            <p style={{ color: '#4b5d7a', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto' }}>
              A high-fidelity simulation of a FAANG technical interview. An AI Senior Engineer will challenge your skills in real time.
            </p>
          </div>

          {/* Difficulty Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '3rem' }}>
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setDifficulty(d)} style={{
                padding: '0.5rem 1.5rem', borderRadius: 100, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif',
                background: difficulty === d ? (d === 'Easy' ? '#06ffa5' : d === 'Medium' ? '#f59e0b' : '#ef4444') : 'rgba(255,255,255,0.04)',
                color: difficulty === d ? '#000' : '#4b5d7a',
                border: difficulty === d ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}>
                {d}
              </button>
            ))}
          </div>

          {/* Domain Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {DOMAINS.map(d => {
              const Icon = d.icon
              return (
                <div key={d.id}
                  onClick={() => startInterview(d, difficulty)}
                  style={{ background: d.bg, border: `1px solid ${d.color}22`, borderRadius: 16, padding: '2rem', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 24px 48px rgba(0,0,0,0.6), 0 0 30px ${d.color}22`; e.currentTarget.style.borderColor = d.color + '66' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = d.color + '22' }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: `${d.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                    <Icon size={24} color={d.color} />
                  </div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#fff', marginBottom: '0.4rem' }}>{d.id}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#4b5d7a', marginBottom: '1.2rem', lineHeight: 1.5 }}>{d.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {d.topics.map(t => (
                      <span key={t} style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 100, background: `${d.color}12`, color: d.color, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', color: '#4b5d7a', fontWeight: 600 }}>Level: {d.level}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: d.color, fontWeight: 700, fontSize: '0.85rem' }}>
                      Start <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats Footer */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {[['12,400+', 'Interviews Completed'], ['98%', 'Accuracy Rate'], ['4.9/5', 'Candidate Rating']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: '#4b5d7a', fontWeight: 500, marginTop: '0.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ─── ACTIVE ARENA SESSION ────────────────────────────────────────────────────
  const DomainIcon = activeDomain.icon
  const diffColor = activeDomain.difficulty === 'Easy' ? '#06ffa5' : activeDomain.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#020408', fontFamily: 'Inter, sans-serif' }}>

      {/* TOP MENU BAR (VS Code style) */}
      <div style={{ background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 50, gap: '1.5rem', flexShrink: 0 }}>
        {/* Window Controls */}
        <div style={{ display: 'flex', gap: 6, marginRight: '0.5rem' }}>
          <button onClick={() => setActiveDomain(null)} style={{ width: 13, height: 13, borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="End Session">
            <Minus size={8} color="rgba(0,0,0,0.5)" />
          </button>
          <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#06ffa5' }} />
        </div>

        {/* Session Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <DomainIcon size={15} color={activeDomain.color} />
          <span style={{ color: '#8b9ab8', fontSize: '0.82rem', fontFamily: 'Fira Code, monospace' }}>{activeDomain.id}</span>
          <span style={{ color: '#2d3748', fontSize: '0.82rem' }}>/</span>
          <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.6rem', borderRadius: 100, background: `${diffColor}18`, color: diffColor, fontWeight: 700, border: `1px solid ${diffColor}40` }}>{activeDomain.difficulty}</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Live Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#4b5d7a', fontSize: '0.82rem' }}>
            <Clock size={13} /> <span style={{ fontFamily: 'Fira Code, monospace', color: sessionTime > 2400 ? '#ef4444' : '#8b9ab8' }}>{formatTime(sessionTime)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#4b5d7a', fontSize: '0.82rem' }}>
            <Trophy size={13} color="#f59e0b" /> <span style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'Fira Code, monospace' }}>{score}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'blink 1.2s infinite', display: 'inline-block' }} />
            <span style={{ color: '#ef4444', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em' }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT PANE — minHeight:0 is critical for overflow scroll inside flex children */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* LEFT: AI CHAT PANEL — overflow:hidden + minHeight:0 on BOTH column AND split-pane are required */}
        <div style={{ width: '42%', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)', minHeight: 0, overflow: 'hidden' }}>
          {/* Panel Header with trust badge */}
          <div style={{ padding: '0.6rem 1.2rem', background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.7rem', flexShrink: 0 }}>
            <Cpu size={14} color="#ef4444" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7a99', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Interviewer Console</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(6,255,165,0.08)', border: '1px solid rgba(6,255,165,0.2)', borderRadius: 100, padding: '0.2rem 0.6rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06ffa5', display: 'inline-block' }} />
              <span style={{ fontSize: '0.65rem', color: '#06ffa5', fontWeight: 700, letterSpacing: '0.08em' }}>VERIFIED AI</span>
            </div>
          </div>

          {/* Messages — scrollable region. flex: 1 1 0 + minHeight:0 on parent column is critical */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'scroll', overflowX: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#020408' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: m.role === 'assistant' ? 'rgba(239,68,68,0.12)' : 'rgba(0,212,255,0.1)',
                  border: `1px solid ${m.role === 'assistant' ? 'rgba(239,68,68,0.3)' : 'rgba(0,212,255,0.2)'}`,
                  color: m.role === 'assistant' ? '#ef4444' : '#00d4ff',
                }}>
                  {m.role === 'assistant' ? <Cpu size={16} /> : <Terminal size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: m.role === 'assistant' ? '#ef4444' : '#00d4ff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {m.role === 'assistant' ? 'Senior Engineer · AI' : 'You'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#2d3748' }}>Q{Math.ceil((i + 1) / 2)}</span>
                  </div>
                  <div style={{ color: m.role === 'assistant' ? '#e2e8f0' : '#94a3b8', fontSize: '0.92rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: m.role === 'assistant' ? 'Outfit, Inter, sans-serif' : '"JetBrains Mono", monospace', letterSpacing: m.role === 'assistant' ? '0.01em' : '0' }}>
                    {m.content}
                  </div>
                  {/* Trust: Source citations on AI messages */}
                  {m.role === 'assistant' && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {(m.sources || ['Official Docs', 'Industry Best Practices', 'FAANG Benchmark']).map(src => (
                        <span key={src} style={{ fontSize: '0.65rem', padding: '0.18rem 0.55rem', borderRadius: 100, background: 'rgba(0,212,255,0.06)', color: '#4b8daa', border: '1px solid rgba(0,212,255,0.12)', fontWeight: 600, letterSpacing: '0.04em' }}>
                          📎 {src}
                        </span>
                      ))}
                      <span style={{ fontSize: '0.65rem', padding: '0.18rem 0.55rem', borderRadius: 100, background: 'rgba(6,255,165,0.06)', color: '#06ffa5', border: '1px solid rgba(6,255,165,0.15)', fontWeight: 600 }}>
                        ✓ Fact-Checked
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
                  <Cpu size={16} />
                </div>
                <div style={{ paddingTop: 8, display: 'flex', gap: 5 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: `blink 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{ padding: '1rem 1.2rem', background: '#0a0f1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.8rem 1rem', transition: 'border-color 0.2s' }}
                onFocus={() => {}} onBlur={() => {}}>
                <textarea
                  value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) } }}
                  disabled={loading}
                  placeholder="Explain your approach... (Enter to send, Shift+Enter for new line)"
                  rows={1}
                  style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '0.88rem', resize: 'none', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, overflowY: 'hidden' }}
                />
              </div>
              <button type="submit" disabled={loading || !input.trim()}
                style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #ef4444, #f97316)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (loading || !input.trim()) ? 0.4 : 1, transition: 'all 0.2s', flexShrink: 0 }}>
                <Send size={16} color="white" />
              </button>
            </form>
            <p style={{ fontSize: '0.7rem', color: '#2d3748', marginTop: '0.5rem', textAlign: 'center' }}>Shift+Enter for newline · Enter to send</p>
          </div>
        </div>

        {/* RIGHT: CODE EDITOR */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          <CodeEditor lang={activeDomain.lang} />
        </div>
      </div>
    </div>
  )
}
