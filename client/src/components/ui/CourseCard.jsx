import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Clock, Zap, Sun, Moon, CalendarDays, X } from 'lucide-react'
import useAuthStore from '../../store/authStore.js'
import api from '../../api/axios.js'
import toast from 'react-hot-toast'

const LVL = {
  BEGINNER:     { bg:'rgba(6,255,165,0.12)',  color:'#06ffa5' },
  INTERMEDIATE: { bg:'rgba(0,212,255,0.12)',  color:'#00d4ff' },
  ADVANCED:     { bg:'rgba(124,58,237,0.12)', color:'#a78bfa' },
}
const GRADS = [
  'linear-gradient(135deg,#0f1b35,#1a1040)',
  'linear-gradient(135deg,#0d2020,#0a1525)',
  'linear-gradient(135deg,#1a0f30,#0d1535)',
  'linear-gradient(135deg,#0a1a20,#102030)',
  'linear-gradient(135deg,#1a1020,#200d30)',
  'linear-gradient(135deg,#0d1a10,#102018)',
]

const TRAILERS = {
  'ai-fundamentals': 'https://cdn.pixabay.com/video/2020/05/25/40156-424754593_tiny.mp4',
  'fullstack-react-node': 'https://cdn.pixabay.com/video/2021/08/04/83818-584732155_tiny.mp4',
  'ml-engineering-bootcamp': 'https://cdn.pixabay.com/video/2021/04/24/72132-540702179_tiny.mp4',
  'data-science-analytics': 'https://cdn.pixabay.com/video/2019/04/16/22812-331006935_tiny.mp4',
  'python-automation-ai': 'https://cdn.pixabay.com/video/2020/05/25/40156-424754593_tiny.mp4',
  'cs-zero-to-hero': 'https://cdn.pixabay.com/video/2021/08/04/83818-584732155_tiny.mp4',
}

function loadRazorpay() {
  return new Promise(res => {
    if (window.Razorpay) return res()
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = res; document.body.appendChild(s)
  })
}

export default function CourseCard({ course, index = 0 }) {
  const [busy, setBusy] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState('')
  const { isLoggedIn } = useAuthStore()
  const navigate = useNavigate()
  
  // Interactive Hover States
  const cardRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const lvl = LVL[course.level] || LVL.BEGINNER
  const seatsLeft = course.availableSeats ?? (course.totalSeats - course.bookedSeats)
  const isFull = seatsLeft <= 0

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleBookClick = () => {
    if (!isLoggedIn()) { navigate('/login'); return }
    setShowModal(true)
  }

  const handleConfirmBooking = async () => {
    if (!selectedBatch) return toast.error('Please select a batch timing.')
    setBusy(true)
    setShowModal(false)
    try {
      const { data } = await api.post('/bookings', { courseId: course.id, batch: selectedBatch })
      const { razorpayOrderId, amount, courseName, keyId, bookingId } = data.data

      // Local Mock Bypass
      if (keyId === 'rzp_test_dummy_key_id') {
        toast.success('Simulating local payment...')
        try {
          await api.post('/payments/verify', { razorpay_order_id: razorpayOrderId, razorpay_payment_id: 'pay_dummy_123', razorpay_signature: 'sig_dummy_123', bookingId })
          toast.success('🎉 Booking confirmed!')
          navigate('/dashboard')
        } catch (e) {
          toast.error('Mock Payment failed')
        }
        return
      }

      await loadRazorpay()
      const rzp = new window.Razorpay({
        key: keyId, amount, currency: 'INR',
        name: 'NeuralPath', description: courseName, order_id: razorpayOrderId,
        handler: async (r) => {
          try {
            await api.post('/payments/verify', { razorpay_order_id: r.razorpay_order_id, razorpay_payment_id: r.razorpay_payment_id, razorpay_signature: r.razorpay_signature, bookingId })
            toast.success('🎉 Booking confirmed!')
            navigate('/dashboard')
          } catch { toast.error('Payment verification failed. Contact support.') }
        },
        theme: { color: '#00d4ff' },
      })
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.')
    } finally { setBusy(false) }
  }

  return (
    <>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/courses/${course.id || course.slug}`)}
        className="card" 
        style={{ 
          overflow: 'hidden', 
          position: 'relative',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s, border-color 0.4s',
          transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'none',
          boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.7), 0 0 30px rgba(0,212,255,0.2)' : '0 10px 30px rgba(0,0,0,0.5)',
          borderColor: isHovered ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.06)',
          background: 'rgba(8, 15, 31, 0.75)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
        }}
      >
        {/* Magic Interactive Spotlight Glow */}
        <div 
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 212, 255, 0.15), transparent 40%)`,
            opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s',
            pointerEvents: 'none', zIndex: 0
          }} 
        />

        <div style={{ height: 180, position: 'relative', overflow: 'hidden', background: '#0a0f1d' }}>
          {/* Real AI Generated Course Image */}
          <img 
            src={`/courses/${course.slug}.png`} 
            alt={course.title}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.6s',
              transform: isHovered ? 'scale(1.12)' : 'scale(1)',
              filter: isHovered ? 'brightness(1.1) contrast(1.15)' : 'brightness(0.9) contrast(1.05)'
            }} 
          />
          {/* Fallback Emoji container in case image fails */}
          <div style={{ display: 'none', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', background: GRADS[index%GRADS.length] }}>
            {course.emoji}
          </div>
          
          {/* Cinematic Vignette Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8, 15, 31, 0.9) 0%, rgba(8, 15, 31, 0) 60%)', pointerEvents: 'none' }} />

          {/* Animated Background Matrix Pattern Overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,212,255,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: isHovered ? 0.3 : 0, transition: 'opacity 0.4s', pointerEvents: 'none', mixBlendMode: 'overlay' }} />

          {/* Looping Hover Video Trailer */}
          <video 
            src={TRAILERS[course.slug] || 'https://cdn.pixabay.com/video/2021/08/04/83817-584732148_tiny.mp4'}
            autoPlay muted loop playsInline
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: isHovered ? 1 : 0, transition: 'opacity 0.6s ease-in-out', pointerEvents: 'none', zIndex: 2
            }}
          />
          {/* Subtle gradient over video */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8, 15, 31, 1) 0%, rgba(8,15,31,0) 100%)', opacity: isHovered ? 0.8 : 0, transition: 'opacity 0.6s', pointerEvents: 'none', zIndex: 2 }} />

          {isFull && <div style={{ position:'absolute', top:12, right:12, background:'rgba(239,68,68,0.95)', color:'#fff', fontSize:'0.65rem', fontWeight:800, padding:'0.3rem 0.6rem', borderRadius:100, zIndex:3, boxShadow:'0 0 15px rgba(239,68,68,0.5)', letterSpacing: '0.05em' }}>FULL</div>}
        </div>

        <div style={{ padding: '1.4rem', position: 'relative', zIndex: 1 }}>
          <span style={{ display:'inline-block', background:lvl.bg, color:lvl.color, fontSize:'0.65rem', fontWeight:800, padding:'0.25rem 0.7rem', borderRadius:100, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.8rem' }}>{course.level}</span>
          <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.1rem', marginBottom:'0.4rem', lineHeight:1.3 }}>{course.title}</h3>
          <p style={{ fontSize:'0.82rem', color: isHovered ? '#a3b5d8' : 'var(--muted)', marginBottom:'1rem', lineHeight:1.6, transition:'color 0.3s' }}>{course.description}</p>
          
          <div style={{ display:'flex', gap:'1.2rem', marginBottom:'1.2rem' }}>
            <span style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.75rem', color:'var(--muted)', fontWeight: 500 }}><Clock size={14} color="#00d4ff"/> {course.duration}</span>
            <span style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.75rem', color: isFull?'#f87171':'var(--muted)', fontWeight: 500 }}><Users size={14} color={isFull ? '#f87171' : '#7c3aed'}/> {isFull ? 'Full' : `${seatsLeft} seats`}</span>
          </div>
          
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily:'Syne,sans-serif', fontSize:'1.25rem', fontWeight:800, color:'#00d4ff', textShadow: isHovered ? '0 0 15px rgba(0,212,255,0.4)' : 'none', transition: 'text-shadow 0.3s' }}>
              ₹{(course.priceInRupees || course.price/100).toLocaleString('en-IN')}
            </span>
            <button onClick={(e) => { e.stopPropagation(); handleBookClick(); }} disabled={isFull||busy} className="btn-primary" style={{ padding:'0.5rem 1.2rem', fontSize:'0.85rem', opacity:(isFull||busy)?0.5:1, transform: isHovered && !isFull ? 'scale(1.05)' : 'none', transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.2)', boxShadow: isHovered && !isFull ? '0 0 20px rgba(124,58,237,0.4)' : 'none' }}>
              {busy ? '...' : isFull ? 'Full' : <><Zap size={14}/> Book Class</>}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position:'fixed', inset:0, zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)' }}>
          <div className="card animate-fade-up" style={{ width:'90%', maxWidth:420, background:'#080f1f', padding:'1.8rem', border: '1px solid rgba(0,212,255,0.3)', boxShadow:'0 20px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,212,255,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.8rem' }}>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.3rem', fontWeight:800 }}>Choose Batch Timing</h3>
              <button onClick={() => setShowModal(false)} style={{ background:'transparent', border:'none', color:'var(--muted)', cursor:'pointer', transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}><X size={22}/></button>
            </div>
            
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'2rem' }}>
              {[
                { id: 'Morning', icon: <Sun size={20} color="#fcd34d" />, title: 'Weekday Morning', time: '10:00 AM - 1:00 PM' },
                { id: 'Evening', icon: <Moon size={20} color="#7c3aed" />, title: 'Weekday Evening', time: '6:00 PM - 9:00 PM' },
                { id: 'Weekend', icon: <CalendarDays size={20} color="#00d4ff" />, title: 'Weekend Intensive', time: '10:00 AM - 4:00 PM' }
              ].map(b => (
                <div key={b.id} onClick={() => setSelectedBatch(b.id)} style={{
                  padding: '1.2rem', borderRadius: 14, display: 'flex', alignItems: 'center', gap: '1.2rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
                  background: selectedBatch === b.id ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedBatch === b.id ? 'rgba(0,212,255,0.6)' : 'rgba(255,255,255,0.05)'}`,
                  transform: selectedBatch === b.id ? 'scale(1.02)' : 'none',
                  boxShadow: selectedBatch === b.id ? '0 10px 30px rgba(0,212,255,0.15)' : 'none'
                }}>
                  <div style={{ padding: '0.8rem', background: selectedBatch === b.id ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)', borderRadius: '50%', transition: 'background 0.3s' }}>{b.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: selectedBatch === b.id ? '#00d4ff' : '#e8eaf6', marginBottom: '0.2rem' }}>{b.title}</div>
                    <div style={{ fontSize: '0.85rem', color: selectedBatch === b.id ? '#8796b5' : 'var(--muted)' }}>{b.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleConfirmBooking} disabled={!selectedBatch} className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', opacity: !selectedBatch ? 0.5 : 1, fontWeight: 700 }}>
              Confirm & Book
            </button>
          </div>
        </div>
      )}
    </>
  )
}
