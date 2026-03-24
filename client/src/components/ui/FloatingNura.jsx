import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'

export default function FloatingNura() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const [msgs, setMsgs]   = useState([{ role: 'assistant', content: 'Hi! I\'m Nura 👋 Ask me anything about our offline classes, batches, or timings!' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, isOpen])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const newMsgs = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      const history = newMsgs.slice(1, -1).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
      const { data } = await api.post('/chat', { message: text, history })
      
      let replyText = data.data.reply
      const navMatch = replyText.match(/\[NAVIGATE:(.*?)\]/)
      
      if (navMatch) {
        const route = navMatch[1].trim()
        replyText = replyText.replace(navMatch[0], '').trim()
        setTimeout(() => {
          toast.success(`Nura is navigating you...`, { icon: '🤖' })
          setIsOpen(false)
          navigate(route)
        }, 1800)
      }

      setMsgs(prev => [...prev, { role: 'assistant', content: replyText }])
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: 'I\'m having a small issue — please try again! 🙏' }])
    } finally { setLoading(false) }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="animate-pulse-glow"
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
          border: 'none', cursor: 'pointer', display: isOpen ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 40px rgba(0,212,255,0.4)', transition: 'transform 0.3s'
        }}
      >
        <span style={{ fontSize: '1.7rem' }}>🤖</span>
      </button>

      {isOpen && (
        <div className="card animate-fade-up" style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
          width: 'calc(100vw - 40px)', maxWidth: 380, maxHeight: '85vh', 
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.15)',
          overflow: 'hidden'
        }}>
          <div style={{ background: 'rgba(0,212,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>🤖</div>
              <div style={{ minWidth: 0 }}>
                <div className="gradient-text" style={{ fontSize: '0.95rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Nura AI</div>
                <div style={{ fontSize: '0.75rem', color: '#06ffa5', display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06ffa5', animation: 'blink 1.5s infinite' }}></span>
                  Bengaluru Centre
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background:'transparent', border:'none', color:'#6b7a99', cursor:'pointer' }}><X size={20}/></button>
          </div>

          <div style={{ padding: '1rem', minHeight: 320, maxHeight: 420, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#080f1f' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.role === 'user' ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                  {m.role === 'user' ? '👤' : '🤖'}
                </div>
                <div style={{
                  padding: '0.65rem 0.95rem', borderRadius: 14, fontSize: '0.87rem', lineHeight: 1.55, maxWidth: '80%', whiteSpace: 'pre-wrap',
                  ...(m.role === 'user'
                    ? { background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', color: '#fff', borderBottomRightRadius: 4 }
                    : { background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.18)', color: '#e8eaf6', borderBottomLeftRadius: 4 }),
                }}>{m.content}</div>
              </div>
            ))}
            {loading && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>🤖</div>
              <div style={{ padding: '0.75rem 1rem', borderRadius: 14, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.18)', display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <span key={i} style={{ width:7,height:7,borderRadius:'50%',background:'#00d4ff',animation:`blink 1.2s ${i*0.2}s infinite`}} />)}
              </div>
            </div>}
            <div ref={bottomRef} />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#050914' }}>
            <input
              className="input" style={{ borderRadius: 100, paddingTop: '0.55rem', paddingBottom: '0.55rem', fontSize: '0.85rem' }}
              placeholder="Ask about batches or timings…" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
              background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: (loading || !input.trim()) ? 0.5 : 1
            }}><Send size={15} color="white" /></button>
          </div>
        </div>
      )}
    </>
  )
}
