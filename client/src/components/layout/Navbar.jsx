import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Zap, Bell, User } from 'lucide-react'
import useAuthStore from '../../store/authStore.js'
import toast from 'react-hot-toast'

const NOTIFICATIONS = [
  { id: 1, text: 'Your React Frontend class starts in 2 days!', time: '2h ago', unread: true },
  { id: 2, text: 'New course available: Flutter & Dart 2025', time: '5h ago', unread: true },
  { id: 3, text: 'Arena session results are ready to review', time: '1d ago', unread: false },
]

const S = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 5%', background: 'rgba(5,9,20,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#06ffa5', display: 'inline-block' },
  logoText: { fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#00d4ff' },
  desktopLinks: { display: 'flex', gap: '2rem', alignItems: 'center' },
  link: { color: '#6b7a99', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' },
  desktopAuth: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  userPill: { color: '#e8eaf6', textDecoration: 'none', fontSize: '0.85rem', background: 'rgba(255,255,255,0.06)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)' },
  overlay: { position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,9,20,0.97)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' },
  closeBtn: { position: 'absolute', top: '1.5rem', right: '5%', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7a99' },
  mobileLink: { fontFamily: 'Outfit,sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#e8eaf6', textDecoration: 'none' },
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const { user, logout, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const unreadCount = notifs.filter(n => n.unread).length
  const handleLogout = async () => { await logout(); toast.success('Logged out'); navigate('/') }

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })))

  return (
    <>
      <nav style={S.nav}>
        <Link to="/" style={S.logo}><span style={S.dot} /><span style={S.logoText}>NeuralPath</span></Link>

        <div style={S.desktopLinks} className="np-desktop">
          {[['/#ai-demo', 'Try AI'], ['/courses', 'Courses'], ['/#why-us', 'Why Us']].map(([to, l]) => (
            <Link key={to} to={to} style={S.link} onMouseEnter={e => e.target.style.color = '#00d4ff'} onMouseLeave={e => e.target.style.color = '#6b7a99'}>{l}</Link>
          ))}
          {isAdmin() && <Link to="/admin" style={{ ...S.link, color: '#fcd34d' }}>Admin ⚡</Link>}
        </div>

        <div style={S.desktopAuth} className="np-desktop">
          {user ? (<>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifs(!showNotifs)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7a99', position: 'relative', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6b7a99'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', fontSize: '0.6rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #050914' }}>{unreadCount}</span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifs && (
                <div style={{ position: 'absolute', top: '110%', right: 0, width: 320, background: '#0a0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, boxShadow: '0 25px 60px rgba(0,0,0,0.8)', zIndex: 500, overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>Notifications</span>
                    <button onClick={markAllRead} style={{ fontSize: '0.72rem', color: '#00d4ff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>
                  </div>
                  {notifs.map(n => (
                    <div key={n.id} style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '0.8rem', alignItems: 'flex-start', background: n.unread ? 'rgba(0,212,255,0.03)' : 'transparent', cursor: 'pointer' }}
                      onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.unread ? '#00d4ff' : 'transparent', border: n.unread ? 'none' : '1px solid #2d3748', flexShrink: 0, marginTop: 5 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.83rem', color: n.unread ? '#e2e8f0' : '#4b5d7a', lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: '0.7rem', color: '#2d3748', marginTop: '0.2rem' }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Streak */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,122,0,0.1)', color: '#ff7a00', padding: '0.4rem 0.8rem', borderRadius: 100, fontSize: '0.85rem', fontWeight: 700, border: '1px solid rgba(255,122,0,0.3)' }}>
              <span style={{ filter: 'drop-shadow(0 0 5px rgba(255,122,0,0.5))' }}>🔥</span> 3 Days
            </div>

            {/* Profile + Dashboard */}
            <Link to="/profile" style={{ ...S.userPill, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={13} /> {user.name.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Logout</button>
          </>) : (<>
            <Link to="/login" className="btn-ghost" style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}><Zap size={13} /> Enroll</Link>
          </>)}
        </div>

        <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e8eaf6' }} className="np-mobile"><Menu size={24} /></button>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div style={S.overlay}>
          <button onClick={() => setOpen(false)} style={S.closeBtn}><X size={28} /></button>
          {[['/#ai-demo', 'Try AI'], ['/courses', 'Courses'], ['/#why-us', 'Why Us']].map(([to, l]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={S.mobileLink}>{l}</Link>
          ))}
          {user ? (<>
            <Link to="/dashboard" onClick={() => setOpen(false)} style={S.mobileLink}>Dashboard</Link>
            <Link to="/profile" onClick={() => setOpen(false)} style={S.mobileLink}>My Profile</Link>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ff7a00' }}>🔥 3 Day Streak</div>
            <button onClick={() => { handleLogout(); setOpen(false) }} className="btn-ghost">Logout</button>
          </>) : (<>
            <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost">Login</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="btn-primary">Enroll Free</Link>
          </>)}
        </div>
      )}

      <style>{`@media(max-width:768px){.np-desktop{display:none!important}}.np-mobile{display:none}@media(max-width:768px){.np-mobile{display:block!important}}`}</style>
    </>
  )
}
